import { createWriteStream } from 'node:fs';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const guide = JSON.parse(await readFile('contenido/guion.json', 'utf8'));
const blocks = [
  ...guide.intro.blocks,
  ...guide.places.flatMap((place) => place.blocks ?? [])
];
const selectedBlocks = process.argv.includes('--sample') ? blocks.slice(0, 2) : blocks;
const tts = new MsEdgeTTS();
await tts.setMetadata(guide.voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
const force = process.argv.includes('--force');
let generated = 0;
let skipped = 0;

function buildSsml(text) {
  const safeText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const sentences = safeText.split(/(?<=[.!?])\s+/).filter(Boolean);
  const withPauses = sentences
    .map((sentence, index) => (index === 0 ? sentence : `<break time="220ms"/>${sentence}`))
    .join(' ');

  return `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-CO">
      <voice name="${guide.voice}">
        <prosody rate="medium" pitch="+2Hz">
          ${withPauses}
        </prosody>
      </voice>
    </speak>
  `;
}

for (const block of selectedBlocks) {
  const target = resolve(block.audio);
  if (!force) {
    try {
      const existing = await stat(target);
      if (existing.size > 1000) {
        skipped += 1;
        continue;
      }
      if (existing.size <= 1000) {
        await import('node:fs/promises').then(({ unlink }) => unlink(target)).catch(() => {});
      }
    } catch {}
  }

  await mkdir(dirname(target), { recursive: true });
  try {
    const ssml = buildSsml(block.text);
    const { audioStream } = tts.toStream(ssml, { rate: 0, pitch: '+0Hz' });
    await pipeline(audioStream, createWriteStream(target));
    const finalSize = (await stat(target)).size;
    if (finalSize <= 1000) {
      await import('node:fs/promises').then(({ unlink }) => unlink(target)).catch(() => {});
      throw new Error(`Archivo en blanco generado para ${block.audio}`);
    }
    generated += 1;
    console.log(`Generado: ${block.audio}`);
  } catch (error) {
    try {
      await import('node:fs/promises').then(({ unlink }) => unlink(target)).catch(() => {});
    } catch {}
    console.warn(`No se pudo generar ${block.audio}:`, error.message ?? error);
  }
}

console.log(`Listo: ${generated} audios generados, ${skipped} existentes conservados.`);

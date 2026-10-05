# Curso interactivo "La ciudad del buen servicio" – Multiser

## 1. Qué estamos construyendo
Un recorrido interactivo en formato de ciudad ilustrada para personas empleadas del área de facturación de un hospital (empresa: **Multiser**, Colombia). Una guía llamada **Camila** acompaña todo el recorrido, camina por las calles de la ciudad y explica, en voz y con subtítulos, los temas del manual de servicio al ciudadano (archivo PDF en esta carpeta: léelo completo antes de empezar y usa SOLO su contenido para los temas).

- Idioma: español de Colombia. Lenguaje claro, cercano, cálido.
- Esto es contenido de conocimiento. **No hay preguntas, respuestas, quizzes ni puntajes.** (La prueba valorativa se hará en una fase posterior, no ahora.)
- **No se guarda progreso.** Cada persona lo hace en su propio navegador, de principio a fin.
- Funciona con internet, en el navegador (Chrome, Edge, Firefox) y también en celular.
- Se va a incrustar dentro de Moodle (ver sección 8).

## 2. Experiencia, de principio a fin
1. **Pantalla de inicio** con botón grande "¡Comenzar el recorrido!" (necesario para que el navegador permita audio).
2. **Vista aérea global de la ciudad**: se ve toda, con calles, árboles, tráfico y el cofre/plaza final insinuado. Camila saluda en off.
3. **Acercamiento (zoom) cinematográfico** hacia el punto de partida y aparece Camila.
4. Camila **camina por las calles** hasta el siguiente lugar. Los lugares están LEJOS entre sí: debe cruzar varias calles, esquinas, un parque, un puente o una rotonda. La cámara la sigue, hace zoom in/out y cambia de plano (panorámica, plano medio, primer plano al hablar). Durante el trayecto Camila comenta algo breve y simpático.
5. **Al llegar a cada lugar**, el edificio se anima, la cámara se acerca, aparece una tarjeta con el tema y Camila lo explica con voz y subtítulos.
6. Tras los 9 temas, Camila llega a la **plaza final** y se abre el **cofre del tesoro** (animación con confeti, sonido, mensaje de felicitación).
7. Controles: botón de pausa/continuar, silenciar música/ambiente, activar/desactivar subtítulos, "repetir este tema" y "siguiente". Nada de guardar avance.

## 3. Los 9 lugares y sus temas (confirmar con la persona dueña del proyecto)
El orden es sugerido; revisa que el PDF respalde cada tema y usa sus frases clave fielmente.

| # | Lugar | Tema (del manual) |
|---|-------|-------------------|
| 1 | Hotel | Todo buen servicio empieza en la puerta: saludar con una sonrisa y llamar al ciudadano por su nombre. |
| 2 | Casa de Justicia | Los siete atributos del buen servicio: respetuoso, amable, confiable, empático, incluyente, oportuno y efectivo. |
| 3 | Imagen y Estilo | Presentación personal: imagen apropiada para el rol y carné siempre visible. |
| 4 | Banco | Atención preferencial: adultos mayores, mujeres embarazadas, niños, niñas y adolescentes, personas en situación de vulnerabilidad, grupos étnicos minoritarios, personas con discapacidad o de talla baja, personas con identidades de género distintas. |
| 5 | Biblioteca | Lenguaje claro: prioridad del Estado; reduce errores, costos y aclaraciones; da transparencia; facilita que todos entiendan, incluso personas con discapacidad. |
| 6 | Oficina Postal | Atención telefónica en 4 pasos: saludar (buenos días/tardes), nombrar la unidad funcional, identificarse con nombre, apellidos y cargo, y preguntar "¿en qué le puedo servir?". |
| 7 | Oficina de Correo | Correo institucional: revisarlo en los primeros 10 minutos de la jornada (mañana y tarde), solo cuenta institucional, firma completa, asunto claro, tono cortés, impersonal y preciso, responder todas las preguntas. |
| 8 | Hospital | Derechos del paciente: 4 grupos (a ser informado, a recibir, a elegir, a que se proteja). **Interacción:** 4 tarjetas/íconos tocables; al tocar cada uno Camila lo explica. Destacar que el primero incluye conocer los costos de la atención, algo que facturación comunica a diario. |
| 9 | Punto de Información (propuesto) | La brújula: un usuario perdido necesita orientación. **Interacción:** un buscador donde la persona escribe un servicio y se muestra en un mapa del hospital dónde queda (usar un listado de servicios de ejemplo en un archivo editable). |

Nota: en la lista original había "oficina de correo" y "oficina postal" y solo 8 sitios distintos para 9 temas; se propone el Punto de Información como noveno lugar. Si el dueño del proyecto prefiere otro, se cambia en `contenido/lugares.json`.

## 4. Camila (personaje y voz)
**Apariencia:** personaje 3D estilo Pixar (proporciones estilizadas, ojos grandes y expresivos, piel y cabello con aspecto suave y cálido). Cabello largo **recogido**. Uniforme **azul claro**: buso con **cuello en V y manga corta**. **Tenis blancos**.

**Animaciones necesarias:** caminar (4 direcciones o 2 con espejo), quieta/respirando, saludar, hablar con gestos, señalar, celebrar (cofre). Boca/expresiones que cambien al hablar.

**Cómo debe sonar (esto falló antes, es CRÍTICO):**
- Voz humana, **cálida, efusiva, alegre, con ritmo variado y pausas naturales**. NADA de tono robótico ni serio.
- Usar una voz neuronal en **español de Colombia** (por ejemplo `es-CO-SalomeNeural` con el paquete `edge-tts`, o una alternativa de mejor calidad si se dispone de clave). Generar los audios **de antemano** como archivos `.mp3` (uno por frase o párrafo corto) y empaquetarlos; NO usar la voz robótica del navegador (`speechSynthesis`) salvo como último recurso.
- Ajustar velocidad/tono de forma sutil y usar SSML cuando la voz lo permita (énfasis, pausas) para que suene entusiasta.
- Los textos deben estar escritos como se habla: frases cortas, muletillas amables ("¡Miren esto!", "Fíjense", "¿Listos?"), tuteo/ustedeo consistente (usar "ustedes" porque habla a un grupo de colegas), tono cercano. Cada tema se reparte en 3 a 5 bloques cortos, no en un párrafo largo.
- Subtítulos sincronizados con el audio, siempre disponibles.

## 5. Ciudad y cámara (otro error anterior)
- Mapa **amplio**, con calles que forman un recorrido real. Distancia entre lugares: Camila debe caminar entre 15 y 30 segundos entre uno y otro, pasando por esquinas, cruce peatonal, parque, puente, rotonda, mercado, etc.
- Alternar planos: aéreo global (inicio), seguimiento, plano medio cuando habla, acercamiento al edificio, panorámica al llegar a la plaza final.
- Vida en la ciudad: carros circulando, semáforos, peatones, aves, árboles moviéndose, nubes, fuentes de agua, banderines.
- Cada edificio debe ser **distinto y reconocible** (letrero y fachada propios).
- Estilo visual: **colores muy llamativos y vibrantes**, limpio, bonito, bien presentado. Tipografía legible (incluir las fuentes dentro del proyecto, no depender de CDNs).

## 6. Sonido
- Ambiente continuo de ciudad (tráfico lejano, pitos suaves), naturaleza (pájaros, viento) y sonidos propios de cada lugar (campanita del hotel, murmullo de biblioteca, teclas en oficina, etc.).
- Música de fondo suave y alegre, con volumen que **baja automáticamente cuando Camila habla** (ducking).
- Sonido de pasos, de llegada a cada lugar y fanfarria al abrir el cofre.
- Usar solo audios libres de derechos (CC0 o equivalentes) o generados; **registrar cada fuente y licencia en `CREDITOS.md`**.
- Control de volumen y botón de silencio visibles.

## 7. Calidad y pruebas (obligatorio, para no repetir errores pasados)
Antes de decir que algo está listo:
1. Ejecutar el proyecto y revisar la **consola del navegador: cero errores**.
2. Verificar que **todos los textos se ven** (fuentes locales con respaldo, sin cuadritos ni espacios en blanco), con tildes y "ñ" correctas.
3. Probar con navegador automatizado (Playwright) y tomar capturas de: inicio, vista aérea, caminata, cada lugar, plaza final. Revisarlas y corregir.
4. Probar en pantalla de computador y en celular (vertical y horizontal).
5. Si algo falla, mostrar el error EXACTO y corregirlo; no ocultarlo ni inventar que funciona.
6. Todo el contenido (guion, lugares, servicios del buscador) en archivos JSON editables dentro de `contenido/`, para cambiar textos sin tocar código.
7. Sin dependencias externas en tiempo de ejecución (todo local: fuentes, imágenes, audios, librerías), porque Moodle puede bloquear recursos externos.

## 8. Entrega e integración con Moodle
- Generar una carpeta `dist/` estática con rutas **relativas** (funciona en cualquier subcarpeta).
- Generar además: (a) un `.zip` del sitio, y (b) un paquete **SCORM 1.2 sin seguimiento de progreso** (solo para que Moodle lo abra dentro de su misma página; no registra nada). Documentar cómo subir cada uno.
- Dejar listo un **enlace de vista previa** (por ejemplo Netlify o GitHub Pages) para que el dueño del proyecto lo revise en su navegador.
- Escribir `LEEME-MOODLE.md` con pasos simples para publicarlo en Moodle y qué pedirle al administrador si Moodle bloquea la incrustación.

## 9. Forma de trabajar (por fases, con aprobación)
No construyas todo de una vez. Al terminar cada fase, resume qué hiciste, muestra capturas/enlace y **espera mi aprobación**:
- **Fase 0:** Leer el PDF, proponer estructura técnica, paleta de colores y estilo de Camila. Escribir `contenido/guion.json` (todo lo que dirá Camila, por lugar y por bloques, en tono efusivo). Esperar aprobación del guion.
- **Fase 1:** Ciudad completa (vista aérea, calles, edificios distintos, tráfico) + cámara con zoom y seguimiento.
- **Fase 2:** Camila (personaje, animaciones, caminata por el recorrido con todos los planos).
- **Fase 3:** Voz y subtítulos de los 9 temas, interacciones del Hospital (4 derechos) y del Punto de Información (buscador).
- **Fase 4:** Sonido ambiente, música, efectos, plaza final y cofre del tesoro.
- **Fase 5:** Pruebas, pulido, adaptación a celular, paquetes (zip + SCORM) y enlace final.

## 10. Lo que NO se debe hacer
- No agregar preguntas, evaluaciones, puntajes, insignias ni guardado de progreso.
- No usar voz robótica ni texto formal/rígido para Camila.
- No poner los edificios cerca unos de otros.
- No usar recursos externos que puedan bloquearse en Moodle.
- No inventar contenido que no esté en el manual; si falta algo, pregunta.

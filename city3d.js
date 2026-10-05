const placeData = [
  { id: 'hotel', name: 'Hotel', position: [-48, 32], color: 0xf3902e, height: 12, style: 'hotel' },
  { id: 'justicia', name: 'Casa de Justicia', position: [-16, -2], color: 0x35c47a, height: 13, style: 'justice' },
  { id: 'imagen-estilo', name: 'Imagen y Estilo', position: [16, -38], color: 0xee678e, height: 10, style: 'studio' },
  { id: 'banco', name: 'Banco', position: [48, -2], color: 0x45b84d, height: 12, style: 'bank' },
  { id: 'biblioteca', name: 'Biblioteca', position: [48, -38], color: 0x3499d1, height: 14, style: 'library' },
  { id: 'postal', name: 'Oficina Postal', position: [-48, -38], color: 0xf6c331, height: 9, style: 'postal' },
  { id: 'correo', name: 'Oficina de Correo', position: [-16, 32], color: 0x2cb889, height: 10, style: 'mail' },
  { id: 'hospital', name: 'Hospital', position: [16, 32], color: 0x32b9da, height: 11, style: 'hospital' },
  { id: 'informacion', name: 'Punto de Información', position: [48, 32], color: 0xef6a45, height: 9, style: 'info' }
];

const sceneElement = document.getElementById('scene');
const canvas = document.getElementById('cityCanvas');
const descriptionElement = document.getElementById('placeDescription');
const nextPlaceHint = document.getElementById('nextPlaceHint');
const captionElement = document.getElementById('sceneCaption');
const resetButton = document.getElementById('resetView');
const placeButtons = [...document.querySelectorAll('.place-button')];
const subtitleElement = document.getElementById('subtitle');
const attributePanel = document.getElementById('attributePanel');
const attributeList = document.getElementById('attributeList');
const controlsElement = document.getElementById('tourControls');
const startOverlay = document.getElementById('startOverlay');
const startButton = document.getElementById('startTour');
const pauseButton = document.getElementById('pauseTour');
const repeatButton = document.getElementById('repeatTopic');
const captionsButton = document.getElementById('toggleCaptions');
const soundButton = document.getElementById('toggleSound');
const nextPlaceButton = document.getElementById('nextPlace');
const keyCounter = document.getElementById('keyCounter');
const keyCountElement = document.getElementById('keyCount');
const arrivalToast = document.getElementById('arrivalToast');
const treasureOverlay = document.getElementById('treasureOverlay');
const celebrationEffects = document.getElementById('celebrationEffects');
const closeTreasureButton = document.getElementById('closeTreasure');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

const world = new THREE.Scene();
world.background = new THREE.Color(0x37b9ed);
world.fog = new THREE.Fog(0x5caee7, 120, 260);

const camera = new THREE.PerspectiveCamera(38, sceneElement.clientWidth / sceneElement.clientHeight, 0.1, 420);
camera.position.set(0, 110, 145);

const hemisphere = new THREE.HemisphereLight(0xfff3d0, 0x5a8f53, 1.1);
world.add(hemisphere);

const sunlight = new THREE.DirectionalLight(0xffe0a3, 2.2);
sunlight.position.set(-60, 105, 65);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -100;
sunlight.shadow.camera.right = 100;
sunlight.shadow.camera.top = 100;
sunlight.shadow.camera.bottom = -100;
sunlight.shadow.bias = -0.0004;
world.add(sunlight);

const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x56c947, roughness: 0.94 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(190, 160), groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.13;
ground.receiveShadow = true;
world.add(ground);

function addSkyBackdrop() {
  const backdrop = new THREE.Group();

  const mountainMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e66a4,
    roughness: 1,
    emissive: 0x174781,
    emissiveIntensity: 0.18
  });

  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xdff7ff,
    roughness: 1,
    transparent: true,
    opacity: 0.9
  });

  const mountainGeometry = new THREE.ConeGeometry(18, 26, 5);
  const mountainPositions = [-82, -46, -10, 26, 62, 94];
  mountainPositions.forEach((x, index) => {
    const mount = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mount.position.set(x, 20 + (index % 2) * 7, -90 - index * 4);
    mount.rotation.z = (index % 2 === 0 ? 1 : -1) * 0.14;
    mount.scale.set(1.1 + (index % 3) * 0.4, 1 + (index % 2) * 0.2, 1);
    backdrop.add(mount);
  });

  const cloudData = [
    { x: -78, y: 38, z: -108, scale: 1.4 },
    { x: -36, y: 45, z: -118, scale: 1.9 },
    { x: 18, y: 40, z: -112, scale: 1.6 },
    { x: 62, y: 48, z: -120, scale: 2.1 },
    { x: 92, y: 34, z: -108, scale: 1.4 }
  ];

  cloudData.forEach((cloud) => {
    const puff = new THREE.Group();
    [
      [-1.8, 0, 0], [0, 0.8, 0.2], [1.8, 0, 0], [0.2, -0.5, 0.1]
    ].forEach(([x, y, z]) => {
      const part = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), cloudMaterial);
      part.position.set(x, y, z);
      part.scale.set(1.2, 0.9, 0.9);
      puff.add(part);
    });
    puff.position.set(cloud.x, cloud.y, cloud.z);
    puff.scale.setScalar(cloud.scale);
    backdrop.add(puff);
  });

  world.add(backdrop);
}

addSkyBackdrop();

const cityRoot = new THREE.Group();
world.add(cityRoot);

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x2d6177, roughness: 0.46, metalness: 0.26, emissive: 0x16495f, emissiveIntensity: 0.24 });
const curbMaterial = new THREE.MeshStandardMaterial({ color: 0xf7ca4b, roughness: 0.64, emissive: 0x9b6c0c, emissiveIntensity: 0.14 });
const laneMaterial = new THREE.MeshStandardMaterial({ color: 0xffd75f, roughness: 0.28, emissive: 0xffb400, emissiveIntensity: 0.82 });
const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0xe9b75a, roughness: 0.7, emissive: 0x986015, emissiveIntensity: 0.12 });

function addBox(parent, width, height, depth, material, x, y, z, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addRoads() {
  const horizontal = [-55, -20, 15, 50];
  const vertical = [-65, -32, 0, 32, 65];

  horizontal.forEach((z) => {
    addBox(cityRoot, 174, 0.28, 8.8, curbMaterial, 0, 0.02, z, { castShadow: false });
    addBox(cityRoot, 174, 0.24, 7.3, roadMaterial, 0, 0.18, z, { castShadow: false });
    for (let x = -83; x < 83; x += 9) {
      addBox(cityRoot, 4.2, 0.025, 0.16, laneMaterial, x, 0.31, z, { castShadow: false });
    }
    addBox(cityRoot, 174, 0.28, 1.7, sidewalkMaterial, 0, 0.12, z + 5.2, { castShadow: false });
    addBox(cityRoot, 174, 0.28, 1.7, sidewalkMaterial, 0, 0.12, z - 5.2, { castShadow: false });
  });

  vertical.forEach((x) => {
    addBox(cityRoot, 8.8, 0.28, 148, curbMaterial, x, 0.02, 0, { castShadow: false });
    addBox(cityRoot, 7.3, 0.24, 148, roadMaterial, x, 0.18, 0, { castShadow: false });
    for (let z = -70; z < 70; z += 9) {
      addBox(cityRoot, 0.16, 0.025, 4.2, laneMaterial, x, 0.31, z, { castShadow: false });
    }
    addBox(cityRoot, 1.7, 0.28, 148, sidewalkMaterial, x + 5.2, 0.12, 0, { castShadow: false });
    addBox(cityRoot, 1.7, 0.28, 148, sidewalkMaterial, x - 5.2, 0.12, 0, { castShadow: false });
  });

  addCrosswalk(-32, 15, true);
  addCrosswalk(32, -20, false);
  addCrosswalk(0, 50, false);
}

function addCrosswalk(x, z, horizontal) {
  const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f2e8, roughness: 0.8 });
  for (let step = -3; step <= 3; step += 1) {
    const stripe = horizontal
      ? [0.72, 0.035, 0.75, x + step * 1.05, 0.34, z]
      : [0.75, 0.035, 0.72, x, 0.34, z + step * 1.05];
    addBox(cityRoot, ...stripe.slice(0, 3), stripeMaterial, ...stripe.slice(3), { castShadow: false });
  }
}

function makeFacadeTexture(baseColor, style) {
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 256;
  textureCanvas.height = 256;
  const context = textureCanvas.getContext('2d');
  const color = `#${baseColor.toString(16).padStart(6, '0')}`;
  context.fillStyle = color;
  context.fillRect(0, 0, 256, 256);

  const shade = context.createLinearGradient(0, 0, 256, 256);
  shade.addColorStop(0, 'rgba(255,255,255,0.22)');
  shade.addColorStop(0.55, 'rgba(255,255,255,0.015)');
  shade.addColorStop(1, 'rgba(21,37,38,0.23)');
  context.fillStyle = shade;
  context.fillRect(0, 0, 256, 256);

  context.fillStyle = 'rgba(49,66,64,0.12)';
  for (let row = 0; row < 8; row += 1) {
    context.fillRect(0, row * 37 + 26, 256, style === 'bank' ? 3 : 2);
  }
  for (let index = 0; index < 180; index += 1) {
    const light = index % 3 === 0;
    context.fillStyle = light ? 'rgba(255,255,255,0.045)' : 'rgba(24,38,36,0.025)';
    context.fillRect((index * 67) % 256, (index * 43) % 256, 2, 2);
  }

  context.fillStyle = 'rgba(33,45,43,0.44)';
  context.fillRect(0, 224, 256, 32);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function makeSignTexture(label) {
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 112;
  const context = signCanvas.getContext('2d');
  context.fillStyle = 'rgba(26,48,52,0.9)';
  context.beginPath();
  context.roundRect(5, 5, 502, 102, 10);
  context.fill();
  context.strokeStyle = 'rgba(246,225,165,0.84)';
  context.lineWidth = 5;
  context.stroke();
  context.fillStyle = '#fff4d7';
  context.font = 'bold 42px Trebuchet MS, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 256, 58, 470);
  const texture = new THREE.CanvasTexture(signCanvas);
  texture.encoding = THREE.sRGBEncoding;
  return texture;
}

function addFacadeWindows(group, width, height, depth, style) {
  const columns = Math.max(3, Math.floor(width / 2.45));
  const rows = Math.max(2, Math.floor((height - 2.4) / 2.8));
  const count = columns * rows;
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: style === 'bank' ? 0x62a2b1 : style === 'hospital' ? 0x9fc9ca : 0x668993,
    roughness: style === 'bank' ? 0.2 : 0.3,
    metalness: style === 'bank' ? 0.18 : 0.04,
    emissive: 0x233c43,
    emissiveIntensity: 0.11
  });
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xe0d9c4, roughness: 0.82 });
  const mullionMaterial = new THREE.MeshStandardMaterial({ color: 0x525e5a, roughness: 0.74 });
  const panes = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 1.55, 0.14), glassMaterial, count);
  const frames = new THREE.InstancedMesh(new THREE.BoxGeometry(1.58, 1.84, 0.12), frameMaterial, count);
  const mullions = new THREE.InstancedMesh(new THREE.BoxGeometry(0.075, 1.55, 0.12), mullionMaterial, count);
  const scratch = new THREE.Object3D();
  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    const y = 2.1 + row * ((height - 3.5) / Math.max(1, rows - 1));
    for (let column = 0; column < columns; column += 1) {
      const x = -width / 2 + (column + 1) * width / (columns + 1);
      const frontZ = depth / 2 + 0.11;
      scratch.position.set(x, y + 0.5, frontZ);
      scratch.updateMatrix();
      frames.setMatrixAt(index, scratch.matrix);
      scratch.position.z = frontZ + 0.08;
      scratch.updateMatrix();
      panes.setMatrixAt(index, scratch.matrix);
      scratch.position.z += 0.09;
      scratch.scale.set(1, 1, 1);
      scratch.updateMatrix();
      mullions.setMatrixAt(index, scratch.matrix);
      index += 1;
    }
  }
  group.add(frames, panes, mullions);
}

function createBuilding(place, index) {
  const group = new THREE.Group();
  group.position.set(place.position[0], 0, place.position[1]);
  group.userData.placeIndex = index;
  const width = place.style === 'hospital' ? 17 : place.style === 'library' ? 14 : 12;
  const depth = place.style === 'hospital' ? 12 : 10;
  const facade = new THREE.MeshStandardMaterial({
    map: makeFacadeTexture(place.color, place.style),
    color: 0xffffff,
    roughness: place.style === 'bank' ? 0.42 : 0.84,
    metalness: place.style === 'bank' ? 0.16 : 0.02
  });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x776552, roughness: 0.92 });
  const foundation = new THREE.MeshStandardMaterial({ color: 0xb5a98f, roughness: 0.95 });

  addBox(group, width + 4, 0.44, depth + 4, foundation, 0, 0.25, 0, { castShadow: false });
  addBox(group, width, place.height, depth, facade, 0, place.height / 2 + 0.5, 0);
  addBox(group, width + 0.8, 0.7, depth + 0.8, roofMaterial, 0, place.height + 0.85, 0);
  addFacadeWindows(group, width, place.height, depth, place.style);
  addBox(group, 1.6, 2.8, 0.24, new THREE.MeshStandardMaterial({ color: 0x354c50, roughness: 0.44, metalness: 0.12 }), 0, 1.9, depth / 2 + 0.2);

  if (place.style === 'hotel') {
    const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0x9d4e43, roughness: 0.72 });
    addBox(group, width + 2, 0.5, 3.4, canopyMaterial, 0, 4.2, depth / 2 + 1.2);
    [-3.4, 3.4].forEach((x) => addBox(group, 0.34, 3.6, 0.34, foundation, x, 2.2, depth / 2 + 1.4));
    addBox(group, width - 2, 0.5, 1.3, roofMaterial, 0, place.height + 1.5, 0);
  }

  if (place.style === 'justice') {
    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d7b8, roughness: 0.85 });
    [-4, -1.4, 1.4, 4].forEach((x) => {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 7, 10), columnMaterial);
      column.position.set(x, 4, depth / 2 + 0.2);
      column.castShadow = true;
      group.add(column);
    });
    addBox(group, width + 1, 0.8, 1.3, columnMaterial, 0, 7.9, depth / 2 + 0.25);
  }

  if (place.style === 'studio') {
    const roof = new THREE.MeshStandardMaterial({ color: 0x526b72, roughness: 0.6 });
    addBox(group, width + 1.6, 1.1, depth + 1.6, roof, 0, place.height + 1.45, 0);
    const awning = new THREE.MeshStandardMaterial({ color: 0xd48c65, roughness: 0.75 });
    addBox(group, width + 1, 0.36, 2.2, awning, 0, 3.2, depth / 2 + 0.9);
  }

  if (place.style === 'bank') {
    const glass = new THREE.MeshStandardMaterial({ color: 0x4e8190, metalness: 0.3, roughness: 0.22 });
    addBox(group, width + 1.2, 1.3, depth + 1.2, glass, 0, place.height + 1.5, 0);
    addBox(group, width - 2, 0.25, depth + 1.4, new THREE.MeshStandardMaterial({ color: 0xd2c8a6 }), 0, 5, 0);
  }

  if (place.style === 'library') {
    const roof = new THREE.MeshStandardMaterial({ color: 0x557b78, roughness: 0.82 });
    addBox(group, width + 2, 1.1, depth + 2, roof, 0, place.height + 1.5, 0);
    for (let x = -4.5; x <= 4.5; x += 3) {
      addBox(group, 0.45, place.height * 0.58, 0.7, new THREE.MeshStandardMaterial({ color: 0xe8dfc4 }), x, place.height * 0.32, depth / 2 + 0.3);
    }
  }

  if (place.style === 'postal' || place.style === 'mail') {
    const canopy = new THREE.MeshStandardMaterial({ color: place.style === 'postal' ? 0x9c4a37 : 0x487b64, roughness: 0.8 });
    addBox(group, width + 1.2, 0.45, 2.4, canopy, 0, 3.3, depth / 2 + 0.9);
    addBox(group, 1.3, 1.6, 0.3, new THREE.MeshStandardMaterial({ color: 0xecd89e }), width / 3, 1.55, depth / 2 + 0.24);
  }

  if (place.style === 'hospital') {
    const wing = new THREE.MeshStandardMaterial({ color: 0xd4e8e6, roughness: 0.72 });
    addBox(group, 5.5, 4.4, 5.2, wing, -7.8, 2.7, -1.7);
    const crossMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f4e8, emissive: 0x6a8f8d, emissiveIntensity: 0.14 });
    addBox(group, 0.9, 4.6, 0.42, crossMaterial, 0, place.height + 3.3, depth / 2 + 0.48);
    addBox(group, 3.4, 0.9, 0.42, crossMaterial, 0, place.height + 3.3, depth / 2 + 0.48);
  }

  if (place.style === 'info') {
    const roof = new THREE.MeshStandardMaterial({ color: 0x487d79, roughness: 0.8 });
    addBox(group, width + 1, 0.8, depth + 1, roof, 0, place.height + 1.3, 0);
    addBox(group, 0.35, 5.5, 0.35, roof, -4.8, 3.1, 3.8);
    addBox(group, 0.35, 5.5, 0.35, roof, 4.8, 3.1, 3.8);
    addBox(group, 8.8, 0.45, 0.35, roof, 0, 5.8, 3.8);
  }

  const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeSignTexture(place.name), transparent: true, depthWrite: false }));
  sign.position.set(0, Math.max(5.2, place.height * 0.56), depth / 2 + 1.1);
  sign.scale.set(9.2, 2.05, 1);
  group.add(sign);
  const key = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: 0xffd45d, metalness: 0.7, roughness: 0.24, emissive: 0x8b5713, emissiveIntensity: 0.2 });
  const keyRing = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.15, 10, 20), gold);
  key.add(keyRing);
  addBox(key, 1.65, 0.24, 0.24, gold, 0.98, 0, 0);
  addBox(key, 0.22, 0.5, 0.24, gold, 1.52, -0.18, 0);
  key.position.set(-width * 0.58, place.height + 3.8, depth / 2 + 1.6);
  key.rotation.z = -0.28;
  key.visible = false;
  key.traverse((object) => { if (object.isMesh) object.castShadow = true; });
  group.add(key);
  group.userData.key = key;
  group.userData.pickable = true;
  cityRoot.add(group);
  return group;
}

const treePivots = [];
function createTree(x, z, size = 1) {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(size);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x7a533b, roughness: 0.82, metalness: 0.06 });
  const leaves = [0x22c55e, 0x4ade80, 0x84cc16, 0xfacc15, 0x35d399, 0x16a34a];
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 4.8, 7), trunkMaterial);
  trunk.position.y = 2.4;
  trunk.castShadow = true;
  tree.add(trunk);
  const canopy = new THREE.Group();
  canopy.position.y = 5.3;
  for (let index = 0; index < 6; index += 1) {
    const radius = index === 0 ? 2.35 : 1.55;
    const ball = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius, 1),
      new THREE.MeshStandardMaterial({ color: leaves[index % leaves.length], roughness: 0.95, flatShading: true })
    );
    if (index === 0) {
      ball.position.y = 0.55;
    } else {
      const angle = (index - 1) / 5 * Math.PI * 2;
      ball.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
    }
    ball.castShadow = true;
    canopy.add(ball);
  }
  tree.add(canopy);
  treePivots.push(canopy);
  cityRoot.add(tree);
}

const carGroups = [];
function createCar(color, z, initialX, direction = 1) {
  const car = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color, roughness: 0.18, metalness: 0.38, emissive: new THREE.Color(color).multiplyScalar(0.18), emissiveIntensity: 0.8 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.12, metalness: 0.32, emissive: 0x0ea5e9, emissiveIntensity: 0.25 });
  const tire = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.82, metalness: 0.18 });
  addBox(car, 4.2, 1.1, 1.9, paint, 0, 1.1, 0);
  addBox(car, 2.2, 1, 1.65, glass, -0.15, 2, 0);
  for (const x of [-1.35, 1.35]) {
    for (const side of [-1, 1]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 12), tire);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.62, side * 0.94);
      wheel.castShadow = true;
      car.add(wheel);
    }
  }
  car.position.set(initialX, 0.32, z);
  car.userData.direction = direction;
  carGroups.push(car);
  cityRoot.add(car);
}

function createStreetLight(x, z, rotation = 0) {
  const light = new THREE.Group();
  light.position.set(x, 0, z);
  light.rotation.y = rotation;
  const metal = new THREE.MeshStandardMaterial({ color: 0x54666a, metalness: 0.55, roughness: 0.48 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 6, 8), metal);
  post.position.y = 3;
  light.add(post);
  addBox(light, 1.3, 0.16, 0.18, metal, 0.55, 5.8, 0);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffedb2, emissive: 0xffd66f, emissiveIntensity: 0.32 }));
  lamp.position.set(1.1, 5.66, 0);
  light.add(lamp);
  cityRoot.add(light);
}

function createGarden(x, z, radius = 9) {
  const lawn = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.35, 32),
    new THREE.MeshStandardMaterial({ color: 0x6ca96b, roughness: 1 })
  );
  lawn.position.set(x, 0.03, z);
  lawn.receiveShadow = true;
  cityRoot.add(lawn);
  const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xd5c9ad, roughness: 0.96 });
  const path = new THREE.Mesh(new THREE.RingGeometry(radius * 0.66, radius * 0.78, 40), pathMaterial);
  path.rotation.x = -Math.PI / 2;
  path.position.set(x, 0.23, z);
  cityRoot.add(path);
}

function createFountain(x, z) {
  const stone = new THREE.MeshStandardMaterial({ color: 0xc8c3a8, roughness: 0.7 });
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.8, 0.8, 32), stone);
  basin.position.set(x, 0.55, z);
  basin.castShadow = true;
  cityRoot.add(basin);
  const water = new THREE.MeshStandardMaterial({ color: 0x61b7d1, roughness: 0.18, metalness: 0.18, transparent: true, opacity: 0.86 });
  const pool = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.16, 32), water);
  pool.position.set(x, 1, z);
  cityRoot.add(pool);
  const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 3.8, 10), new THREE.MeshStandardMaterial({ color: 0xc5f2f2, transparent: true, opacity: 0.72 }));
  jet.position.set(x, 2.8, z);
  cityRoot.add(jet);
}

function createTreasureChest() {
  const group = new THREE.Group();
  group.position.set(65, 0, 51);
  const wood = new THREE.MeshStandardMaterial({ color: 0x86502d, roughness: 0.68 });
  const woodLight = new THREE.MeshStandardMaterial({ color: 0xb8783d, roughness: 0.62 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xf1c75c, metalness: 0.72, roughness: 0.25, emissive: 0x53350c, emissiveIntensity: 0.13 });
  const base = new THREE.Group();
  addBox(base, 6.2, 3.4, 3.8, wood, 0, 2.2, 0);
  addBox(base, 0.42, 3.5, 4.05, gold, -2.55, 2.2, 0);
  addBox(base, 0.42, 3.5, 4.05, gold, 2.55, 2.2, 0);
  addBox(base, 6.3, 0.36, 4.08, gold, 0, 0.65, 0);
  addBox(base, 6.3, 0.36, 4.08, gold, 0, 3.78, 0);
  addBox(base, 6.5, 0.75, 4.4, new THREE.MeshStandardMaterial({ color: 0xc9b984, roughness: 0.88 }), 0, 0.4, 0);
  addBox(base, 0.75, 1.25, 0.42, gold, 0, 2.15, 2.03);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 3.86, -1.9);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.25, 3.9), woodLight);
  lid.position.set(0, 0.4, 1.9);
  lid.castShadow = true;
  lidPivot.add(lid);
  addBox(lidPivot, 0.4, 1.3, 4, gold, -2.55, 0.4, 1.9);
  addBox(lidPivot, 0.4, 1.3, 4, gold, 2.55, 0.4, 1.9);
  base.add(lidPivot);
  group.add(base);

  const light = new THREE.PointLight(0xffd75f, 0, 20, 2);
  light.position.set(0, 6, 0);
  group.add(light);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8.5, 0.5, 40), new THREE.MeshStandardMaterial({ color: 0xc2b58f, roughness: 0.84 }));
  pedestal.position.y = 0.2;
  pedestal.receiveShadow = true;
  group.add(pedestal);
  group.traverse((object) => { if (object.isMesh) object.castShadow = true; });
  cityRoot.add(group);
  return { group, lidPivot, light };
}

function makeCapsule(radius, length, material) {
  const capsule = new THREE.Group();
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), material);
  capsule.add(cylinder);
  for (const y of [-length / 2, length / 2]) {
    const end = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 10), material);
    end.position.y = y;
    capsule.add(end);
  }
  return capsule;
}

function createCamila() {
  const root = new THREE.Group();
  root.position.set(-60, 0.34, 40);
  const skin = new THREE.MeshStandardMaterial({ color: 0xd99d75, roughness: 0.76 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x39251f, roughness: 0.91 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0x1f66c8, roughness: 0.52, metalness: 0.1 });
  const shirtAccent = new THREE.MeshStandardMaterial({ color: 0x153d8a, roughness: 0.64, metalness: 0.14 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x102d5c, roughness: 0.92 });
  const shoes = new THREE.MeshStandardMaterial({ color: 0xf8f4e9, roughness: 0.68 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x352720, roughness: 0.8 });

  const body = makeCapsule(0.7, 1.15, shirt);
  body.position.y = 2.15;
  body.castShadow = true;
  root.add(body);

  const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.26, 0.12), shirtAccent);
  collarLeft.position.set(-0.12, 3.08, 0.56);
  collarLeft.rotation.z = 0.7;
  root.add(collarLeft);
  const collarRight = collarLeft.clone();
  collarRight.position.x = 0.12;
  collarRight.rotation.z = -0.7;
  root.add(collarRight);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.45, 12), skin);
  neck.position.y = 3.08;
  root.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 14), skin);
  head.scale.set(0.9, 1.1, 0.92);
  head.position.y = 3.8;
  head.castShadow = true;
  root.add(head);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), hair);
  hairCap.scale.set(0.97, 1.03, 1);
  hairCap.position.set(0, 3.91, -0.02);
  root.add(hairCap);
  const ponytail = makeCapsule(0.22, 0.9, hair);
  ponytail.rotation.x = 0.3;
  ponytail.position.set(0.3, 3.04, -0.4);
  ponytail.castShadow = true;
  root.add(ponytail);

  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x352b29, roughness: 0.4 });
  for (const x of [-0.22, 0.22]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), eyeMaterial);
    eye.position.set(x, 3.84, 0.53);
    root.add(eye);
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 6, 14, Math.PI), dark);
  smile.position.set(0, 3.53, 0.55);
  smile.rotation.z = Math.PI;
  root.add(smile);
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), dark);
  mouth.position.set(0, 3.52, 0.57);
  mouth.scale.set(1, 0.2, 0.45);
  root.add(mouth);

  const armPivots = [];
  for (const side of [-1, 1]) {
    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.73, 2.66, 0);
    const sleeve = makeCapsule(0.2, 0.82, shirt);
    sleeve.position.y = -0.52;
    sleeve.castShadow = true;
    armPivot.add(sleeve);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.25, 0.18, 14), shirtAccent);
    cuff.position.set(0, -1.04, 0.02);
    cuff.rotation.z = side * 0.12;
    cuff.castShadow = true;
    armPivot.add(cuff);
    root.add(armPivot);
    armPivots.push(armPivot);
  }

  const legPivots = [];
  for (const side of [-1, 1]) {
    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.3, 1.22, 0);
    const leg = makeCapsule(0.24, 0.75, pants);
    leg.position.y = -0.54;
    leg.castShadow = true;
    legPivot.add(leg);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.72), shoes);
    shoe.position.set(0, -1.03, 0.16);
    shoe.castShadow = true;
    legPivot.add(shoe);
    root.add(legPivot);
    legPivots.push(legPivot);
  }

  cityRoot.add(root);
  return { root, armPivots, legPivots, mouth };
}

function createCity() {
  addRoads();
  const buildings = placeData.map(createBuilding);
  const gardens = [[-44, 2, 8], [8, -2, 8], [47, 20, 5.5], [-18, -38, 5.8]];
  gardens.forEach(([x, z, radius]) => createGarden(x, z, radius));
  createFountain(4, -1);

  const trees = [
    [-56, 7], [-56, -4], [-44, 5], [-39, 5], [-21, 7], [-10, 7], [3, 7], [10, 7],
    [22, 7], [29, 7], [44, 7], [56, 7], [-56, 41], [-40, 42], [-28, 41], [-4, 41],
    [3, 42], [20, 42], [30, 42], [57, 41], [-56, -31], [-32, -31], [-20, -30],
    [4, -30], [30, -31], [60, -31], [-4, -49], [24, -49], [58, -49]
  ];
  trees.forEach(([x, z], index) => createTree(x, z, index % 5 === 0 ? 1.18 : 0.9));

  for (let x = -58; x <= 58; x += 29) {
    createStreetLight(x, 18, 0);
    createStreetLight(x, -17, 0);
  }

  createCar(0xf97316, 15, -76, 1);
  createCar(0x3b82f6, 15, 14, 1);
  createCar(0xfacc15, -20, 72, -1);
  createCar(0x22c55e, 50, -10, 1);
  createCar(0xe879f9, -55, 44, -1);

  return buildings;
}

const buildingGroups = createCity();
const treasureChest = createTreasureChest();
const camila = createCamila();
buildingGroups.forEach((building, index) => { placeData[index].key = building.userData.key; });
const finalPlaza = { name: 'Plaza del tesoro', position: [65, 51] };
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const lookAtTarget = new THREE.Vector3(0, 0, 0);
const cameraTarget = new THREE.Vector3(0, 110, 145);
let activePlace = null;
let travel = null;
let introActive = false;
let guideData = null;
let guideLoadError = null;
let currentBlocks = [];
let currentBlockIndex = 0;
let afterNarration = null;
let tourStarted = false;
let captionsEnabled = true;
let collectedKeys = new Set();
let currentPlaceIndex = -1;
let nextExpectedIndex = 0;
let canAdvanceRoute = true;
let chestOpenStarted = null;
let typewriterVisibilityHandler = null;

const audioPlayer = new Audio();
audioPlayer.preload = 'auto';
const prefetchedAudio = new Map();
let speechFallbackActive = false;
let celebrationAudioContext = null;

function prepareCelebrationAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  celebrationAudioContext ??= new AudioContextClass();
  if (celebrationAudioContext.state === 'suspended') {
    celebrationAudioContext.resume().catch((error) => console.warn('No se pudo activar el sonido de celebración:', error));
  }
}

function playCelebrationSound() {
  if (audioPlayer.muted) return;
  prepareCelebrationAudio();
  const context = celebrationAudioContext;
  if (!context || context.state !== 'running') return;

  const notes = [
    { frequency: 523.25, start: 0, duration: 0.34 },
    { frequency: 659.25, start: 0.13, duration: 0.34 },
    { frequency: 783.99, start: 0.26, duration: 0.4 },
    { frequency: 1046.5, start: 0.43, duration: 0.56 },
    { frequency: 1318.51, start: 0.62, duration: 0.72 }
  ];
  const now = context.currentTime;
  notes.forEach(({ frequency, start, duration }) => {
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const noteStart = now + start;
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.0001, noteStart);
    volume.gain.exponentialRampToValueAtTime(0.11, noteStart + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration + 0.02);
  });
}

function advanceAfterBlock() {
  currentBlockIndex += 1;
  if (currentBlockIndex < currentBlocks.length) {
    playCurrentBlock();
  } else {
    subtitleElement.hidden = true;
    pauseButton.textContent = 'Pausar';
    afterNarration?.();
    afterNarration = null;
  }
}

function getPreferredSpanishVoice() {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  const preferredNames = [
    'Google Español', 'Google español', 'Microsoft Helena', 'Microsoft Sabina', 'Microsoft Laura',
    'Microsoft Jorge', 'es-ES', 'es-MX', 'es-CO'
  ];

  const preferred = voices.find((voice) => preferredNames.some((name) => voice.name.includes(name) || voice.lang.includes(name)));
  if (preferred) return preferred;

  const spanish = voices.find((voice) => /^es[-_]/i.test(voice.lang));
  return spanish ?? voices.find((voice) => /es/i.test(voice.lang)) ?? null;
}

function playSpeechFallback(text) {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = '';
  window.speechSynthesis.cancel();
  if (typeof window.speechSynthesis.resume === 'function') {
    window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const preferredVoice = getPreferredSpanishVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  utterance.lang = 'es-CO';
  utterance.rate = 1.35;
  utterance.pitch = 1.2;
  utterance.volume = 1;
  utterance.onstart = () => {
    speechFallbackActive = true;
  };
  utterance.onend = () => {
    speechFallbackActive = false;
    advanceAfterBlock();
  };
  utterance.onerror = () => {
    speechFallbackActive = false;
    advanceAfterBlock();
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.warn('No se pudo iniciar speechSynthesis:', error);
    speechFallbackActive = false;
    window.setTimeout(() => advanceAfterBlock(), 1200);
    return false;
  }
}

audioPlayer.addEventListener('ended', () => {
  if (speechFallbackActive) return;
  advanceAfterBlock();
});

const guideReady = fetch('contenido/guion.json')
  .then((response) => {
    if (!response.ok) throw new Error(`No se pudo leer el guion (${response.status}).`);
    return response.json();
  })
  .then((guide) => {
    guideData = guide;
    audioPlayer.playbackRate = guide.playbackRate ?? 1;
    audioPlayer.preservesPitch = true;
    startButton.textContent = '¡Comenzar el recorrido!';
    startButton.disabled = false;
  })
  .catch((error) => {
    guideLoadError = error;
    startButton.textContent = 'No se pudo cargar el guion';
    startButton.disabled = true;
  });

startButton.disabled = true;
startButton.textContent = 'Cargando el recorrido…';

async function audioExists(source) {
  if (!source || !source.endsWith('.mp3')) return false;

  try {
    const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch (error) {
    console.warn(`No se pudo validar la fuente de audio ${source}:`, error);
    return false;
  }
}

async function playCurrentBlock() {
  const block = currentBlocks[currentBlockIndex];
  if (!block) return;

  const nextBlock = currentBlocks[currentBlockIndex + 1];
  const audioSource = typeof block.audio === 'string' ? block.audio.trim() : '';

  if (nextBlock && nextBlock.audio && !prefetchedAudio.has(nextBlock.audio)) {
    const preload = new Audio(nextBlock.audio);
    preload.preload = 'auto';
    preload.load();
    prefetchedAudio.set(nextBlock.audio, preload);
  }

  subtitleElement.textContent = block.text;
  subtitleElement.hidden = !captionsEnabled;

  const playbackRate = block.playbackRate ?? guideData?.playbackRate ?? 1;
  const shouldUseSpeechFallback = !audioSource || !audioSource.endsWith('.mp3') || !(await audioExists(audioSource));

  if (shouldUseSpeechFallback) {
    if (playSpeechFallback(block.text)) {
      subtitleElement.textContent = block.text;
      subtitleElement.hidden = !captionsEnabled;
      nextPlaceButton.disabled = false;
      unlockNextPlace();
      captionElement.textContent = 'Se usó la voz del sistema para continuar el recorrido.';
      return;
    }
  }

  audioPlayer.pause();
  audioPlayer.src = audioSource;
  audioPlayer.defaultPlaybackRate = playbackRate;
  audioPlayer.playbackRate = playbackRate;
  audioPlayer.preservesPitch = true;
  audioPlayer.currentTime = 0;
  audioPlayer.play().then(() => {
    if (subtitleElement.hidden && captionsEnabled) {
      subtitleElement.hidden = false;
    }
  }).catch((error) => {
    console.warn(`No se pudo reproducir ${audioSource}:`, error);
    if (playSpeechFallback(block.text)) {
      subtitleElement.textContent = block.text;
      subtitleElement.hidden = !captionsEnabled;
      nextPlaceButton.disabled = false;
      unlockNextPlace();
      captionElement.textContent = 'Se usó la voz del sistema para continuar el recorrido.';
      return;
    }

    subtitleElement.textContent = `${block.text} (No se pudo cargar el audio.)`;
    subtitleElement.hidden = !captionsEnabled;
    nextPlaceButton.disabled = false;
    unlockNextPlace();
    captionElement.textContent = 'El audio no se pudo reproducir. Puedes repetirlo o continuar.';
    window.setTimeout(() => advanceAfterBlock(), 1200);
  });
}

function playBlocks(blocks, onComplete) {
  audioPlayer.pause();
  currentBlocks = blocks;
  currentBlockIndex = 0;
  afterNarration = onComplete;
  if (!blocks.length) {
    afterNarration?.();
    afterNarration = null;
    return;
  }
  nextPlaceButton.disabled = true;
  playCurrentBlock();
}

function enableTypewriterWhenVisible() {
  if (typewriterVisibilityHandler) {
    document.removeEventListener('visibilitychange', typewriterVisibilityHandler);
  }

  attributePanel.classList.remove('typewriter-layout');
  const applyWhenVisible = () => {
    if (document.visibilityState !== 'visible') return;
    attributePanel.classList.add('typewriter-layout');
    document.removeEventListener('visibilitychange', applyWhenVisible);
    typewriterVisibilityHandler = null;
  };

  typewriterVisibilityHandler = applyWhenVisible;
  applyWhenVisible();
  if (typewriterVisibilityHandler) {
    document.addEventListener('visibilitychange', applyWhenVisible);
  }
}

function showArrival(place, previewOnly = false) {
  const guidePlace = guideData.places.find((item) => item.id === place.id);
  attributePanel.hidden = true;
  attributeList.replaceChildren();
  currentPlaceIndex = placeData.indexOf(place);
  placeButtons.forEach((button, index) => {
    if (index === currentPlaceIndex) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  captionElement.textContent = `Camila llega a ${place.name}`;
  arrivalToast.textContent = `Llegamos a ${place.name}`;
  arrivalToast.hidden = false;
  window.setTimeout(() => { arrivalToast.hidden = true; }, 2200);

  if (!guidePlace || guidePlace.pending || !guidePlace.blocks.length) {
    descriptionElement.textContent = `${place.name}. Este tema está pendiente de confirmación con el manual.`;
    subtitleElement.textContent = `${place.name}: falta validar el contenido antes de que Camila lo narre.`;
    subtitleElement.hidden = !captionsEnabled;
    nextPlaceButton.disabled = false;
    nextPlaceButton.textContent = 'Siguiente lugar';
    unlockNextPlace();
    return;
  }

  if (['hotel', 'justicia', 'imagen-estilo', 'banco', 'biblioteca', 'correo', 'hospital', 'informacion', 'postal'].includes(place.id) && guidePlace.highlights?.length) {
    descriptionElement.textContent = place.id === 'justicia'
      ? 'Cada uno de estos atributos ayuda a brindar un mejor servicio.'
      : place.id === 'imagen-estilo'
        ? 'Una buena presentación personal también comunica servicio.'
        : place.id === 'banco'
          ? 'La atención preferencial reconoce las necesidades de cada persona.'
          : place.id === 'biblioteca'
            ? 'El lenguaje claro facilita la comprensión y el acceso a la información.'
            : place.id === 'correo'
              ? 'El correo institucional requiere claridad, cortesía y buen uso.'
                : place.id === 'hospital'
                  ? 'Los derechos del paciente reúnen cuatro aspectos fundamentales de su atención.'
                  : place.id === 'informacion'
                    ? 'Conocer los servicios y horarios permite orientar mejor a cada persona.'
                    : place.id === 'postal'
                      ? 'Una atención telefónica clara empieza desde el saludo.'
            : 'Claves para brindar una atención cálida desde el primer saludo.';
    attributePanel.classList.add('justice-layout');
    attributePanel.classList.toggle('bank-layout', place.id === 'banco');
    attributePanel.classList.toggle('correo-layout', place.id === 'correo');
    attributePanel.classList.toggle('hospital-layout', place.id === 'hospital');
    attributePanel.classList.toggle('informacion-layout', place.id === 'informacion');
    enableTypewriterWhenVisible();
    attributePanel.style.color = '#111111';
    const title = attributePanel.querySelector('h2');
    if (title) {
      title.textContent = place.id === 'justicia'
        ? 'Los 7 atributos del buen servicio'
        : place.id === 'imagen-estilo' ? 'Imagen y estilo'
          : place.id === 'banco' ? 'Atención preferencial'
            : place.id === 'biblioteca' ? 'Lenguaje claro'
              : place.id === 'correo' ? 'Correo institucional'
                  : place.id === 'hospital' ? 'Derechos del paciente'
                    : place.id === 'informacion' ? 'Orientación clara'
                      : place.id === 'postal' ? 'Atención telefónica' : 'Claves de atención';
      title.style.color = '#111111';
    }
    attributePanel.setAttribute('aria-label', place.id === 'justicia'
      ? 'Siete atributos del buen servicio'
      : place.id === 'imagen-estilo' ? 'Claves de presentación personal'
        : place.id === 'banco' ? 'Grupos de atención preferencial'
          : place.id === 'biblioteca' ? 'Claves de lenguaje claro'
            : place.id === 'correo' ? 'Claves para el correo institucional'
                  : place.id === 'hospital' ? 'Derechos del paciente'
                    : place.id === 'informacion' ? 'Claves de orientación'
                      : place.id === 'postal' ? 'Pasos de atención telefónica' : 'Claves para una buena atención');
    guidePlace.highlights.forEach((highlight, index) => {
      const item = document.createElement('li');
      item.className = 'attribute-item';
      const emoji = document.createElement('span');
      emoji.className = 'attribute-emoji';
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = highlight.emoji;
      const copy = document.createElement('span');
      copy.className = 'attribute-copy';
      copy.style.color = '#111111';
      const name = document.createElement('strong');
      name.textContent = highlight.name;
      name.style.color = '#111111';
      name.style.setProperty('--typing-steps', String(Array.from(highlight.name).length));
      name.style.setProperty('--typing-duration', `${Math.max(0.65, Array.from(highlight.name).length * 0.045)}s`);
      name.style.setProperty('--typing-delay', `${index * 0.42}s`);
      copy.append(name);
      item.append(emoji, copy);
      attributeList.append(item);
    });
    attributePanel.hidden = false;
  } else {
    attributePanel.classList.remove('justice-layout');
    attributePanel.classList.remove('bank-layout');
    attributePanel.classList.remove('correo-layout');
    attributePanel.classList.remove('hospital-layout');
    attributePanel.classList.remove('informacion-layout');
    attributePanel.classList.remove('typewriter-layout');
    if (typewriterVisibilityHandler) {
      document.removeEventListener('visibilitychange', typewriterVisibilityHandler);
      typewriterVisibilityHandler = null;
    }
    attributePanel.style.left = '';
    attributePanel.style.top = '';
    attributePanel.style.color = '';
    descriptionElement.textContent = guidePlace.blocks.map((block) => block.text).join(' ');
  }
  if (place.key) place.key.visible = true;
  if (previewOnly) {
    subtitleElement.textContent = guidePlace.blocks[0].text;
    subtitleElement.hidden = !captionsEnabled;
    captionElement.textContent = `Vista previa: ${place.name}`;
    return;
  }
  playBlocks(guidePlace.blocks, () => finishPlaceNarration(place));
}

function updateRouteButtons() {
  placeButtons.forEach((button, index) => {
    button.disabled = !tourStarted || !canAdvanceRoute || index !== nextExpectedIndex;
  });
}

function unlockNextPlace() {
  nextExpectedIndex = currentPlaceIndex + 1;
  canAdvanceRoute = true;
  updateRouteButtons();
}

function finishPlaceNarration(place) {
  if (place.key && !collectedKeys.has(place.id)) {
    collectedKeys.add(place.id);
    place.key.visible = false;
    keyCountElement.textContent = `${collectedKeys.size} de ${placeData.length} llaves`;
    arrivalToast.textContent = '¡Encontraste una llave!';
    arrivalToast.hidden = false;
    window.setTimeout(() => { arrivalToast.hidden = true; }, 2300);
  }
  unlockNextPlace();
  nextPlaceButton.disabled = false;
  nextPlaceButton.textContent = currentPlaceIndex === placeData.length - 1 ? 'Llegar a la plaza final' : `Siguiente: ${placeData[nextExpectedIndex]?.name ?? 'Plaza final'}`;
  nextPlaceHint.hidden = false;
  captionElement.textContent = `Tema terminado: ${place.name}`;
}

function setActivePlace(index) {
  const place = placeData[index];
  if (!place || !guideData || !tourStarted || !canAdvanceRoute || index !== nextExpectedIndex) return;
  audioPlayer.pause();
  subtitleElement.hidden = true;
  nextPlaceHint.hidden = true;
  attributePanel.hidden = true;
  nextPlaceButton.disabled = true;
  canAdvanceRoute = false;
  updateRouteButtons();
  activePlace = place;
  introActive = false;
  camila.root.scale.setScalar(1);
  camila.armPivots[1].rotation.z = 0;
  camila.root.visible = true;
  currentPlaceIndex = index;

  const start = camila.root.position.clone();
  const [targetX, targetZ] = place.position;
  const finish = new THREE.Vector3(targetX, 0.34, targetZ + 9);
  const middle = new THREE.Vector3((start.x + finish.x) / 2, 0.34, (start.z + finish.z) / 2 + (targetZ > start.z ? -8 : 8));
  const curve = new THREE.CatmullRomCurve3([start, middle, finish]);
  travel = { curve, startTime: performance.now(), duration: 4300, finish, index };
  camila.root.userData.walking = true;
}

function travelToTreasure() {
  canAdvanceRoute = false;
  nextPlaceButton.disabled = true;
  placeButtons.forEach((button) => { button.disabled = true; });
  activePlace = finalPlaza;
  captionElement.textContent = 'Camila va hacia la plaza final';
  const start = camila.root.position.clone();
  const finish = new THREE.Vector3(finalPlaza.position[0], 0.34, finalPlaza.position[1] + 8);
  const middle = new THREE.Vector3((start.x + finish.x) / 2, 0.34, (start.z + finish.z) / 2 + 7);
  travel = {
    curve: new THREE.CatmullRomCurve3([start, middle, finish]),
    startTime: performance.now(),
    duration: 5200,
    finish,
    index: -1,
    onArrival: () => {
        chestOpenStarted = performance.now();
      playCelebrationSound();
        captionElement.textContent = '¡Camila encontró el cofre del buen servicio!';
        arrivalToast.textContent = '¡Las nueve llaves abren el cofre!';
        arrivalToast.hidden = false;
    }
  };
}

function launchTreasureCelebration() {
  const colors = ['#ffd84d', '#ff5e68', '#44d7ac', '#61c9ff', '#ff78c8', '#ffffff'];
  const fragments = document.createDocumentFragment();
  for (let index = 0; index < 160; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'celebration-confetti';
    piece.style.setProperty('--confetti-left', `${Math.random() * 100}%`);
    piece.style.setProperty('--confetti-top', `${Math.random() * 100}%`);
    piece.style.setProperty('--confetti-width', `${6 + Math.random() * 7}px`);
    piece.style.setProperty('--confetti-height', `${9 + Math.random() * 11}px`);
    piece.style.setProperty('--confetti-color', colors[index % colors.length]);
    piece.style.setProperty('--confetti-duration', `${3.8 + Math.random() * 2.8}s`);
    piece.style.setProperty('--confetti-delay', `${Math.random() * 1.8}s`);
    piece.style.setProperty('--confetti-drift', `${Math.random() * 280 - 140}px`);
    piece.style.setProperty('--confetti-spin', `${360 + Math.random() * 1080}deg`);
    if (index % 4 === 0) piece.style.borderRadius = '50%';
    fragments.append(piece);
  }

  const fireworks = [
    { x: '10%', y: '23%' }, { x: '88%', y: '20%' },
    { x: '15%', y: '76%' }, { x: '85%', y: '75%' }, { x: '50%', y: '12%' }
  ];
  fireworks.forEach((firework, burstIndex) => {
    const burst = document.createElement('span');
    burst.className = 'celebration-firework';
    burst.style.setProperty('--firework-x', firework.x);
    burst.style.setProperty('--firework-y', firework.y);
    burst.style.setProperty('--firework-color', colors[(burstIndex + 1) % colors.length]);
    burst.style.setProperty('--firework-delay', `${burstIndex * 0.24}s`);
    for (let sparkIndex = 0; sparkIndex < 14; sparkIndex += 1) {
      const spark = document.createElement('i');
      spark.className = 'celebration-spark';
      spark.style.setProperty('--spark-angle', `${sparkIndex * (360 / 14)}deg`);
      burst.append(spark);
    }
    fragments.append(burst);
  });

  celebrationEffects.replaceChildren(fragments);
}

function revealTreasureCelebration() {
  launchTreasureCelebration();
  treasureOverlay.hidden = false;
}

function overview() {
  if (tourStarted) return;
  travel = null;
  activePlace = null;
  introActive = false;
  camila.root.visible = true;
  audioPlayer.pause();
  currentBlocks = [];
  subtitleElement.hidden = true;
  attributePanel.hidden = true;
  attributeList.replaceChildren();
  nextPlaceButton.disabled = true;
  nextPlaceButton.textContent = 'Siguiente lugar';
  camila.root.userData.walking = false;
  camila.root.position.set(-60, 0.34, 40);
  camila.root.rotation.y = 0;
  camila.root.scale.setScalar(1);
  descriptionElement.textContent = 'Vista general de una ciudad ficticia. Pulsa «Comenzar» para escuchar a Camila y recorrer sus lugares.';
  captionElement.textContent = 'Vista general de la ciudad';
  placeButtons.forEach((button) => button.removeAttribute('aria-current'));
  cameraTarget.set(0, 110, 145);
  lookAtTarget.set(0, 0, 0);
}

placeButtons.forEach((button) => {
  button.disabled = true;
  button.addEventListener('click', () => setActivePlace(Number(button.dataset.index)));
});

resetButton.addEventListener('click', overview);

startButton.addEventListener('click', () => {
  if (!guideData) return;
  prepareCelebrationAudio();
  tourStarted = true;
  nextExpectedIndex = 0;
  canAdvanceRoute = true;
  startOverlay.hidden = true;
  controlsElement.hidden = false;
  keyCounter.hidden = false;
  introActive = true;
  camila.root.visible = true;
  camila.root.position.set(0, 0.34, 47);
  camila.root.rotation.y = 0;
  camila.root.scale.setScalar(camera.aspect < 0.9 ? 1.05 : 1.25);
  camila.root.userData.walking = false;
  updateRouteButtons();
  playBlocks(guideData.intro.blocks, () => setActivePlace(0));
});

pauseButton.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play().catch((error) => console.error('No se pudo continuar el audio:', error));
    pauseButton.textContent = 'Pausar';
  } else {
    audioPlayer.pause();
    pauseButton.textContent = 'Continuar';
  }
});

repeatButton.addEventListener('click', () => {
  const place = placeData[currentPlaceIndex];
  const guidePlace = guideData?.places.find((item) => item.id === place?.id);
  if (!guidePlace?.blocks.length) return;
  canAdvanceRoute = false;
  nextPlaceButton.disabled = true;
  updateRouteButtons();
  playBlocks(guidePlace.blocks, () => finishPlaceNarration(place));
});

captionsButton.addEventListener('click', () => {
  captionsEnabled = !captionsEnabled;
  captionsButton.setAttribute('aria-pressed', String(captionsEnabled));
  captionsButton.textContent = `Subtítulos: ${captionsEnabled ? 'sí' : 'no'}`;
  subtitleElement.hidden = !captionsEnabled || !currentBlocks[currentBlockIndex];
});

soundButton.addEventListener('click', () => {
  audioPlayer.muted = !audioPlayer.muted;
  soundButton.setAttribute('aria-pressed', String(audioPlayer.muted));
  soundButton.textContent = `Sonido: ${audioPlayer.muted ? 'no' : 'sí'}`;
});

nextPlaceButton.addEventListener('click', () => {
  if (!canAdvanceRoute) return;
  if (nextExpectedIndex < placeData.length) {
    setActivePlace(nextExpectedIndex);
    return;
  }
  if (collectedKeys.size === placeData.length) {
    travelToTreasure();
  } else {
    subtitleElement.textContent = 'El cofre espera la llave de Imagen y Estilo. Ese tema está pendiente de validar con el manual.';
    subtitleElement.hidden = !captionsEnabled;
    captionElement.textContent = `${collectedKeys.size} de ${placeData.length} llaves reunidas`;
  }
});

closeTreasureButton.addEventListener('click', () => {
  treasureOverlay.hidden = true;
  celebrationEffects.replaceChildren();
});

canvas.addEventListener('pointerdown', (event) => {
  const bounds = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(buildingGroups, true);
  const hit = hits.find((item) => {
    let object = item.object;
    while (object && !Number.isInteger(object.userData.placeIndex)) object = object.parent;
    if (!object) return false;
    item.placeIndex = object.userData.placeIndex;
    return true;
  });
  if (hit) setActivePlace(hit.placeIndex);
});

function resizeScene() {
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if (introActive) camila.root.scale.setScalar(camera.aspect < 0.9 ? 1.05 : 1.25);
}

window.addEventListener('resize', resizeScene);

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  const delta = Math.min(clock.getDelta(), 0.05);

  if (travel) {
    const progress = Math.min((performance.now() - travel.startTime) / travel.duration, 1);
    const eased = progress * progress * (3 - 2 * progress);
    camila.root.position.copy(travel.curve.getPoint(eased));
    const tangent = travel.curve.getTangent(eased);
    camila.root.rotation.y = Math.atan2(tangent.x, tangent.z);
    const stride = Math.sin(elapsed * 11) * (1 - progress * 0.45);
    camila.legPivots[0].rotation.x = stride;
    camila.legPivots[1].rotation.x = -stride;
    camila.armPivots[0].rotation.x = -stride * 0.6;
    camila.armPivots[1].rotation.x = stride * 0.6;

    if (progress >= 1) {
      const completedTravel = travel;
      travel = null;
      camila.root.userData.walking = false;
      camila.legPivots.forEach((leg) => { leg.rotation.x = 0; });
      camila.armPivots.forEach((arm) => { arm.rotation.x = 0; });
      if (completedTravel.onArrival) completedTravel.onArrival();
      else showArrival(placeData[completedTravel.index]);
    }
  } else {
    camila.root.position.y = 0.34 + Math.sin(elapsed * 2.2) * 0.06;
    camila.armPivots[0].rotation.x = Math.sin(elapsed * 1.5) * 0.035;
    camila.armPivots[1].rotation.x = -Math.sin(elapsed * 1.5) * 0.035;
    camila.armPivots[1].rotation.z = introActive ? -0.46 + Math.sin(elapsed * 5) * 0.2 : 0;
  }

  treePivots.forEach((tree, index) => {
    tree.rotation.z = Math.sin(elapsed * 0.85 + index) * 0.035;
    tree.rotation.x = Math.cos(elapsed * 0.68 + index) * 0.025;
  });

  placeData.forEach((place, index) => {
    if (!place.key?.visible) return;
    place.key.rotation.y = Math.sin(elapsed * 1.6 + index) * 0.2;
    place.key.position.y = place.height + 3.8 + Math.sin(elapsed * 2.3 + index) * 0.45;
  });

  camila.mouth.scale.y = audioPlayer.paused ? 0.2 : 0.48 + Math.abs(Math.sin(elapsed * 13)) * 0.7;

  if (chestOpenStarted !== null) {
    const progress = Math.min((performance.now() - chestOpenStarted) / 1500, 1);
    const eased = progress * progress * (3 - 2 * progress);
    treasureChest.lidPivot.rotation.x = -1.15 * eased;
    treasureChest.light.intensity = 10 * eased;
    if (progress >= 1) {
      chestOpenStarted = null;
      revealTreasureCelebration();
    }
  }

  carGroups.forEach((car) => {
    car.position.x += delta * 5.5 * car.userData.direction;
    if (car.userData.direction > 0 && car.position.x > 85) car.position.x = -85;
    if (car.userData.direction < 0 && car.position.x < -85) car.position.x = 85;
  });

  if (introActive) {
    lookAtTarget.lerp(new THREE.Vector3(camila.root.position.x, 3.2, camila.root.position.z), 0.04);
    cameraTarget.lerp(new THREE.Vector3(camila.root.position.x, 9.5, camila.root.position.z + 24), 0.04);
  } else if (activePlace) {
    if (travel) {
      const target = new THREE.Vector3(camila.root.position.x, 3, camila.root.position.z);
      lookAtTarget.lerp(target, 0.03);
      const desired = new THREE.Vector3(camila.root.position.x + 19, 25, camila.root.position.z + 31);
      cameraTarget.lerp(desired, 0.03);
    } else {
      const [placeX, placeZ] = activePlace.position;
      lookAtTarget.lerp(new THREE.Vector3(placeX, 5.5, placeZ), 0.03);
      cameraTarget.lerp(new THREE.Vector3(placeX + 17, 18, placeZ + 34), 0.03);
    }
  } else {
    lookAtTarget.lerp(new THREE.Vector3(0, 0, 0), 0.025);
    cameraTarget.lerp(new THREE.Vector3(0, 110, 145), 0.025);
  }

  camera.position.lerp(cameraTarget, 0.04);
  camera.lookAt(lookAtTarget);
  renderer.render(world, camera);
}

overview();

const previewPlaceId = new URLSearchParams(window.location.search).get('preview');
if (previewPlaceId) {
  guideReady.then(() => {
    if (previewPlaceId === 'intro') {
      introActive = true;
      camila.root.visible = true;
      camila.root.position.set(0, 0.34, 47);
      camila.root.rotation.y = 0;
      camila.root.scale.setScalar(camera.aspect < 0.9 ? 1.05 : 1.25);
      camila.root.userData.walking = false;
      startOverlay.hidden = true;
      controlsElement.hidden = true;
      subtitleElement.textContent = guideData.intro.blocks[0].text;
      subtitleElement.hidden = false;
      captionElement.textContent = 'Camila saluda desde la vista general';
      return;
    }
    if (previewPlaceId === 'treasure') {
      activePlace = finalPlaza;
      camila.root.position.set(finalPlaza.position[0], 0.34, finalPlaza.position[1] + 8);
      camera.position.set(finalPlaza.position[0] + 17, 25, finalPlaza.position[1] + 34);
      cameraTarget.copy(camera.position);
      lookAtTarget.set(finalPlaza.position[0], 5.5, finalPlaza.position[1]);
      treasureChest.lidPivot.rotation.x = -1.15;
      treasureChest.light.intensity = 10;
      startOverlay.hidden = true;
      controlsElement.hidden = true;
      captionElement.textContent = '¡Camila encontró el cofre del buen servicio!';
      revealTreasureCelebration();
      return;
    }
    const place = placeData.find((item) => item.id === previewPlaceId);
    if (!place) return;
    const [placeX, placeZ] = place.position;
    activePlace = place;
    camila.root.position.set(placeX, 0.34, placeZ + 9);
    camila.root.userData.walking = false;
    camera.position.set(placeX + 17, 25, placeZ + 34);
    cameraTarget.copy(camera.position);
    lookAtTarget.set(placeX, 5.5, placeZ);
    startOverlay.hidden = true;
    controlsElement.hidden = true;
    showArrival(place, true);
  });
}
resizeScene();
animate();

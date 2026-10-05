const places = [
  { name: 'Hotel', x: 12, y: 67 },
  { name: 'Casa de Justicia', x: 29, y: 58 },
  { name: 'Imagen y Estilo', x: 45, y: 32 },
  { name: 'Banco', x: 66, y: 55 },
  { name: 'Biblioteca', x: 80, y: 25 },
  { name: 'Oficina Postal', x: 20, y: 30 },
  { name: 'Oficina de Correo', x: 58, y: 72 },
  { name: 'Hospital', x: 74, y: 68 },
  { name: 'Punto de Información', x: 89, y: 48 }
];

const descriptions = [
  'Hotel. La atención empieza en la puerta con un saludo amable y llamando al ciudadano por su nombre.',
  'Casa de Justicia. Los atributos del buen servicio son respetuoso, amable, confiable, empático, incluyente, oportuno y efectivo.',
  'Imagen y Estilo. La presentación personal y el carné visible refuerzan la confianza y la profesionalidad.',
  'Banco. La atención preferencial reconoce a quienes requieren consideración especial.',
  'Biblioteca. El lenguaje claro reduce errores, costos y aclaraciones, y facilita la comprensión.',
  'Oficina Postal. La atención telefónica sigue cuatro pasos: saludar, nombrar la unidad, identificarse y preguntar “¿en qué le puedo servir?”.',
  'Oficina de Correo. El correo institucional debe revisarse temprano, con cuenta institucional y tono claro y cortés.',
  'Hospital. Los derechos del paciente incluyen ser informado, recibir, elegir y protegerse.',
  'Punto de Información. La orientación clara ayuda a encontrar los servicios sin perderse.'
];

const mapView = document.getElementById('mapView');
const camila = document.getElementById('camila');
const placeDescription = document.getElementById('placeDescription');
const resetBtn = document.getElementById('resetView');
const placeButtons = document.querySelectorAll('.building');
const cityObjects = document.getElementById('cityObjects');

const treePositions = [
  { x: 8, y: 82 }, { x: 17, y: 24 }, { x: 22, y: 70 }, { x: 35, y: 78 },
  { x: 45, y: 60 }, { x: 54, y: 30 }, { x: 62, y: 82 }, { x: 75, y: 38 },
  { x: 86, y: 76 }, { x: 53, y: 17 }, { x: 30, y: 18 }, { x: 12, y: 48 }
];

const carSpecs = [
  { x: 5, y: 50, color: 'red', direction: 1 },
  { x: 18, y: 80, color: 'blue', direction: 1 },
  { x: 70, y: 28, color: 'yellow', direction: -1 },
  { x: 82, y: 64, color: 'red', direction: -1 }
];

function makeTree(x, y, scale = 1) {
  const tree = document.createElement('div');
  tree.className = 'tree';
  tree.style.left = `${x}%`;
  tree.style.top = `${y}%`;
  tree.style.transform = `scale(${scale})`;
  tree.innerHTML = '<span class="trunk"></span><span class="crown"></span>';
  cityObjects.appendChild(tree);
}

function makeCar(x, y, color, direction) {
  const car = document.createElement('div');
  car.className = `car ${color}`;
  car.style.left = `${x}%`;
  car.style.top = `${y}%`;
  car.style.transform = `scaleX(${direction})`;
  cityObjects.appendChild(car);
  return car;
}

function initCityObjects() {
  treePositions.forEach((tree) => {
    const scale = tree.x > 70 ? 1.2 : 1;
    makeTree(tree.x, tree.y, scale);
  });

  const cars = carSpecs.map((spec) => makeCar(spec.x, spec.y, spec.color, spec.direction));
  cars.forEach((car, index) => {
    const drift = index * 8;
    const baseX = carSpecs[index].x;
    const baseY = carSpecs[index].y;
    car.dataset.baseX = String(baseX);
    car.dataset.baseY = String(baseY);
    car.dataset.offset = String(drift);
    car.dataset.direction = String(carSpecs[index].direction);
  });
}

function setViewState(nextZoom, nextX, nextY) {
  mapView.style.transform = `translate(${nextX}px, ${nextY}px) scale(${nextZoom})`;
}

function overview() {
  setViewState(1, 0, 0);
  placeDescription.textContent = 'Vista aérea general. Haz clic en un lugar para acercarte.';
  moveCamilaTo(50, 50);
}

function moveCamilaTo(xPercent, yPercent) {
  camila.style.left = `${xPercent}%`;
  camila.style.top = `${yPercent}%`;
}

function focusOnPlace(index) {
  const place = places[index];
  const zoom = 1.8;
  const dx = (50 - place.x) * 9.5;
  const dy = (50 - place.y) * 8;

  setViewState(zoom, dx, dy);
  placeDescription.textContent = descriptions[index];
  moveCamilaTo(place.x, place.y);
  camila.classList.add('walking');

  window.clearTimeout(window.focusTimer);
  window.focusTimer = window.setTimeout(() => {
    camila.classList.remove('walking');
  }, 3100);
}

placeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.index);
    focusOnPlace(index);
  });
});

resetBtn.addEventListener('click', overview);

function animateCars() {
  const cars = document.querySelectorAll('.car');
  cars.forEach((car, index) => {
    const baseX = Number(car.dataset.baseX);
    const baseY = Number(car.dataset.baseY);
    const offset = Number(car.dataset.offset);
    const direction = Number(car.dataset.direction);
    const time = (Date.now() / 700 + offset) % 100;
    const x = baseX + ((time * direction * 1.6) % 22) - 10;
    const y = baseY + Math.sin((Date.now() / 500) + index) * 1.2;
    car.style.left = `${x}%`;
    car.style.top = `${y}%`;
    car.style.transform = `scaleX(${direction})`;
  });
}

window.addEventListener('load', () => {
  initCityObjects();
  overview();
  moveCamilaTo(50, 50);
  camila.classList.add('walking');
  setTimeout(() => camila.classList.remove('walking'), 1200);
  setInterval(animateCars, 30);
});

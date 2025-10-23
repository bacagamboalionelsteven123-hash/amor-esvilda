const rows = 5, cols = 5;
const board = document.getElementById('board');
const ctx = board.getContext('2d');
const piecesContainer = document.getElementById('piecesContainer');
let pieceSize = board.width / cols;

let image = new Image();
image.src = 'image.jpg';

let placed = 0;
let selected = null;
let showingImage = false;
let boardBackup = null; // 🧠 Guardaremos la imagen actual del tablero

image.onload = () => {
  drawGrid();
  createPieces();
};

// 🧩 Dibuja la cuadrícula
function drawGrid() {
  ctx.clearRect(0, 0, board.width, board.height);
  ctx.strokeStyle = '#d63384';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.strokeRect(x * pieceSize, y * pieceSize, pieceSize, pieceSize);
    }
  }
}

// 🧩 Crea las piezas del puzzle
function createPieces() {
  piecesContainer.innerHTML = '';
  pieceSize = board.width / cols;
  placed = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.draggable = true;
      piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
      piece.dataset.x = x;
      piece.dataset.y = y;
      piecesContainer.appendChild(piece);
    }
  }

  // Mezclar las piezas
  [...piecesContainer.children].sort(() => Math.random() - 0.5).forEach(p => {
    piecesContainer.appendChild(p);
  });

  document.querySelectorAll('.piece').forEach(p => {
    p.addEventListener('dragstart', dragStart);
    p.addEventListener('touchstart', touchStart);
  });

  board.addEventListener('dragover', dragOver);
  board.addEventListener('drop', dropPiece);
  board.addEventListener('touchmove', touchMove);
  board.addEventListener('touchend', touchEnd);
}

// 🎯 Arrastre y toque
function dragStart(e) { selected = e.target; }
function dragOver(e) { e.preventDefault(); }

function dropPiece(e) {
  const rect = board.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pieceSize);
  const y = Math.floor((e.clientY - rect.top) / pieceSize);
  placePiece(x, y);
}

function touchStart(e) { selected = e.target; }
function touchMove(e) { e.preventDefault(); }
function touchEnd(e) {
  const rect = board.getBoundingClientRect();
  const touch = e.changedTouches[0];
  const x = Math.floor((touch.clientX - rect.left) / pieceSize);
  const y = Math.floor((touch.clientY - rect.top) / pieceSize);
  placePiece(x, y);
}

// 🧩 Colocar pieza
function placePiece(x, y) {
  if (!selected) return;

  const targetX = parseInt(selected.dataset.x);
  const targetY = parseInt(selected.dataset.y);

  if (x === targetX && y === targetY) {
    ctx.drawImage(image, x * pieceSize, y * pieceSize, pieceSize, pieceSize, x * pieceSize, y * pieceSize, pieceSize, pieceSize);
    selected.remove();
    placed++;
    bounceHeart();
    if (placed === rows * cols) showFinalMessage();
  } else {
    selected.style.animation = "shake 0.3s";
    selected.addEventListener("animationend", () => selected.style.animation = "");
  }
}

// 💗 Corazones flotantes
function bounceHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💗";
  heart.style.left = Math.random() * 90 + "vw";
  heart.style.animationDuration = 2 + Math.random() * 2 + "s";
  document.getElementById("hearts").appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

// 💌 Carta romántica flotante
function showFinalMessage() {
  const carta = document.createElement('div');
  carta.classList.add('carta-flotante');
  carta.innerHTML = `
    <h2>💖 Para mi pechocha 💖</h2>
    <p>Yo siempre estaré para ti mi pechocha ❣<br>
    Nunca te dejaré sola, yo siempre estaré para ti 🥺<br>
    Sabes que eres la mejor novia mi niña 💐<br>
    Tú eres el motivo por el cuál sigo estudiando 🥹<br>
    Porque quiero ser alguien mejor para ti<br>
    Y poder apoyarte en lo que pueda ❤️</p>
    <button id="cerrarCarta">Cerrar 💌</button>
  `;
  document.body.appendChild(carta);
  for (let j = 0; j < 40; j++) bounceHeart();
  document.getElementById('cerrarCarta').addEventListener('click', () => carta.remove());
}

// 🎵 Audio
document.getElementById("playAudio").addEventListener("click", () => {
  document.getElementById("bgAudio").play();
});
document.getElementById("pauseAudio").addEventListener("click", () => {
  document.getElementById("bgAudio").pause();
});

// 🔀 Mezclar
document.getElementById("shuffleBtn").addEventListener("click", createPieces);

// 🔄 Reiniciar
document.getElementById("resetBtn").addEventListener("click", () => {
  placed = 0;
  ctx.clearRect(0, 0, board.width, board.height);
  drawGrid();
  createPieces();
  document.getElementById("hearts").innerHTML = "";
});

// 🖼️ Mostrar imagen sin perder progreso
document.getElementById("showBtn").addEventListener("click", () => {
  if (!showingImage) {
    // 🧠 Guardar estado actual del tablero
    boardBackup = ctx.getImageData(0, 0, board.width, board.height);

    // Mostrar imagen completa
    ctx.drawImage(image, 0, 0, board.width, board.height);
    showingImage = true;
    document.getElementById("showBtn").textContent = "🔙 Volver";
  } else {
    // 🔙 Restaurar el progreso anterior
    if (boardBackup) ctx.putImageData(boardBackup, 0, 0);
    showingImage = false;
    document.getElementById("showBtn").textContent = "🖼️ Mostrar Imagen";
  }
});


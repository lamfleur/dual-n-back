const grid = document.getElementById('grid');
const startButton = document.getElementById('startButton');
const nValue = document.getElementById('nValue');
const status = document.getElementById('status');

const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan'];
const SEQUENCE_LENGTH = 20; // number of stimuli in one round
let n = 2;
let step = 0;
let positions = [];
let colors = [];
let intervalId = null;
let awaitingInput = false;
let scores = { color: { correct: 0, miss: 0 }, position: { correct: 0, miss: 0 } };

// prepare grid
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  grid.appendChild(cell);
}

function playAudioStimulus() {
  // placeholder for future audio implementation
}

function resetGame() {
  positions = [];
  colors = [];
  step = 0;
  scores = { color: { correct: 0, miss: 0 }, position: { correct: 0, miss: 0 } };
  status.textContent = '';
  const cells = document.querySelectorAll('.cell');
  cells.forEach(c => { c.style.backgroundColor = ''; c.classList.remove('active'); });
}

function showStimulus() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(c => { c.style.backgroundColor = ''; c.classList.remove('active'); });

  const pos = Math.floor(Math.random() * 9);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  positions.push(pos);
  colors.push(color);

  const cell = cells[pos];
  cell.style.backgroundColor = color;
  cell.classList.add('active');

  playAudioStimulus();
  awaitingInput = true;

  setTimeout(() => {
    cell.style.backgroundColor = '';
  }, 700);

  step++;
  if (step >= SEQUENCE_LENGTH) {
    clearInterval(intervalId);
    intervalId = null;
    showResults();
  }
}

function handleKey(event) {
  if (!awaitingInput) return;
  const key = event.key.toLowerCase();
  const idx = step - 1; // current stimulus index
  if (key === 'j') {
    // position check
    if (idx >= n && positions[idx] === positions[idx - n]) {
      scores.position.correct++;
    } else {
      scores.position.miss++;
    }
  } else if (key === 'f') {
    // color check
    if (idx >= n && colors[idx] === colors[idx - n]) {
      scores.color.correct++;
    } else {
      scores.color.miss++;
    }
  }
  awaitingInput = false;
}

document.addEventListener('keydown', handleKey);

function showResults() {
  status.innerHTML = `Position correct: ${scores.position.correct}, miss: ${scores.position.miss}<br>` +
                     `Color correct: ${scores.color.correct}, miss: ${scores.color.miss}`;
}

startButton.addEventListener('click', () => {
  if (intervalId) return; // game running
  n = parseInt(nValue.value, 10) || 1;
  resetGame();
  document.getElementById('game').style.display = 'block';
  intervalId = setInterval(showStimulus, 1500);
});

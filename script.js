const cards = [
  'apple',
  'google',
  'netflix',
  'skype',
  'spotify',
  'whatsapp',
  'windows',
  'youtube',
];

const ROWS = 4,
  COLS = 4,
  MAX_RESULTS = 10,
  MAX_PAIRS = 8;

let isFlippedCard = false;
let isLockedBoard = false;
let firstCard, secondCard;
let moves = 0;
let pairs = 0;
let timeoutId = null;

let recordTable = []; // {moves: int, date: string (YYYY-MM-DD)}

const setLocalStorage = () =>
  localStorage.setItem('records', JSON.stringify(recordTable));

const getLocalStorage = () => {
  if (localStorage.getItem('records')) {
    recordTable = JSON.parse(localStorage.getItem('records'));
  }
};

window.addEventListener('load', getLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);

const resetBoard = () => {
  [isFlippedCard, isLockedBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

const resetGame = () => {
  [moves, pairs] = [0, 0];
  resetBoard();
};

const todayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isBetter = (first, second) => {
  if (first.moves !== second.moves) return first.moves < second.moves;
  return first.date < second.date;
};

const getRandomPosition = (all) => Math.floor(Math.random() * all);

const startNewGame = () => loadPage();

const writeRecord = () => {
  recordTable.push({ moves, date: todayString() });
  recordTable.sort((first, second) => (isBetter(first, second) ? -1 : 1));
  if (recordTable.length > MAX_RESULTS) {
    recordTable.length = MAX_RESULTS;
  }
};

const renderRecordsTable = (container) => {
  if (!recordTable || !recordTable.length) {
    const modalMoves = document.createElement('p');
    modalMoves.className = 'modal-moves';
    modalMoves.textContent = 'No results yet...';
    container.append(modalMoves);
    return;
  }

  const modalTable = document.createElement('table');
  modalTable.className = 'modal-table';
  const modalTHead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.className = 'modal-tr';
  ['#', 'Moves', 'Date'].forEach((text) => {
    const th = document.createElement('th');
    th.className = 'modal-th';
    th.textContent = text;
    headRow.append(th);
  });
  modalTHead.append(headRow);
  const modalTBody = document.createElement('tbody');
  recordTable.forEach((record, index) => {
    const tr = document.createElement('tr');
    tr.className = 'modal-tr';
    const tdPosition = document.createElement('td');
    tdPosition.className = 'modal-td';
    tdPosition.textContent = index + 1;
    const tdMoves = document.createElement('td');
    tdMoves.className = 'modal-td';
    tdMoves.textContent = record.moves;
    const tdDate = document.createElement('td');
    tdDate.className = 'modal-td';
    tdDate.textContent = record.date;
    tr.append(tdPosition, tdMoves, tdDate);
    modalTBody.append(tr);
  });
  modalTable.append(modalTHead, modalTBody);
  container.append(modalTable);
};

const renderTextContent = (container) => {
  const modalMoves = document.createElement('p');
  modalMoves.classList.add('modal-moves');
  modalMoves.textContent = `You made ${moves} moves!`;
  container.append(modalMoves);
};

const createModal = () => {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  const modalTitle = document.createElement('p');
  modalTitle.classList.add('modal-title');
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('modal-buttons');
  const newGameButton = document.createElement('button');
  newGameButton.classList.add('button', 'modal-new-game');
  newGameButton.textContent = 'New Game';
  newGameButton.addEventListener('click', startNewGame);
  const closeModalButton = document.createElement('button');
  closeModalButton.classList.add('button', 'modal-close');
  closeModalButton.textContent = 'Close';
  closeModalButton.addEventListener('click', () => modal.close());
  modalButtons.append(newGameButton, closeModalButton);
  modalContainer.append(modalTitle, modalContent, modalButtons);
  modal.append(modalContainer);
  modal.addEventListener('click', (event) => {
    if (!modalContainer.contains(event.target)) {
      modal.close();
    }
  });

  document.body.append(modal);
};

const showModal = (mode) => {
  const modal = document.querySelector('.modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalContent = modal.querySelector('.modal-content');
  modalContent.replaceChildren();
  switch (mode) {
    case 'win':
      modal.classList.add('win');
      modalTitle.textContent = 'Congratulations!';
      renderTextContent(modalContent);
      break;
    case 'records':
      if (modal.classList.contains('win')) {
        modal.classList.remove('win');
      }
      modalTitle.textContent = `${MAX_RESULTS} Best Results`;
      renderRecordsTable(modalContent);
      break;
    default:
      break;
  }
  modal.showModal();
};

const createHeader = () => {
  const header = document.createElement('header');
  header.className = 'header';
  const headerContainer = document.createElement('div');
  headerContainer.className = 'container header-container';
  const headerNav = document.createElement('nav');
  headerNav.className = 'nav';
  const headerNavList = document.createElement('ul');
  headerNavList.className = 'nav-list';
  const newGameLink = document.createElement('li');
  newGameLink.className = 'nav-item new-game';
  newGameLink.textContent = 'New game';
  newGameLink.addEventListener('click', startNewGame);
  const tableOfRecordsLink = document.createElement('li');
  tableOfRecordsLink.className = 'nav-item table-of-records';
  tableOfRecordsLink.textContent = 'Table of records';
  tableOfRecordsLink.addEventListener('click', () => showModal('records'));

  document.body.append(header);
  header.append(headerContainer);
  headerContainer.append(headerNav);
  headerNav.append(headerNavList);
  headerNavList.append(newGameLink, tableOfRecordsLink);
};

const createCard = (index, order, face) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.ariaLabel = 'card';
  card.style.order = order;
  card.dataset.face = face;
  card.addEventListener('click', flipCard);
  const faceImage = document.createElement('img');
  faceImage.className = 'image face';
  faceImage.src = `assets/svg/${face}.svg`;
  faceImage.alt = `card ${index}`;
  const backImage = document.createElement('img');
  backImage.className = 'image back';
  backImage.src = 'assets/svg/js.svg';
  backImage.alt = 'card';

  card.append(faceImage, backImage);
  return card;
};

const createMain = () => {
  const main = document.createElement('main');
  main.className = 'main';
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container main-container';
  const gameBoard = document.createElement('div');
  gameBoard.className = 'game-board';

  document.body.append(main);
  main.append(mainContainer);
  mainContainer.append(gameBoard);
  for (let index = 0; index < MAX_PAIRS * 2; index += 1) {
    const card = createCard(
      index,
      getRandomPosition(MAX_PAIRS * 2),
      cards[Math.floor(index / 2)],
    );
    gameBoard.append(card);
  }
};

const createFooter = () => {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  const footerContainer = document.createElement('div');
  footerContainer.className = 'container footer-container';
  const footerMoves = document.createElement('div');
  footerMoves.className = 'footer-moves';
  const footerMovesText = document.createElement('span');
  footerMovesText.textContent = 'Moves:';
  const footerMovesResult = document.createElement('span');
  footerMovesResult.className = 'moves-result';
  footerMovesResult.textContent = '0';
  const footerPairs = document.createElement('div');
  footerPairs.className = 'footer-pairs';
  const footerPairsText = document.createElement('span');
  footerPairsText.textContent = 'Pairs:';
  const footerPairsResult = document.createElement('span');
  footerPairsResult.className = 'pairs-result';
  footerPairsResult.textContent = `${pairs} / ${MAX_PAIRS}`;

  document.body.append(footer);
  footer.append(footerContainer);
  footerContainer.append(footerMoves, footerPairs);
  footerMoves.append(footerMovesText, footerMovesResult);
  footerPairs.append(footerPairsText, footerPairsResult);
};

const disableMatchedCards = () => {
  moves += 1;
  const movesResultSpan = document.querySelector('.moves-result');
  movesResultSpan.textContent = moves;
  pairs += 1;
  const pairsResultSpan = document.querySelector('.pairs-result');
  pairsResultSpan.textContent = `${pairs} / ${MAX_PAIRS}`;
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  if (pairs === MAX_PAIRS) {
    writeRecord();
    showModal('win');
  }
  resetBoard();
};

const unFlipCards = () => {
  isLockedBoard = true;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    timeoutId = null;
    moves += 1;
    const movesResultSpan = document.querySelector('.moves-result');
    movesResultSpan.textContent = moves;
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
};

const cancelUnFlipCards = () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

const checkForMatch = () => {
  firstCard.dataset.face === secondCard.dataset.face
    ? disableMatchedCards()
    : unFlipCards();
};

function flipCard(event) {
  const card = event.target.closest('.card');
  if (card) {
    if (isLockedBoard) {
      return;
    }
    if (card === firstCard) {
      return;
    }
    card.classList.add('flip');
    if (!isFlippedCard) {
      isFlippedCard = true;
      firstCard = card;
      return;
    }
    secondCard = card;
    checkForMatch();
  }
}

const loadPage = () => {
  cancelUnFlipCards();
  resetGame();
  document.body.replaceChildren();
  createHeader();
  createMain();
  createFooter();
  createModal();
};

loadPage();

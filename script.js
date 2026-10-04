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
  COLS = 4;

let isFlippedCard = false;
let isLockedBoard = false;
let firstCard, secondCard;
let moves = 0;
let pairs = 0;

const resetBoard = () => {
  [isFlippedCard, isLockedBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

const getRandomPosition = (all) => Math.floor(Math.random() * all);

const startNewGame = () => window.location.reload();

const disableMatchedCards = () => {
  moves += 1;
  const movesResultSpan = document.querySelector('.moves-result');
  movesResultSpan.textContent = moves;
  pairs += 1;
  const pairsResultSpan = document.querySelector('.pairs-result');
  pairsResultSpan.textContent = `${pairs} / ${COLS + ROWS}`;
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
};

const unFlipCards = () => {
  isLockedBoard = true;
  setTimeout(() => {
    moves += 1;
    const movesResultSpan = document.querySelector('.moves-result');
    movesResultSpan.textContent = moves;
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
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

const createModal = (mode) => {
  const modal = document.createElement('dialog');
  modal.classList.add('modal');
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  const modalTitle = document.createElement('p');
  modalTitle.classList.add('modal-title');
  const modalMoves = document.createElement('p');
  modalMoves.classList.add('modal-moves');
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
  modalContainer.append(modalTitle, modalMoves, modalButtons);
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
  const modalMoves = modal.querySelector('.modal-moves');
  switch (mode) {
    case 'win':
      modal.classList.add('win');
      modalTitle.textContent = 'Congratulations!';
      modalMoves.textContent = `You made ${moves} moves!`;
      break;
    case 'records':
      modalTitle.textContent = '10 Best Results';
      modalMoves.textContent = 'No results yet...';
      break;
    default:
      break;
  }
  modal.showModal();
};

const createHeader = () => {
  const header = document.createElement('header');
  header.classList.add('footer');
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container', 'header-container');
  const headerNav = document.createElement('nav');
  headerNav.classList.add('nav');
  const headerNavList = document.createElement('ul');
  headerNavList.classList.add('nav-list');
  const newGameLink = document.createElement('li');
  newGameLink.classList.add('nav-item', 'new-game');
  newGameLink.textContent = 'New game';
  newGameLink.addEventListener('click', startNewGame);
  const tableOfRecordsLink = document.createElement('li');
  tableOfRecordsLink.classList.add('nav-item', 'table-of-records');
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
  card.classList.add('card');
  card.ariaLabel = 'card';
  card.style.order = order;
  card.dataset.face = face;
  card.addEventListener('click', flipCard);
  const faceImage = document.createElement('img');
  faceImage.classList.add('face');
  faceImage.src = `assets/svg/${face}.svg`;
  faceImage.alt = `card ${index}`;
  const backImage = document.createElement('img');
  backImage.classList.add('back');
  backImage.src = 'assets/svg/js.svg';
  backImage.alt = 'card';

  card.append(faceImage, backImage);
  return card;
};

const createMain = () => {
  const main = document.createElement('main');
  main.classList.add('main');
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('container', 'main-container');
  const gameBoard = document.createElement('div');
  gameBoard.classList.add('game-board');

  document.body.append(main);
  main.append(mainContainer);
  mainContainer.append(gameBoard);
  for (let index = 0; index < ROWS * COLS; index += 1) {
    const card = createCard(
      index,
      getRandomPosition(ROWS * COLS),
      cards[Math.floor(index / 2)],
    );
    gameBoard.append(card);
  }
};

const createFooter = () => {
  const footer = document.createElement('footer');
  footer.classList.add('footer');
  const footerContainer = document.createElement('div');
  footerContainer.classList.add('container', 'footer-container');
  const footerMoves = document.createElement('div');
  footerMoves.classList.add('footer-moves');
  const footerMovesText = document.createElement('span');
  footerMovesText.textContent = 'Moves:';
  const footerMovesResult = document.createElement('span');
  footerMovesResult.classList.add('moves-result');
  footerMovesResult.textContent = '0';
  const footerPairs = document.createElement('div');
  footerPairs.classList.add('footer-pairs');
  const footerPairsText = document.createElement('span');
  footerPairsText.textContent = 'Pairs:';
  const footerPairsResult = document.createElement('span');
  footerPairsResult.classList.add('pairs-result');
  footerPairsResult.textContent = '0 / 8';

  document.body.append(footer);
  footer.append(footerContainer);
  footerContainer.append(footerMoves, footerPairs);
  footerMoves.append(footerMovesText, footerMovesResult);
  footerPairs.append(footerPairsText, footerPairsResult);
};

const loadPage = () => {
  createHeader();
  createMain();
  createFooter();
  createModal();
};

loadPage();

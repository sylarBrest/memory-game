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
  const tableOfRecordsLink = document.createElement('li');
  tableOfRecordsLink.classList.add('nav-item', 'table-of-records');
  tableOfRecordsLink.textContent = 'Table of records';

  document.body.append(header);
  header.append(headerContainer);
  headerContainer.append(headerNav);
  headerNav.append(headerNavList);
  headerNavList.append(newGameLink, tableOfRecordsLink);
};

const createMain = () => {
  const main = document.createElement('main');
  main.classList.add('main');
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('container', 'main-container');

  document.body.append(main);
  main.append(mainContainer);
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
  footerMoves.classList.add('footer-pairs');
  const footerPairsText = document.createElement('span');
  footerPairsText.textContent = 'Pairs:';
  const footerPairsResult = document.createElement('span');
  footerPairsResult.classList.add('pairs-result');
  footerPairsResult.textContent = '0';

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
};

loadPage();

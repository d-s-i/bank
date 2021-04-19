"use strict";

///////////////////////////////////////////////////////////////////////
//////////////////////////////// DATA /////////////////////////////////
///////////////////////////////////////////////////////////////////////


const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-04-18T16:33:06.386Z',
    '2021-04-15T14:43:26.374Z',
    '2021-04-16T18:49:59.371Z',
    '2021-04-17T12:01:20.894Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

///////////////////////////////////////////////////////////////////////
///////////////////////////// VARIABLES ///////////////////////////////
///////////////////////////////////////////////////////////////////////

const accounts = [account1, account2, account3, account4];

let currentAccount, timer;
let sorted = false;

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const loginButton = document.querySelector(".login__btn");

const appElement = document.querySelector(".app");
const welcomeMessageElement = document.querySelector(".welcome");
const movementsElement = document.querySelector(".movements");

const summaryInValuesElement = document.querySelector(".summary__value--in");
const summaryOutValuesElement = document.querySelector(".summary__value--out");
const summaryInterestValuesElement = document.querySelector(".summary__value--interest");
const balanceElement = document.querySelector(".balance__value");

const transferButtonElement = document.querySelector(".form__btn--transfer");
const transferAmountElement = document.querySelector(".form__input--amount");
const transferToElement = document.querySelector(".form__input--to");

const deleteUserUsernameElement = document.querySelector(".form__input--user");
const deleteUserPinElement = document.querySelector(".form__input--pin");
const deleteUserButtonElement = document.querySelector(".form__btn--close");

const LoanAmountElement = document.querySelector(".form__input--loan-amount");
const LoanButtonElement = document.querySelector(".form__btn--loan");

const sortButtonElement = document.querySelector(".btn--sort");

const dateTextElement = document.querySelector(".date");

const timerDisplayElement = document.querySelector(".timer");

///////////////////////////////////////////////////////////////////////
//////////////////////// BACKGROUND FUNCTIONS /////////////////////////
///////////////////////////////////////////////////////////////////////

const createUsername = () => {
  accounts.forEach(function (account) {
    account.username = account.owner.toLowerCase().split(" ").map((name) => name[0]).join("");
  })
}
createUsername();

const formatMovements = function (account, movement) {
  const OptionsFormatNumber = {
    style: "currency",
    currency: account.currency,
  }
  return new Intl.NumberFormat(account.locale, OptionsFormatNumber).format(movement)
}

const displayMovements = (account, sorted = false) => {
  resetMovements();
  const movementsToDisplay = sorted ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  

  movementsToDisplay.forEach(function (movement, i) {
    const typeMovement = movement > 0 ? "deposit" : "withdrawal";
    movementsElement.insertAdjacentHTML("afterbegin", 
    `<div class="movements__row">
      <div class="movements__type movements__type--${typeMovement}">${i + 1} ${typeMovement}</div>
      <div class="movements__value">${formatMovements(account, movement)}</div>
    </div>`)
})
}

const displaySummaryAccount = (account) => {
  const sumDeposit = account.movements.filter((movement) => movement > 0).reduce((accumulator, deposit) => accumulator + deposit, 0);
  const sumWithdraw = account.movements.filter((movement) => movement < 0).reduce((accumulator, withdraw) => accumulator + withdraw, 0);
  const interest = account.movements.filter((movement) => movement > 10).reduce((accumulator, deposit) => accumulator + (deposit * account.interestRate) / 100 , 0);
  
  summaryInValuesElement.textContent = `${formatMovements(account, sumDeposit)}`;
  summaryOutValuesElement.textContent = `${formatMovements(account, sumWithdraw)}`;
  summaryInterestValuesElement.textContent = `${formatMovements(account, interest)}`;
}

const displayBalance = (account) => {
  account.balance = account.movements.reduce((accumulator, currentValue) => accumulator + currentValue)
  balanceElement.textContent = `${formatMovements(account, account.balance)}`;
}

const updateUI = (account) => {
  displayMovements(account);
  displaySummaryAccount(account);
  displayBalance(account);
}

const formatDate = (account) => {
  const now = new Date();
  const optionsObjectDate = {
    day: "numeric", 
    month: "numeric", 
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  dateTextElement.textContent = new Intl.DateTimeFormat(account.locale, optionsObjectDate).format(now);
}

const resetLoginElements = () => {
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginUsername.blur();
  inputLoginPin.blur();
}

const resetTransferElements = () => {
  transferAmountElement.value = "";
  transferToElement.value = "";
  transferAmountElement.blur();
  transferToElement.blur();
}

const resetDeleteAccountElements = () => {
  deleteUserUsernameElement.value = "";
  deleteUserPinElement.value = "";
  deleteUserUsernameElement.blur();
  deleteUserPinElement.blur();
}

const resetMovements = () => {
  movementsElement.innerHTML = "";
}

///////////////////////////////////////////////////////////////////////
////////////////////// EVENTS LISTENER FUNCTIONS //////////////////////
///////////////////////////////////////////////////////////////////////

const login = () => {
  accounts.forEach(function (account) {
    if (inputLoginUsername.value === account.username && Number(inputLoginPin.value) === account.pin) {
      currentAccount = account;
      appElement.style.opacity = 100;
      welcomeMessageElement.textContent = `Welcome ${account.owner.split(" ")[0]}, give us your money ! ╰(*°▽°*)╯`;
      formatDate(currentAccount);
      updateUI(currentAccount);
      resetLoginElements();

      if (timer) clearInterval(timer);
      timer = displayTimer();
    }
  })
}

const checkTransfer = () => {
  const requestedTransfer = Number(transferAmountElement.value);

  if (currentAccount.balance > requestedTransfer && requestedTransfer > 0) {
    const accountToTransfer = accounts.find((account) => account.username === transferToElement.value);
    accountToTransfer.movements.push(requestedTransfer);
    currentAccount.movements.push(- requestedTransfer);
    updateUI(currentAccount);
    resetTransferElements();
}
}

const deleteUser = () => {
  if (deleteUserUsernameElement.value === currentAccount.username && Number(deleteUserPinElement.value) === currentAccount.pin) {
    const accountToDelete = accounts.findIndex((account) => account.username === deleteUserUsernameElement.value);
    accounts.splice(accountToDelete, accountToDelete + 1);
    appElement.style.opacity = 0;
  }
  resetDeleteAccountElements();
}

const checkLoan = () => {
  const loanValue = Number(LoanAmountElement.value);
  const acceptLoan = currentAccount.movements.some((movement) => movement > loanValue * 0.1);

  if (acceptLoan && loanValue > 0) {
    currentAccount.movements.push(loanValue);
    updateUI(currentAccount);
  }
}

const displayTimer = function () {
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    timerDisplayElement.textContent = `${minutes}:${seconds}`;
    
    if (time === 0) {
      currentAccount = "";
      appElement.style.opacity = 0;
      clearInterval(timer);
    }
    time--;
  }
  
  let time = 120;
  tick();
  timer = setInterval(tick, 1000);
  return timer; 
}

///////////////////////////////////////////////////////////////////////
////////////////////////// EVENT LISTENERS ////////////////////////////
///////////////////////////////////////////////////////////////////////

loginButton.addEventListener("click", e => {
  e.preventDefault();
  login();
})

transferButtonElement.addEventListener("click", e => {
  e.preventDefault();
  checkTransfer();
})

deleteUserButtonElement.addEventListener("click", e => {
  e.preventDefault();
  deleteUser();
})

LoanButtonElement.addEventListener("click", e => {
  e.preventDefault();
  checkLoan();
})

sortButtonElement.addEventListener("click", e => {
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});

"use strict";

///////////////////////////////////////////////////////////////////////
//////////////////////////////// DATA /////////////////////////////////
///////////////////////////////////////////////////////////////////////

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

///////////////////////////////////////////////////////////////////////
///////////////////////////// VARIABLES ///////////////////////////////
///////////////////////////////////////////////////////////////////////

const accounts = [account1, account2, account3, account4];

let currentAccount;
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

///////////////////////////////////////////////////////////////////////
//////////////////////// BACKGROUND FUNCTIONS /////////////////////////
///////////////////////////////////////////////////////////////////////

const createUsername = () => {
  accounts.forEach(function (account) {
    account.username = account.owner.toLowerCase().split(" ").map((name) => name[0]).join("");
  })
}
createUsername();

const displayMovements = (movements, sorted = false) => {
  resetMovements();

  const movementsToDisplay = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(movementsToDisplay);

  movementsToDisplay.forEach(function (movement, i) {

    const typeMovement = movement > 0 ? "deposit" : "withdrawal";
    movementsElement.insertAdjacentHTML("afterbegin", 
    `<div class="movements__row">
      <div class="movements__type movements__type--${typeMovement}">${i + 1} ${typeMovement}</div>
      <div class="movements__value">${movement} €</div>
    </div>`)
})
}

const displaySummaryAccount = (account) => {
  const sumDeposit = account.movements.filter((movement) => movement > 0).reduce((accumulator, deposit) => accumulator + deposit, 0);
  const sumWithdraw = account.movements.filter((movement) => movement < 0).reduce((accumulator, withdraw) => accumulator + withdraw, 0);
  const interest = account.movements.filter((movement) => movement > 10).reduce((accumulator, deposit) => accumulator + (deposit * account.interestRate) / 100 , 0);
  
  summaryInValuesElement.textContent = `${sumDeposit} €`;
  summaryOutValuesElement.textContent = `${sumWithdraw} €`;
  summaryInterestValuesElement.textContent = `${interest} €`;
}

const displayBalance = (account) => {
  account.balance = account.movements.reduce((accumulator, currentValue) => accumulator + currentValue)
  balanceElement.textContent = `${account.balance} €`;
}

const updateUI = (account) => {
  displayMovements(account.movements)
  displaySummaryAccount(account)
  displayBalance(account);
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
      updateUI(currentAccount);
      resetLoginElements();
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
  displayMovements(currentAccount.movements, sorted);
});


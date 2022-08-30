"use strict";



// Data
const account1 = {
    owner: 'Jonas Smith',
    movements: [200, 450, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
}
const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, 1000, 8500, -30],
    interestRate: 1.5, // %
    pin: 2222,
}
const account3 = {
    owner: 'Osvaldo Cariege',
    movements: [200, -200, 1300, 5640, 720, 400, 460, 900, 3500],
    interestRate: 0.5, // %
    pin: 3333,
}
const account4 = {
    owner: 'Sara Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1, // %
    pin: 4444,
}
const accounts = [account1, account2, account3, account4];

// Elements
const containerApp = document.querySelector('.app')
const containerMovement = document.querySelector('.movements__info')
const balanceValue = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const inputLoginUser = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const labelWelcome = document.querySelector('.labelWelcome')
const inputTransferAmount = document.querySelector('.input-transfer-amount')
const inputTransferTo = document.querySelector('.input-transfer-to')
const inputConfirmUser = document.querySelector('.input-confirm-user')
const inputConfirmPin = document.querySelector('.input-confirm-pin')
const btnLoan = document.querySelector('.btn__loan')
const inputLoan = document.querySelector('.input-loan')

// Elements buttons
const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.btn__transfer')
const btnClose = document.querySelector('.btn__close')
const btnSort = document.querySelector('.btn__sort')


//  Calc Movement
const displayMovements = function(movements, sort = false){
    containerMovement.innerHTML = ''
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements
    movs.forEach(function(mov, i){
        let type = mov > 0 ? 'deposit':'withdrawal';
        const html = `
            <div class="movement__item">
                <div class="info__item"><span class="movement__type movement__type--${type}">${i + 1} ${type}</span><p>12/03/2020</p>
            </div>
            <p class="movement__total">${mov}$</p>
            </div>
        `;
        containerMovement.insertAdjacentHTML('afterbegin', html)
    })
}

//  Calc Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  balanceValue.textContent = `${acc.balance} $`;
};


//  Calc Summary
const calcDisplaySummary = function (acc) {
  // Show All Deposits
  const inComes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${inComes}$`;

  // Show All WithDrawal
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  // Show All Interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 10);
  labelSumInterest.textContent = `${interest}$`;
};

const updateUI = function (acc) {
  // Display Movement
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// Verificar username
const createUsernames = function(accs){
    accs.forEach((acc) => {
      acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
    });
}
createUsernames(accounts)


// Event Handler
let currentAccount;
btnLogin.addEventListener('click', function(e){
    e.preventDefault()

    currentAccount = accounts.find(acc => acc.username === inputLoginUser.value)
    if(currentAccount?.pin === Number(inputLoginPin.value)){
      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
      containerApp.style.opacity = 100;
      // Clear input
      inputLoginUser.value = inputLoginPin.value = '';
      inputLoginPin.blur()

      // inputLoginUser.style.display = 'none'
      // inputLoginPin.style.display = 'none'

    }
    // Doing the transfer
    updateUI(currentAccount)

})

// Transfer
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputTransferAmount.value)
  const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  if(
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc.username !== currentAccount.username
  ){
    currentAccount.movements.push(-amount)
    receiveAcc.movements.push(amount)
    
    // Doing the transfer
    updateUI(currentAccount)
  }
  inputTransferAmount.value = inputTransferTo.value = ''
})
// Loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoan.value)
  // console.log(currentAccount.movements.some(mov => mov >= amount / 0.1));
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){

    // Add movement
    currentAccount.movements.push(amount)
  
    // Update UI
    updateUI(currentAccount)
  }
})

// Close User
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputConfirmUser.value === currentAccount.username && Number(inputConfirmPin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    // Delete account
    accounts.splice(index, 1)
    // Hide UI
    containerApp.style.opacity = 0;

  }
  inputConfirmUser.value = inputConfirmPin.value = ''
})

// Btn Sort
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted
})


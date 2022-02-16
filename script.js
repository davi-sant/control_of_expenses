const transactionUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const btnToggleTransactions = document.querySelector(
  "#btn_toggle_transactions"
);
const addContentTransactions = document.querySelector(
  ".content__add__transactions"
);
console.log(addContentTransactions);
// insert input value
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

let dummyTransactions = [];

btnToggleTransactions.addEventListener("click", () => {
  addContentTransactions.classList.toggle("activeDisplay");
  addContentTransactions.classList.toggle("animate__backInUp");
});

const localStorageTransaction = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransaction : [];

const generateID = () => Math.round(Math.random() * 1000);

const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionsIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+";
  const cssClass = amount < 0 ? "minus" : "plus";
  const transactionName = name;
  const amountWithoutOperator = Math.abs(Number(amount));
  const li = document.createElement("li");
  li.classList.add(cssClass);
  li.innerHTML = `
${transactionName} 
<span>${operator} R$ ${amountWithoutOperator}  
  <button class="delete-btn" onClick="removeTransaction(${id})">
    <img src="./src/img/Trash_light.svg">
  </button>
</span>

      `;
  transactionUl.prepend(li);
};

getExpense = (transactionAmount) =>
  Math.abs(
    transactionAmount
      .filter((value) => value < 0)
      .reduce((acc, value) => acc + value, 0)
  ).toFixed(2);

getIncome = (transactionAmount) =>
  transactionAmount
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + value, 0)
    .toFixed(2);

getTotal = (transactionAmount) =>
  transactionAmount
    .reduce((acc, transaction) => acc + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
  const transactionAmount = transactions.map(({ amount }) => amount);
  //   saldo atual
  const total = getTotal(transactionAmount);
  // receita
  const income = getIncome(transactionAmount);
  // despesa
  const expense = getExpense(transactionAmount);
  // mostrando resultados
  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionUl.innerHTML = "";
  transactions.forEach(addTransactionsIntoDOM);
  updateBalanceValues();
  addContentTransactions.classList.remove("activeDisplay");
  // addContentTransactions.classList.toggle("animate__backOutDown");
};
init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const addToTransactionArray = (inputName, inputAmount) => {
  transactions.push({
    id: generateID(),
    name: inputName,
    amount: inputAmount,
  });
};

const cleanInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const inputName = inputTransactionName.value.trim();
  const inputAmount = Number(inputTransactionAmount.value.trim());
  const isSomeInputEmpty = inputName === "" || inputAmount === "";

  if (isSomeInputEmpty) {
    alert(`Por favor preencha o "Nome" e o "Valor" da transação`);
    return;
  }
  addToTransactionArray(inputName, inputAmount);
  init();
  updateLocalStorage();
  cleanInputs();
};

form.addEventListener("submit", handleFormSubmit);

const formExpense = <HTMLFormElement>document.getElementById("formExpense");

const sendExpenseBtn = document.getElementById("sendExpenseBtn");

const ulExpenseContainer = document.getElementById("ulExpenseContainer");

const listExpenseTotalSum = document.getElementById("totalSum");

interface Expense {
  id: number;
  description: string;
  amount: number;
}

//exposing the array because if it is in a function it would add only one
//expense object at the time and return it
const expenses: Expense[] = [];

function createExpense(): object {
  const inputDescription = (<HTMLInputElement>(
    document.getElementById("description")
  )).value;

  const inputAmount = (<HTMLInputElement>document.getElementById("amount"))
    .value;

  const generateId: number = Date.now();

  const createExpenseObject: Expense = {
    id: generateId,
    description: inputDescription,
    amount: Number(inputAmount),
  };

  expenses.push(createExpenseObject);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  return expenses;
}

function loopExpenseAndCreateList(): void {
  expenses.forEach((expense) => {
    const { description, amount } = expense;

    const totalSum = expenses.reduce((a, b) => a + b.amount, 0);

    listExpenseTotalSum!.innerText = "Total: " + totalSum.toString();

    const createListForExpense = document.createElement("li");

    createListForExpense.setAttribute("data-id", expense.id.toString());

    createListForExpense.innerText = description + " " + amount;

    createListForExpense.classList = "listExpense";

    const deleteListBtn = document.createElement("button");

    deleteListBtn.textContent = "Delete";

    deleteListBtn.addEventListener("click", removeListExpense);

    createListForExpense.appendChild(deleteListBtn);

    ulExpenseContainer?.appendChild(createListForExpense);
  });
}

function removeDuplicateList(): void {
  document
    .querySelectorAll(".listExpense")
    .forEach((expense) => expense.remove());
}

function removeListExpense(e: Event) {
  // console.log(expense);
  const removeBtnExpense = e.target;
  // console.log(removeBtnExpense);
  const listExpense = (<HTMLElement>removeBtnExpense).parentNode;
  // console.log(listExpense);
  const listExpenseId = Number(
    (<HTMLElement>listExpense).getAttribute("data-id"),
  );

  const idOfExpense = expenses.findIndex(
    (expense) => expense.id === listExpenseId,
  );

  expenses.splice(idOfExpense, 1);

  localStorage.removeItem("expenses");

  listExpenseTotalSum!.innerText = "";

  // console.log(expense);

  (<HTMLElement>removeBtnExpense).parentElement?.remove();
}

function resetForm() {
  formExpense?.reset();
}

function loadLocalStorage(): void {
  if (localStorage.getItem("expenses")) {
    const retrieveLocalStorage = JSON.parse(
      localStorage.getItem("todos") || "[]",
    );
    retrieveLocalStorage.forEach((expense: Expense) => {
      const { description, amount } = expense;

      const totalSum = expenses.reduce((a, b) => a + b.amount, 0);

      listExpenseTotalSum!.innerText = "Total: " + totalSum.toString();

      const createListForExpense = document.createElement("li");

      createListForExpense.setAttribute("data-id", expense.id.toString());

      createListForExpense.innerText = description + " " + amount;

      createListForExpense.classList = "listExpense";

      const deleteListBtn = document.createElement("button");

      deleteListBtn.textContent = "Delete";

      deleteListBtn.addEventListener("click", removeListExpense);

      createListForExpense.appendChild(deleteListBtn);

      ulExpenseContainer?.appendChild(createListForExpense);

      document
        .querySelectorAll(".listExpense")
        .forEach((expense) => expense.remove());
    });
  }
}

formExpense?.addEventListener("submit", (e) => {
  e.preventDefault();
  removeDuplicateList();
  createExpense();
  loopExpenseAndCreateList();
  resetForm();
});

loadLocalStorage();

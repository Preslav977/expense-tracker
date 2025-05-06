const formExpenseTracker = <HTMLFormElement>(
  document.getElementById("formExpenseTracker")
);

const expenseUlContainer = document.getElementById("expenseUlContainer");

const expenseTotalSum = <HTMLParagraphElement>(
  document.getElementById("expenseTotalSum")
);

interface ExpenseTracker {
  id: number;
  description: string;
  amount: number;
}

function CreateExpenseObject() {
  const generateRandomId = Date.now();

  const expensesArray: ExpenseTracker[] = [];

  return function (description: string, amount: number) {
    const createExpenseObject: ExpenseTracker = {
      id: generateRandomId,
      description: description,
      amount: Number(amount),
    };

    expensesArray.push(createExpenseObject);

    localStorage.setItem("expensesList", JSON.stringify(expensesArray));

    return expensesArray;
  };
}

const getCreatedExpenseObjectArray = CreateExpenseObject();

function visualizeExpenseList(getTheExpenseArray: ExpenseTracker[]) {
  const calculateTotalSum = getTheExpenseArray.reduce((a, b) => b.amount, 0);

  expenseTotalSum.textContent = `Total: ${calculateTotalSum}`;

  getTheExpenseArray.forEach((expense) => {
    const { id, description, amount } = expense;

    const createExpenseList = document.createElement("li");

    createExpenseList.classList = "liExpense";

    createExpenseList.setAttribute("data-id", id.toString());

    createExpenseList.textContent = " " + description + " " + amount;

    const createExpenseListDeleteBtn = document.createElement("button");

    createExpenseListDeleteBtn.textContent = "Delete";

    createExpenseListDeleteBtn.addEventListener("click", (e) => {
      getExpenseListAttributeIdAndRemoveExpense(e, expense);
    });

    createExpenseList.appendChild(createExpenseListDeleteBtn);

    expenseUlContainer?.appendChild(createExpenseList);
  });
}

function removeDuplicateExpenseList() {
  document
    .querySelectorAll(".liExpense")
    .forEach((expense) => expense.remove());
}

function getExpenseListAttributeIdAndRemoveExpense(
  e: Event,
  ...args: ExpenseTracker[]
) {
  const getCreatedExpenseListDeleteBtn = e.target;

  const getCreatedExpenseList = (<HTMLElement>getCreatedExpenseListDeleteBtn)
    .parentNode;

  const getCreateExpenseAttributeId = Number(
    (<HTMLElement>getCreatedExpenseList).getAttribute("data-id"),
  );

  const deleteExpenseFromArray = args.findIndex(
    (exp) => exp.id === Number(getCreateExpenseAttributeId),
  );

  args.splice(deleteExpenseFromArray, 1);

  (<HTMLElement>getCreatedExpenseList).remove();

  localStorage.removeItem("expensesList");
}

function checkIfThereAreAnyExpensesInLocalStorage() {
  const localStorageExpensesList: ExpenseTracker[] = JSON.parse(
    localStorage.getItem("expensesList") || "[]",
  );

  if (localStorageExpensesList) {
    const calculateTotalSum = localStorageExpensesList.reduce(
      (a, b) => b.amount,
      0,
    );

    expenseTotalSum.textContent = `Total: ${calculateTotalSum}`;

    localStorageExpensesList.forEach((expense) => {
      const { id, description, amount } = expense;

      const createExpenseList = document.createElement("li");

      createExpenseList.classList = "liExpense";

      createExpenseList.setAttribute("data-id", id.toString());

      createExpenseList.textContent = " " + description + " " + amount;

      const createExpenseListDeleteBtn = document.createElement("button");

      createExpenseListDeleteBtn.textContent = "Delete";

      createExpenseListDeleteBtn.addEventListener("click", (e) => {
        getExpenseListAttributeIdAndRemoveExpense(e, expense);
      });

      createExpenseList.appendChild(createExpenseListDeleteBtn);

      expenseUlContainer?.appendChild(createExpenseList);
    });
  }
}

document.addEventListener("load", checkIfThereAreAnyExpensesInLocalStorage);

formExpenseTracker.addEventListener("submit", (e) => {
  const expenseDescription = (<HTMLInputElement>(
    document.getElementById("expenseDescription")
  )).value;

  const expenseAmount = Number(
    (<HTMLInputElement>document.getElementById("expenseAmount")).value,
  );

  e.preventDefault();

  removeDuplicateExpenseList();

  const getTheExpenseArray = getCreatedExpenseObjectArray(
    expenseDescription,
    expenseAmount,
  );

  visualizeExpenseList(getTheExpenseArray);

  formExpenseTracker.reset();
});

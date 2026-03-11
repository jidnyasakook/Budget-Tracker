// Set today's date automatically

window.onload = function(){

let today = new Date();

let formattedDate = today.toISOString().split("T")[0];

document.getElementById("date").value = formattedDate;

}
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveData() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateTable() {
  let table = document.getElementById('expenseTable');

  table.innerHTML = `
<tr>
<th>Date</th>
<th>Category</th>
<th>Amount</th>
<th>Notes</th>
<th>Delete</th>
</tr>
`;

  expenses.forEach((e, i) => {
    let row = table.insertRow();

    row.insertCell(0).innerText = e.date;
    row.insertCell(1).innerText = e.category;
    row.insertCell(2).innerText = '₹ ' + e.amount;
    row.insertCell(3).innerText = e.notes;

    let del = row.insertCell(4);

    del.innerHTML = `<button class="deleteBtn" onclick="deleteExpense(${i})">X</button>`;
  });

  updateDashboard();
}

function updateDashboard() {
  let total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  document.getElementById('total').innerText = total;

  let budget = document.getElementById('budget').value;

  document.getElementById('remaining').innerText = budget - total;
}

function deleteExpense(i) {
  expenses.splice(i, 1);

  saveData();

  updateTable();
}

document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let expense = {
    date: date.value,
    category: category.value,
    amount: amount.value,
    notes: notes.value,
  };

  expenses.push(expense);

  saveData();

  updateTable();

  this.reset();
});

function downloadExcel() {
  let ws = XLSX.utils.json_to_sheet(expenses);

  let wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

  XLSX.writeFile(wb, 'Expense_Report.xlsx');
}

function downloadTemplate() {
  let data = [
    ['Date', 'Category', 'Description', 'Amount'],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['Total', '', '', '=SUM(D2:D100)'],
  ];

  let ws = XLSX.utils.aoa_to_sheet(data);

  let wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Budget');

  XLSX.writeFile(wb, 'Student_Budget_Template.xlsx');
}

updateTable();

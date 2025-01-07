-- Users
SELECT id, name, password, role
FROM user;

-- Transactions
PRAGMA foreign_key_list('transaction')
SELECT * FROM `transaction`;
SELECT * FROM `transaction` WHERE strftime("%M", `transaction`.on_date) = "27";
SELECT * FROM `transaction` WHERE strftime("%M", `transaction`.on_date) BETWEEN "27" AND "31";

-- Join
SELECT `transaction`.value, user.name FROM `transaction`
INNER JOIN user ON `transaction`.user_id = user.id 
ORDER BY `transaction`.value; 


-- Transactions Sum 
SELECT SUM(`transaction`.value) AS total FROM `transaction`;

-- Transactions Sum filter date
SELECT SUM(`transaction`.value) AS total FROM `transaction` WHERE strftime("%M", `transaction`.on_date) = "28";
SELECT * FROM `transaction`;
DELETE FROM `transaction` WHERE id IN (3,4,5);
UPDATE `transaction` SET month_ref = 'NOV' WHERE id IN (1,2);

-- Transactions Sum group by date
SELECT strftime('%Y', on_date) AS year, strftime('%m', on_date) AS month, SUM(value) as Toal FROM `transaction` GROUP BY strftime('%Y', on_date), strftime('%m', on_date);

-- Categories
SELECT * FROM expense_category;

-- Expenses
SELECT * FROM expense;
SELECT expense_category.name, expense.value, expense.description, expense.on_date FROM expense INNER JOIN expense_category ON expense.expense_category_id = expense_category.id; 

SELECT SUM(expense.value) FROM expense WHERE strftime('%M', expense.on_date) = "50";
SELECT * FROM expense WHERE expense.month_ref = "NOV"; 

SELECT strftime('%Y', expense.on_date) as YEAR, expense.month_ref as MONTH, SUM(expense.value) AS TOTAL FROM expense WHERE strftime('%Y', expense.on_date) = "2025" AND expense.month_ref = "NOV";

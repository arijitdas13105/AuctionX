

## **1. What is a cursor in the context of databases?**
### **Answer**:
- A **cursor** is like a bookmark or pointer that keeps track of where you are in the result set of a query. 
- When you execute a query that returns multiple rows, the cursor starts before the first row.
- Each time you call `rows.Next()`, the cursor moves to the next row in the result set.

### **Example**:
Imagine you have a database table:

| id  | title           | price  | status    |
|-----|-----------------|--------|-----------|
| 1   | Vintage Watch   | 500.00 | available |
| 2   | Rare Coin       | 750.00 | sold      |
| 3   | Antique Vase    | 1200.00| available |

- If your query is: `SELECT * FROM items WHERE status = 'available';`, 
  the result set contains:
  ```plaintext
  [
      [1, "Vintage Watch", 500.00, "available"],
      [3, "Antique Vase", 1200.00, "available"]
  ]
  ```
- The **cursor** starts before `[1, "Vintage Watch", 500.00, "available"]`.
- When you call `rows.Next()`, the cursor moves to the first row:
  ```plaintext
  [1, "Vintage Watch", 500.00, "available"]
  ```
- After another `rows.Next()`, the cursor moves to the second row:
  ```plaintext
  [3, "Antique Vase", 1200.00, "available"]
  ```

---

## **2. What does `rows` hold when the query is executed?**
### **Answer**:
- `rows` holds the **entire result set** in a raw format but hides the details from you.
- You can only access the data row by row using `rows.Next()` and `rows.Scan()`.

### **Example**:
For the table above:
- If the query is: `SELECT * FROM items WHERE status = 'available';`,
  `rows` internally contains:
  ```plaintext
  [
      [1, "Vintage Watch", 500.00, "available"],
      [3, "Antique Vase", 1200.00, "available"]
  ]
  ```
- However, you cannot directly see or use this data. You must call `rows.Next()` to move to each row, and `rows.Scan()` to copy the data into variables.

---

## **3. How does `rows.Scan()` work?**
### **Answer**:
- `rows.Scan()` maps the **columns of the current row** to the variables provided as arguments.
- The mapping happens **sequentially**, meaning the **order of variables must match the order of columns in the query**.

### **Example**:
Suppose the current row is:
```plaintext
[1, "Vintage Watch", 500.00, "available"]
```
If your code is:
```go
var id int
var title string
var price float64
var status string
rows.Scan(&id, &title, &price, &status)
```
After `rows.Scan()`:
- `id = 1`
- `title = "Vintage Watch"`
- `price = 500.00`
- `status = "available"`

### **What Happens If the Order is Wrong?**
If you call:
```go
rows.Scan(&price, &id, &title, &status)
```
The mapping will go wrong:
- `price = 1` (wrongly assigned the value of `id`)
- `id = 500.00` (wrongly assigned the value of `price`)
- This is why the order of variables **must match the query**.

---

## **4. What happens if there are multiple rows in the result set?**
### **Answer**:
- The cursor starts **before the first row**.
- Each call to `rows.Next()` moves the cursor to the next row.
- You use `rows.Scan()` to extract the data for the current row.

### **Example**:
For this table:
| id  | title           | price  | status    |
|-----|-----------------|--------|-----------|
| 1   | Vintage Watch   | 500.00 | available |
| 3   | Antique Vase    | 1200.00| available |

The query `SELECT * FROM items WHERE status = 'available';` returns:
```plaintext
[
    [1, "Vintage Watch", 500.00, "available"],
    [3, "Antique Vase", 1200.00, "available"]
]
```

Dry Run of the Code:
```go
for rows.Next() {
    var id int
    var title string
    var price float64
    var status string

    rows.Scan(&id, &title, &price, &status)
    fmt.Printf("Row Data: ID=%d, Title=%s, Price=%.2f, Status=%s\n", id, title, price, status)
}
```

- **First Iteration**:
  - Cursor points to `[1, "Vintage Watch", 500.00, "available"]`.
  - After `rows.Scan()`:
    - `id = 1`
    - `title = "Vintage Watch"`
    - `price = 500.00`
    - `status = "available"`
  - Output:
    ```plaintext
    Row Data: ID=1, Title=Vintage Watch, Price=500.00, Status=available
    ```

- **Second Iteration**:
  - Cursor points to `[3, "Antique Vase", 1200.00, "available"]`.
  - After `rows.Scan()`:
    - `id = 3`
    - `title = "Antique Vase"`
    - `price = 1200.00`
    - `status = "available"`
  - Output:
    ```plaintext
    Row Data: ID=3, Title=Antique Vase, Price=1200.00, Status=available
    ```

---

## **5. Summary of Key Points**
- **Cursor**:
  - A pointer that moves through the rows of a query result set.
  - Starts before the first row and moves with `rows.Next()`.

- **What `rows` Contains**:
  - The entire result set in raw form, but you can’t directly access it.
  - You need `rows.Next()` and `rows.Scan()` to extract data row by row.

- **How `rows.Scan()` Works**:
  - Maps columns of the current row to variables in sequential order.
  - The order of variables must match the query.

- **Iterating Over Multiple Rows**:
  - Use a loop with `rows.Next()`.
  - Use `rows.Scan()` inside the loop to process each row.

- **Important Note**:
  - If the query returns no rows, `rows.Next()` will immediately return `false`, and the loop will not run.

---

## **Code Example**
Here’s a complete example for reference:

### **Database Table**:
| id  | title           | price  | status    |
|-----|-----------------|--------|-----------|
| 1   | Vintage Watch   | 500.00 | available |
| 2   | Rare Coin       | 750.00 | sold      |
| 3   | Antique Vase    | 1200.00| available |

### **Go Code**:
```go
query := "SELECT id, title, price, status FROM items WHERE status = 'available';"
rows, err := db.Query(query)
if err != nil {
    log.Fatalf("Error executing query: %v", err)
}

for rows.Next() {
    var id int
    var title string
    var price float64
    var status string

    err := rows.Scan(&id, &title, &price, &status)
    if err != nil {
        log.Fatalf("Error scanning row: %v", err)
    }

    fmt.Printf("Row Data: ID=%d, Title=%s, Price=%.2f, Status=%s\n", id, title, price, status)
}
```

### **Output**:
```plaintext
Row Data: ID=1, Title=Vintage Watch, Price=500.00, Status=available
Row Data: ID=3, Title=Antique Vase, Price=1200.00, Status=available
```

### **📍📍When Do You Need `RowsAffected()`?**  

Use `RowsAffected()` when you need to **verify whether a database operation actually modified any rows**.  

#### **Common Scenarios:**
1. **DELETE Operations** ✅  
   - Ensures a row was actually deleted.  
   - Prevents users from deleting someone else’s data.  

2. **UPDATE Operations** ✅  
   - Confirms if an update affected any row.  
   - Helps differentiate between “no changes” and “record not found.”  

3. **INSERT Operations (Rarely Used)** ⚠️  
   - Usually, `LastInsertId()` is used instead.  
   - `RowsAffected()` is useful when inserting **conditionally** (e.g., `INSERT IGNORE`).  

---

### **When You Don’t Need `RowsAffected()`**
❌ **For SELECT queries** (use `rows.Next()` instead).  
❌ **For always-successful INSERTs**, where `LastInsertId()` is enough.  

---

### **🔹 Summary for Future Reference**
- ✅ **Use in `DELETE` and `UPDATE` to check if data was modified.**  
- ✅ **Prevents misleading success responses when no row is affected.**  
- ❌ **Not needed for SELECT, simple INSERTs, or queries where errors alone determine failure.**  

🚀 **Rule of Thumb:** If a query should only succeed **when a specific row exists/matches**, use `RowsAffected()`.
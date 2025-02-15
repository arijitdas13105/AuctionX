
---

# **🗄️ Database Cursors and Query Execution in Go**  

---

## **1️⃣ What is a cursor in the context of databases?**  

### **🔍 Answer:**  
- A **cursor** ➡️ acts like a 📍pointer that keeps track of the current position in a query result set.  
- It starts **before the first row** and moves one row at a time using `rows.Next()`.  

### **📊 Example Table:**  
| 🆔 id | 🏷️ title        | 💰 price  | 📦 status    |  
|------|----------------|-----------|------------|  
| 1    | Vintage Watch  | 500.00    | available  |  
| 2    | Rare Coin      | 750.00    | sold       |  
| 3    | Antique Vase   | 1200.00   | available  |  

**Query Example:**  
```sql
SELECT * FROM items WHERE status = 'available';
```
📦 **Result Set:**  
```plaintext
[
    [1, "Vintage Watch", 500.00, "available"],
    [3, "Antique Vase", 1200.00, "available"]
]
```

**Cursor Movement:**  
1️⃣ Initially **before** `[1, "Vintage Watch", 500.00, "available"]`  
2️⃣ `rows.Next()` ➡️ moves to the first row.  
3️⃣ `rows.Next()` ➡️ moves to the second row.  

---

## **2️⃣ What does `rows` hold when the query is executed?**  

### **🔍 Answer:**  
- `rows` holds the **entire result set** 🔄 but hides the data until you process it row-by-row.  
- You need `rows.Next()` ➡️ to move and `rows.Scan()` ➡️ to extract data.  

### **📦 Internal Representation:**  
For the query:  
```sql
SELECT * FROM items WHERE status = 'available';
```
`rows` contains:  
```plaintext
[
    [1, "Vintage Watch", 500.00, "available"],
    [3, "Antique Vase", 1200.00, "available"]
]
```

---

## **3️⃣ How does `rows.Scan()` work?**  

### **🔍 Answer:**  
- `rows.Scan()` maps **columns of the current row** 🧩 to the provided variables in the same order.  
- **Order matters!** Variables should match the query's column order.  

### **🏷️ Example:**  
Row:  
```plaintext
[1, "Vintage Watch", 500.00, "available"]
```
Code:  
```go
var id int
var title string
var price float64
var status string

rows.Scan(&id, &title, &price, &status)
```
**After Scan:**  
- `id = 1`  
- `title = "Vintage Watch"`  
- `price = 500.00`  
- `status = "available"`  

⚠️ **Wrong Order Example:**  
```go
rows.Scan(&price, &id, &title, &status) 
```
❌ **Incorrect Mapping:**  
- `price = 1` (wrong)  
- `id = 500.00` (wrong)  

---

## **4️⃣ What happens if there are multiple rows in the result set?**  

### **🔍 Answer:**  
- The cursor **iterates through rows** with `rows.Next()`.  
- Each `rows.Scan()` retrieves values for the current row.  

### **🔄 Example Flow:**  
Table:  
| 🆔 id | 🏷️ title        | 💰 price  | 📦 status    |  
|------|----------------|-----------|------------|  
| 1    | Vintage Watch  | 500.00    | available  |  
| 3    | Antique Vase   | 1200.00   | available  |  

**Query:**  
```sql
SELECT * FROM items WHERE status = 'available';
```

Code:  
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

### **🛠️ Execution Flow:**  
1️⃣ **First Iteration:**  
   - Cursor → `[1, "Vintage Watch", 500.00, "available"]`  
   - After `rows.Scan()`:
        - `id = 1`
        - `title = "Vintage Watch"`
        - `price = 500.00`
        - `status = "available"`
   - Output:  
   ```plaintext
   Row Data: ID=1, Title=Vintage Watch, Price=500.00, Status=available
   ```
   
2️⃣ **Second Iteration:**  
   - Cursor → `[3, "Antique Vase", 1200.00, "available"]`  
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

## **5️⃣ Summary of Key Points**  

### **✨ Important Takeaways:**  

- **🧭 Cursor:**  
  - A pointer that tracks the current row position.  
  - Moves with `rows.Next()`.  

- **📦 What `rows` Contains:**  
  - Holds result data but requires iteration and scanning.  

- **🧩 How `rows.Scan()` Works:**  
  - Maps columns to variables in order.  
  - **Order is critical** to avoid misplacement.  

- **🔄 Iterating Over Rows:**  
  - Use a loop with `rows.Next()`.  
  - Extract data with `rows.Scan()`.  

- **⚠️ No Rows Handling:**  
  - If no rows, `rows.Next()` ➡️ returns `false`, skipping processing.  

---

## **6️⃣ Complete Example for Reference**  

### **🛢️ Table Structure:**  
| 🆔 id | 🏷️ title        | 💰 price  | 📦 status    |  
|------|----------------|-----------|------------|  
| 1    | Vintage Watch  | 500.00    | available  |  
| 2    | Rare Coin      | 750.00    | sold       |  
| 3    | Antique Vase   | 1200.00   | available  |  

### **🖥️ Go Code Example:**  
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

### **📤 Expected Output:**  
```plaintext
Row Data: ID=1, Title=Vintage Watch, Price=500.00, Status=available
Row Data: ID=3, Title=Antique Vase, Price=1200.00, Status=available
```

---

Hope this format makes it super easy to write and refer to in your notes! 😊✨
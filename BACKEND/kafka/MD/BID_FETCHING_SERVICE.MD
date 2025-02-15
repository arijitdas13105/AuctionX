## 💼 Kafka Consumer Explained

### 1. 🔍 Why `var itemId uint`? 🛑🔢

**What It Does:**

- 📝 Declares a variable `itemId` of type `uint` (unsigned integer).
- 📦 This variable stores the ID of the expired item received from Kafka.

**Why Do We Need It?**

- 📡 The Kafka topic `bidding-expiry-topic` contains messages with expired item IDs.
- 📥 We extract the `itemId` to fetch the highest bid for that item.

---

### 2. 📃 Understanding `json.Unmarshal(message, &itemId)` 🧩🔄

**What It Does:**

- 🔄 Converts the JSON-encoded Kafka message (a byte array) into a Go variable `itemId`.

**Why Use It?**

- 📨 Kafka messages are in byte format, often encoded as JSON.
- 📖 `json.Unmarshal` decodes it into a Go value.

**Why ****************`&itemId`****************?**

- 🎯 The `&` provides a reference to `itemId`, allowing `Unmarshal` to populate it directly.

**Before Unmarshal:**

```go
var itemId uint
```

Message received:

```json
123
```

**After Unmarshal:**

```go
itemId = 123
```

**What If We Don't Use It?**

- ❌ The message would remain a byte array, making it difficult to extract meaningful values.

---

### 3. 🌍 What is `var highestBid models.Bid`? 🏦📊

**What It Does:**

- 📜 Declares a variable `highestBid` of type `models.Bid`.
- 📂 Stores the highest bid details for the expired item.

**Structure of ****************`models.Bid`****************:**

```go
type Bid struct {
    ID        uint      `json:"id"`
    ItemID    uint      `json:"item_id"`
    BuyerID   uint      `json:"buyer_id"`
    BidPrice  float64   `json:"bid_price"`
    CreatedAt time.Time `json:"created_at"`
}
```

**Why Do We Need It?**

- 📊 After fetching bid details from the database, we store them in this struct.

---

### 4. 📒 What does `ORDER BY bid_price DESC LIMIT 1` mean? 🏆🏁

**What It Does:**

- 🏷 Fetches the highest bid for the given `itemId`.
- 📉 `ORDER BY bid_price DESC`: Sorts bids in descending order (highest first).
- 🎯 `LIMIT 1`: Returns only the top bid.

**Why Use This Query?**

- 🏅 To identify the winning bidder for an expired item.

---

### 5. **📝 Question:**

**What does this code do?**

```go
err = utils.DB.QueryRow(query, itemId).Scan(
    &highestBid.ID,
    &highestBid.ItemID,
    &highestBid.BuyerID,
    &highestBid.BidPrice,
)
```

- **❓ What does it query?**
- **❓ What does it scan?**
- **❓ What happens after `QueryRow` and `Scan`?**
- **❓ Why do we send the query and `itemId` in `QueryRow`?**

---

### **🔍 Answer:**

#### **1. 🗂️ Database Table Example:**

Imagine a table called **`bids`** with the following data:

| id  | item_id | buyer_id | bid_price |
|-----|---------|----------|-----------|
| 1   | 123     | 456      | 100.50    |
| 2   | 123     | 789      | 150.75    |
| 3   | 456     | 101      | 200.00    |

---

#### **2. 📝 SQL Query:**

The query being used is:

```sql
SELECT id, item_id, buyer_id, bid_price 
FROM bids 
WHERE item_id = ? 
ORDER BY bid_price DESC 
LIMIT 1
```

For **`itemId = 123`**, the query will return the row with the highest **`bid_price`**:

| id  | item_id | buyer_id | bid_price |
|-----|---------|----------|-----------|
| 2   | 123     | 789      | 150.75    |

---

#### **3. ⚙️ Step-by-Step Execution:**

1. **🔄 Before `QueryRow` and `Scan`:**  
   The `highestBid` variable is declared but uninitialized:

   ```go
   var highestBid models.Bid
   ```

   At this point, it contains **zero values**:

   ```go
   highestBid = models.Bid{
       ID:        0,
       ItemID:    0,
       BuyerID:   0,
       BidPrice:  0.0,
   }
   ```

---

2. **⚡ Execute `QueryRow`:**  
   The `QueryRow` function executes the SQL query with **`itemId = 123`**:

   ```go
   err = utils.DB.QueryRow(query, itemId).Scan(
       &highestBid.ID,
       &highestBid.ItemID,
       &highestBid.BuyerID,
       &highestBid.BidPrice,
   )
   ```

   This query returns the following row:

   | id  | item_id | buyer_id | bid_price |
   |-----|---------|----------|-----------|
   | 2   | 123     | 789      | 150.75    |

---

3. **🔍 Execute `Scan`:**  
   The `Scan` function maps the database row to the `highestBid` struct fields:

   ```go
   err = utils.DB.QueryRow(query, itemId).Scan(
       &highestBid.ID,        // Maps to `id`
       &highestBid.ItemID,    // Maps to `item_id`
       &highestBid.BuyerID,   // Maps to `buyer_id`
       &highestBid.BidPrice,  // Maps to `bid_price`
   )
   ```

   After `Scan`, the `highestBid` variable now contains:

   ```go
   highestBid = models.Bid{
       ID:        2,
       ItemID:    123,
       BuyerID:   789,
       BidPrice:  150.75,
   }
   ```

---

#### **4. ⚠️ What Happens If No Rows Are Returned?**

If the query returns **no rows** (e.g., no bids for the given `itemId`), `QueryRow` will return an error (`sql.ErrNoRows`). You should handle this scenario:

```go
err = utils.DB.QueryRow(query, itemId).Scan(
    &highestBid.ID,
    &highestBid.ItemID,
    &highestBid.BuyerID,
    &highestBid.BidPrice,
)
if err != nil {
    if err == sql.ErrNoRows {
        log.Printf("No bids found for item %d", itemId)  // 🛑 No rows found
    } else {
        log.Printf("Failed to fetch highest bid: %v", err)  // 🛑 Query failed
    }
    return
}
```

---

#### **💡 Summary:**

- **🔄 Before `QueryRow` and `Scan`:**
  - `highestBid` is uninitialized and contains **zero values**.

- **⚡ After `QueryRow` and `Scan`:**
  - `highestBid` contains the data from the **database row**:

    ```go
    highestBid = models.Bid{
        ID:        2,
        ItemID:    123,
        BuyerID:   789,
        BidPrice:  150.75,
    }
    ```

- **⚠️ Error Handling:**
  - If no rows are returned, `QueryRow` will return **`sql.ErrNoRows`**.

---

### **🧐 Why Send `query` and `itemId` in `QueryRow`?**

- **🗣️ `query`**: Defines the SQL query being executed.
- **🔑 `itemId`**: It's the parameter used in the query to filter rows based on the item being bid on.

The **`QueryRow`** function executes the SQL query using **`itemId`** as a parameter, which helps get the highest bid for a specific item.

--- 

This should make your notes more fun and easier to follow! 😊📓
---

### 6. 🕵️ What does `%+v` mean? 📊🛠

**Example:**

```go
log.Printf("Highest bid for item %d: %+v", itemId, highestBid)
```

- `%+v` prints struct field names along with their values.

**Example Output:**

```shell
Highest bid for item 123: {ID:1 ItemID:123 BuyerID:456 BidPrice:100.50}
```

---

### 7. 💰 Understanding `bidMessage := map[string]interface{}` 💼📨

**What It Does:**

```go
bidMessage := map[string]interface{}{
    "itemId":    highestBid.ItemID,
    "buyerId":   highestBid.BuyerID,
    "bidPrice":  highestBid.BidPrice,
}
```

**Why Use It?**

- 🧰 The map holds bid data with flexible types.
- 🔄 It can be easily converted to JSON before publishing to Kafka.

**Alternatives:**

1. **Using Structs:**
   ```go
   type BidMessage struct {
       ItemID   uint    `json:"itemId"`
       BuyerID  uint    `json:"buyerId"`
       BidPrice float64 `json:"bidPrice"`
   }

   bidMessage := BidMessage{
       ItemID:   highestBid.ItemID,
       BuyerID:  highestBid.BuyerID,
       BidPrice: highestBid.BidPrice,
   }
   ```
2. **Using JSON Directly:**
   ```go
   bidJSON, _ := json.Marshal(highestBid)
   ```

---

### 8. 📊 Step-by-Step Example 🚀🎯

1. **Kafka Message Received:**

   ```json
   123
   ```

2. **After Unmarshal:**

   ```go
   itemId = 123
   ```

3. **Database Query Result:**

   ```go
   highestBid = models.Bid{
       ID:        1,
       ItemID:    123,
       BuyerID:   456,
       BidPrice:  100.50,
   }
   ```

4. **Message to Publish:**

   ```go
   bidMessage = map[string]interface{}{
       "itemId":    123,
       "buyerId":   456,
       "bidPrice":  100.50,
   }
   ```

5. **Publishing to Kafka:**

   ```shell
   Published to order-creation-topic: {"itemId":123, "buyerId":456, "bidPrice":100.50}
   ```

---

Let me know if you'd like more insights! 🚀


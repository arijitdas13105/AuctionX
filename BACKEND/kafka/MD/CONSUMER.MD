## 📚 Kafka Consumer Explained

### 1️⃣ **Why Do We Need the `handler` Function?**

#### 🔍 **What is the `handler`?**
- A callback function that processes each message consumed from the Kafka topic.
- Passed as a parameter to the `StartConsumer` function, allowing flexibility in message processing.

```go
func StartConsumer(topic string, groupID string, handler func(message []byte)) {
	// ...
	handler(msg.Value)
}
```

#### ❓ **Why Do We Need It?**
- **Separation of Concerns:**
  - `StartConsumer` handles message retrieval from Kafka.
  - `handler` processes the messages, making code modular, testable, and reusable.
- **Flexibility:**
  - Allows different message processing strategies without modifying the consumer logic.
  - Examples of handler functions:
    - Logging messages.
    - Storing data in a database.
    - Triggering workflows or alerts.

#### ⚙️ **What Does the `handler` Do?**
- Takes `msg.Value` (message content as `[]byte`) and processes it.

**Example:**
```go
func handleMessage(message []byte) {
	log.Printf("Received message: %s", string(message))
}
```
- Converts the byte array to a string and logs it.

---

### 2️⃣ **Why Do We Need an Infinite Loop?**

#### 🔍 **What is the Infinite Loop?**
- A loop that continuously reads messages from the Kafka topic and passes them to the handler function.

```go
for {
	msg, err := reader.ReadMessage(context.Background())
	if err != nil {
		log.Printf("Failed to read message: %v", err)
		continue
	}

	handler(msg.Value)
}
```

#### ❓ **Why Do We Need It?**
- Kafka is a continuous stream processing system.
- The consumer must keep running to process incoming messages as they arrive.

#### 🕒 **When Do We Use an Infinite Loop?**
- **Real-Time Processing:** Continuously processing incoming messages (e.g., user activity tracking, alerts, etc.).
- **Long-Running Applications:** Systems that need to remain active (e.g., microservices handling business logic).

#### 🛠️ **What Happens Inside the Loop?**
1. **Read a Message:**
   - `reader.ReadMessage(context.Background())` retrieves the next message.
   - Handles errors gracefully and continues processing.
2. **Process the Message:**
   - Message data (`msg.Value`) is passed to the handler.
3. **Repeat:**
   - The process continues indefinitely, waiting for new messages.

---

### 3️⃣ **Step-by-Step Example**

#### 🧩 **1. Define a `handler` Function**
```go
func handleMessage(message []byte) {
	log.Printf("Received message: %s", string(message))
}
```

#### 🚀 **2. Start the Consumer**
```go
StartConsumer("bidding-expiry-topic", "bid-fetching-group", handleMessage)
```

#### ⚙️ **3. What Happens When the Consumer Runs?**
1. **Initialize:** Connects to Kafka broker at `localhost:9092`, subscribes to `bidding-expiry-topic`.
2. **Enter Infinite Loop:** Starts reading messages.
3. **Read a Message:** Suppose this message is published:
   ```json
   {"itemId":123,"status":"expired"}
   ```
4. **Process the Message:**
   ```
   Received message: {"itemId":123,"status":"expired"}
   ```
5. **Repeat:** Keeps waiting for new messages.

---

### 4️⃣ **Testing the Consumer**

#### ⚡ **1. Start Kafka**
Ensure Kafka is running locally, create the topic:
```bash
kafka-topics.sh --create --topic bidding-expiry-topic --bootstrap-server localhost:9092
```

#### 🚀 **2. Run the Consumer**
Run the Go consumer code.

#### 📨 **3. Publish Messages**
```bash
kafka-console-producer.sh --broker-list localhost:9092 --topic bidding-expiry-topic
```
Enter a message:
```json
{"itemId":123,"status":"expired"}
```

#### 📜 **4. Check Logs**
Consumer should log:
```text
Received message: {"itemId":123,"status":"expired"}
```

---

### 5️⃣ **Why Can’t We Use a Finite Loop?**
- A finite loop would stop after processing a set number of messages.
- Kafka is designed for continuous data streams, so consumers must run indefinitely.

**If a finite loop is required:**
- It's useful for batch processing scenarios where messages are processed in chunks.

---

### 6️⃣ **Summary**

#### ⚙️ **`handler` Function:**
- Processes each message consumed from Kafka.
- Increases flexibility and modularity.

#### 🔁 **Infinite Loop:**
- Ensures continuous real-time message processing.
- Suitable for long-running applications.

#### 🛠️ **Example:**
- Consumer reads `{"itemId":123,"status":"expired"}` and logs it using the handler function.

---

### 💡 **Key Takeaways:**
- A well-structured Kafka consumer includes:
  - A `handler` for message processing.
  - An infinite loop for continuous data consumption.
  - Proper error handling and logging.
- Real-time applications rely on continuous message flow and long-running consumers.


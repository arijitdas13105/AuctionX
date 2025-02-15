Here's a concise note for you to write down:

---

### **Kafka Setup on Local Machine**

1. **Start Zookeeper** (in **CMD**):
   ```bash
   C:\kafka_2.12-3.9.0\bin\windows\zookeeper-server-start.bat C:\kafka_2.12-3.9.0\config\zookeeper.properties
   ```

2. **Start Kafka Broker** (in **CMD**):
   ```bash
   C:\kafka_2.12-3.9.0\bin\windows\kafka-server-start.bat C:\kafka_2.12-3.9.0\config\server.properties
   ```

3. **Create Kafka Topic** (in **Git Bash**):
   ```bash
   cd /c/kafka_2.12-3.9.0/bin
   ./kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic bidding-expiry-topic
   ```

---

Great! It seems like you’ve successfully started Kafka and Zookeeper locally. Now, let's break down what each part of the `kafka-topics.sh` command does.

---

### **Command:**
```bash
kafka-topics.sh --create --topic bidding-expiry-topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### **Understanding the Components:**

1. **`kafka-topics.sh`**  
   This is a Kafka CLI script used to manage Kafka topics. You can create, delete, list, and describe topics with this command.

2. **`--create`**  
   This specifies that you're creating a new topic.

3. **`--topic bidding-expiry-topic`**  
   This is the name of the topic you're creating. In this case, the topic is `bidding-expiry-topic`. It will store messages related to expired items.

4. **`--bootstrap-server localhost:9092`**  
   - `localhost:9092` specifies the Kafka broker's address.
   - The **bootstrap server** acts as the entry point for clients (producers/consumers) to communicate with the Kafka cluster.

5. **`--partitions 3`**  
   - Defines how many partitions this topic will have.
   - A **partition** is a subset of the topic's data. Kafka splits a topic's messages into these partitions for scalability.
   - With 3 partitions, the topic's messages will be distributed across 3 partitions. This allows for parallelism and higher throughput.

6. **`--replication-factor 1`**  
   - Defines the number of replicas each partition will have.
   - A **replica** is a copy of the partition stored on another broker for fault tolerance.
   - A replication factor of 1 means there is no replication—only one copy of each partition exists. This is fine for local setups, but in production, you typically use a higher replication factor for fault tolerance.



---

### **What Happens Behind the Scenes:**

- When you create a topic, Kafka sets up the necessary metadata for the topic across the cluster.
- Each partition will store messages separately. For example, if you send messages to `bidding-expiry-topic` and it has 3 partitions, the messages will be distributed among the partitions based on a key (or round-robin if no key is provided).
- Kafka ensures message durability by writing them to disk.

---

### **Verify Topics:**

After running the topic creation commands, you can verify that the topics were created successfully:

```bash
kafka-topics.sh --list --bootstrap-server localhost:9092
```

This will list all the topics in your Kafka broker, including the ones you just created.

---


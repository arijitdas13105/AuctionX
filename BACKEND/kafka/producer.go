// backend/kafka/producer.go
package kafka

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	// "io/ioutil"
	"encoding/pem"
	"github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/sasl/scram"
	"log"
	"os"
)

var writer *kafka.Writer

func InitProducer() {
	caCert := os.Getenv("KAFKA_CA_CERT")
	if caCert == "" {
		log.Fatal("KAFKA_CA_CERT environment variable is not set")
	}

	block, _ := pem.Decode([]byte(caCert))
	if block == nil {
		log.Fatal("Failed to decode CA certificate from environment variable")
	}

	caCertPool := x509.NewCertPool()
	if !caCertPool.AppendCertsFromPEM([]byte(caCert)) {
		log.Fatal("Failed to append CA certificate to pool")
	}

	tlsConfig := &tls.Config{
		RootCAs: caCertPool,
	}

	mechanism, err := scram.Mechanism(scram.SHA512, os.Getenv("KAFKA_USERNAME"), os.Getenv("KAFKA_PASSWORD"))
	if err != nil {
		log.Fatalf("Failed to create SCRAM mechanism: %v", err)
	}

	writer = kafka.NewWriter(kafka.WriterConfig{
		Brokers:  []string{os.Getenv("KAFKA_BROKER")},
		Topic:    "",
		Balancer: &kafka.Hash{},
		Dialer: &kafka.Dialer{
			Timeout:       30 * kafka.DefaultDialer.Timeout,
			DualStack:     true,
			TLS:           tlsConfig,
			SASLMechanism: mechanism,
		},
	})

	log.Println("Kafka producer initialized")
}

func PublishMessageToTopic(topic string, message interface{}) error {
	log.Printf("Received message:➡️➡️ %v", message)
	log.Printf("Publishing message to topic:➡️➡️➡️ %s", topic)
	messageBytes, err := json.Marshal(message)
	log.Printf("messageBytes:☢️🙂 %v", messageBytes)
	if err != nil {
		return err
	}

	err = writer.WriteMessages(context.Background(), kafka.Message{
		Topic: topic,
		Value: messageBytes,
	})
	if err != nil {
		return err
	}

	log.Printf("Message published to %s: %s", topic, string(messageBytes))
	return nil
}

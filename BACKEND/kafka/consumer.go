// backend/kafka/consumer.go
package kafka

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	// "io/ioutil"
	"encoding/pem"
	"github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/sasl/scram"
	"log"
	"os"
)

func StartConsumer(topic string, groupID string, handler func(message []byte)) {
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

	// Initialize Kafka reader
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{os.Getenv("KAFKA_BROKER")},
		Topic:   topic,
		GroupID: groupID,
		Dialer: &kafka.Dialer{
			Timeout:       30 * kafka.DefaultDialer.Timeout,
			DualStack:     true,
			TLS:           tlsConfig,
			SASLMechanism: mechanism,
		},
	})

	defer reader.Close()

	log.Printf("Kafka consumer started for topic: %s", topic)

	for {
		msg, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Failed to read message: %v", err)
			continue
		}

		log.Printf("Received message from topic %s: %s", topic, string(msg.Value))
		handler(msg.Value)
	}
}

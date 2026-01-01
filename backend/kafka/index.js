import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ezshop",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();
export const userConsumer = kafka.consumer({ groupId: "user-group" });
export const orderConsumer = kafka.consumer({ groupId: "order-group" });

export async function connectKafka() {
  let retries = 5;
  while (retries > 0) {
    try {
      await producer.connect();
      await userConsumer.connect();
      await orderConsumer.connect();
      await userConsumer.subscribe({ topic: "user-creation", fromBeginning: true });
      await orderConsumer.subscribe({ topic: "order-creation", fromBeginning: true });
      console.log("Connected to Kafka successfully.");
      return;
    } catch (err) {
      console.error(`Failed to connect to Kafka: ${err.message}`);
      retries--;
      if (retries === 0) {
        throw err;
      }
      console.log(`Retrying to connect to Kafka... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

export default kafka;


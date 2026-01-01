import { userConsumer } from "../kafka/index.js";
import prisma from "../db/db.js";

export async function runUserConsumer() {
  await userConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { name, email } = JSON.parse(message.value.toString());
      console.log(`Received message: { name: ${name}, email: ${email} }`);

      try {
        await prisma.user.create({
          data: { name, email },
        });
        console.log(`User ${name} created successfully.`);
      } catch (err) {
        console.error(`Error creating user: ${err.message}`);
      }
    },
  });
}

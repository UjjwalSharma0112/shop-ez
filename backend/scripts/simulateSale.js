import { producer } from "../kafka/index.js";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function simulateSale() {
  await producer.connect();

  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  if (users.length === 0 || products.length === 0) {
    console.log("Please seed the database first with users and products.");
    return;
  }

  for (let i = 0; i < Math.min(200, users.length); i++) {
    const user = users[i];
    const numItems = Math.floor(Math.random() * 5) + 1;
    const items = [];

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      items.push({
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1,
      });
    }

    const orderData = {
      userId: user.id,
      items,
    };

    await producer.send({
      topic: "order-creation",
      messages: [{ value: JSON.stringify(orderData) }],
    });

    console.log(`Sent order creation message for user ${user.id}`);
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate some delay
  }

  await producer.disconnect();
  await prisma.$disconnect();
}

simulateSale().catch(e => {
  console.error(e);
  process.exit(1);
});

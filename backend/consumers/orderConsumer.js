import { orderConsumer } from "../kafka/index.js";
import prisma from "../db/db.js";

async function processOrder({ userId, items }) {
  try {
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const insufficient = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        insufficient.push({ id: item.productId, reason: "Product not found" });
      } else if (product.stock < item.quantity) {
        insufficient.push({
          id: product.id,
          reason: `Only ${product.stock} left`,
        });
      }
    }

    if (insufficient.length > 0) {
      console.error("Insufficient stock for some items", { details: insufficient });
      return;
    }

    const total = items.reduce((sum, i) => {
      const product = products.find((p) => p.id === i.productId);
      return sum + product.price * i.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: parseInt(userId),
          total,
          status: "pending",
        },
      });

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    console.log(`Order ${order.id} placed successfully for user ${userId}`);
  } catch (err) {
    console.error(`Error processing order for user ${userId}: ${err.message}`);
  }
}

export async function runOrderConsumer() {
  await orderConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const orderData = JSON.parse(message.value.toString());
      console.log(`Received order creation message for user ${orderData.userId}`);
      await processOrder(orderData);
    },
  });
}

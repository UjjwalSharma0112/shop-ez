import prisma from "../db/db.js";


// Create a new user

export async function createUser(req, res) {
  const { name, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Get all orders for a user

export async function getOrders(req, res) {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { orders: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ orders: user.orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new order for a user


export async function makeOrder(req, res) {
  const { id } = req.query; // user id
  const { items } = req.body; // [{ productId, quantity }]

  try {
    // gettin all product
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // check content
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
      return res.status(400).json({
        error: "Insufficient stock for some items",
        details: insufficient,
      });
    }

    // compute
    const total = items.reduce((sum, i) => {
      const product = products.find((p) => p.id === i.productId);
      return sum + product.price * i.quantity;
    }, 0);

    //  Create order + order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 4a. Create order
      const newOrder = await tx.order.create({
        data: {
          userId: parseInt(id),
          total,
          status: "pending",
        },
      });

      // Create order items
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

        // . Reduce stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.json({ message: "Order placed successfully", orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

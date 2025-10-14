import prisma from "../db/db.js";


export async function getProduct(req, res) {
  try {

    const products = await prisma.product.findMany({
      include: {
        vendor: true,
      },
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}
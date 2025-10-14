import prisma from "../db/db.js";


export async function createVendor(req, res) {
  const { name, email } = req.body;

  try {
    const user = await prisma.vendor.create({
      data: { name, email },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



export async function addProduct(req, res) {
  const { id } = req.query; // vendor id
  const { name, description, price, stock } = req.body;

  try {
    // Check vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: parseInt(id) },
    });

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        vendorId: vendor.id,
      },
    });

    res.json({ message: "Product added successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


export async function listProducts(req, res) {
  const { id } = req.query; // vendor id

  try {
    const products = await prisma.product.findMany({
      where: { vendorId: parseInt(id) },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
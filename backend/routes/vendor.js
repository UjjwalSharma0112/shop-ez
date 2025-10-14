import express from "express";
import { createVendor, listProducts, addProduct } from "../services/vendor.js"

const router = express.Router();

router.post("/signup", createVendor);


router.post("/product", addProduct);
router.get("/product", listProducts);
export default router;
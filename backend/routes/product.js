import express from "express";
import { getProduct } from "../services/product.js";
const router = express.Router();


router.get("/", getProduct);

export default router;
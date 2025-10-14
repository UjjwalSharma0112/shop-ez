import express from "express";

import { createUser, getOrders, makeOrder } from "../services/user.js"
const router = express.Router();

//sign up
router.post("/signup", createUser);

// order something
router.post("/order", makeOrder)

// get all order
router.get("/order", getOrders)



export default router;
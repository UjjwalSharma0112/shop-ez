import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserRouter from "./routes/user.js";
import VendorRouter from "./routes/vendor.js";
import ProductRouter from "./routes/product.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api/user', UserRouter);
app.use('/api/vendor', VendorRouter);
app.use('/api/product', ProductRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
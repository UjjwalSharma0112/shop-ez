import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserRouter from "./routes/user.js";
import VendorRouter from "./routes/vendor.js";
import ProductRouter from "./routes/product.js";
import { connectKafka, userConsumer, orderConsumer, producer } from "./kafka/index.js";
import { runUserConsumer } from './consumers/userConsumer.js';
import { runOrderConsumer } from './consumers/orderConsumer.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/user', UserRouter);
app.use('/api/vendor', VendorRouter);
app.use('/api/product', ProductRouter);

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectKafka();
  await runUserConsumer();
  await runOrderConsumer();

  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    await producer.disconnect();
    await userConsumer.disconnect();
    await orderConsumer.disconnect();
    server.close(() => {
      console.log('Server has been shut down.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer();
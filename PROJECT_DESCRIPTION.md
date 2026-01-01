# Project Description: E-commerce Application with Kafka Integration

## 1. Project Overview

This project is a full-stack e-commerce application designed to simulate a real-world online shopping platform. It includes a frontend built with React and a backend powered by Node.js and Express. The application uses a PostgreSQL database managed by Prisma ORM. A key feature of this project is the integration of Apache Kafka to handle high-volume data streams, specifically for simulating sales and processing orders asynchronously.

## 2. Architecture

The application is composed of the following components:

*   **Frontend:** A responsive and interactive user interface built with **React**. It allows users to browse products, add items to their cart, and place orders.
*   **Backend:** A RESTful API built with **Node.js** and **Express**. It handles business logic, user authentication, and data management.
*   **Database:** A **PostgreSQL** database is used for data persistence. **Prisma ORM** is used to interact with the database, providing a type-safe and intuitive API.
*   **Messaging Queue:** **Apache Kafka** is used as a messaging queue to decouple services and handle asynchronous operations. It is running in **KRaft mode**, which eliminates the need for a separate Zookeeper cluster.
*   **Containerization:** **Docker** and **Docker Compose** are used to containerize and manage the database and Kafka services, ensuring a consistent and reproducible development environment.

## 3. Key Features

*   **User Management:** Users can sign up, log in, and manage their accounts.
*   **Product Catalog:** Products are organized by vendors and can be browsed by users.
*   **Shopping Cart:** Users can add products to their shopping cart and manage its contents.
*   **Order Processing:** Users can place orders, which are then processed asynchronously.
*   **Sales Simulation:** A script is provided to simulate a high volume of sales, demonstrating the application's ability to handle large amounts of data.

## 4. Sales Simulation

The sales simulation is a key component of this project, designed to showcase the benefits of using Kafka for asynchronous processing. The simulation works as follows:

1.  **Seeding the Database:** A seed script populates the database with a large number of vendors, products, and users.
2.  **Simulating Orders:** The simulation script fetches existing users and products from the database and creates a high volume of random orders.
3.  **Publishing to Kafka:** Instead of directly writing to the database, the simulation script publishes order creation events to a Kafka topic named `order-creation`.
4.  **Asynchronous Consumption:** A dedicated Kafka consumer listens to the `order-creation` topic, processes the order data, and creates the corresponding records in the database.

This approach allows the application to handle a large influx of orders without overwhelming the database, ensuring a responsive and scalable system.

## 5. Kafka Integration

Kafka is integrated into the backend to handle two main asynchronous tasks:

*   **User Creation:** A `user-creation` topic is used to process new user sign-ups asynchronously.
*   **Order Creation:** An `order-creation` topic is used to process new orders asynchronously, as described in the sales simulation section.

The backend includes separate consumers for each of these topics, allowing for independent processing and scaling. The use of Kafka ensures that the application remains responsive even under heavy load, and it provides a reliable and fault-tolerant way to process important events.

## 6. Setup and Usage

To set up and run the project, follow these steps:

1.  **Start Docker Services:** Run `docker-compose up -d` to start the PostgreSQL database and Kafka broker.
2.  **Reset and Seed Database:** In the `backend` directory, run `npx prisma migrate reset` to create the database schema and populate it with initial data.
3.  **Start Backend Server:** In the `backend` directory, run `npm start` to start the backend server.
4.  **Run Sales Simulation:** In a separate terminal, navigate to the `backend` directory and run `npm run simulate-sale` to start the sales simulation.
5.  **Start Frontend:** Navigate to the `frontend/project` directory, run `npm install`, and then `npm run dev` to start the frontend development server.

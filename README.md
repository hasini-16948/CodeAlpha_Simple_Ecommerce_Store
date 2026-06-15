# ShopZone - Simple E-Commerce Store

## Project Overview
ShopZone is a full-stack e-commerce web application developed as part of the CodeAlpha Full Stack Development Internship.

The application allows users to browse products, view product details, add products to a shopping cart, register/login, place orders, and view order history.

## Features

### Product Management
* View all products
* Product details page
* Product images

### Shopping Cart
* Add products to cart
* View cart items
* Clear cart
* Continue shopping

### User Authentication
* User Registration
* User Login

### Order Management
* Place orders
* Store orders locally
* View all orders

## Technologies Used

### Frontend
* HTML
* CSS
* JavaScript

### Backend
* Node.js
* Express.js

### Database
* Local File System JSON storage handler

## Project Structure
```text
SimpleEcommerceStore/
├── backend/
│   ├── data.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── cart.html
│   ├── index.html
│   ├── login.html
│   ├── orders.html
│   └── product.html
└── README.md
Installation
Backend Setup
cd backend
npm install
node server.js
Frontend
Open frontend/index.html or frontend/login.html in browser.
API Endpoints
GET /products
POST /products
GET /products/:id
POST /register
POST /login
POST /orders
GET /orders
Built as part of the CodeAlpha Internship Program.
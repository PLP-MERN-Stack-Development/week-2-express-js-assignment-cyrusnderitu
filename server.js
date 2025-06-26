// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// && ### Task 3: Middleware Implementation

// TODO: Implement custom middleware for:

//  Logger middleware that logs the request method, URL, and timestamp.
app.use((req, _res, next) => {
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${req.method} request to ${req.url}`);
  next(); // Call the next middleware or route handler
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Authentication middleware that checks for an API key in the request headers
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

//  Validation middleware for the product creation and update routes.
app.use('/api/products', (req, res, next) => {
  const { name, description, price, category } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  next(); // Call the next middleware or route handler
});

// && ### Task 4: Error Handling

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
  next(); // Call the next middleware or route handler
});



// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// && ### Task 2: RESTful API Routes
// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  }
  else {
    console.error(`Product with ID ${productId} not found`);
    res.status(404).json({ error: 'Product not found' });
  }
});
// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: uuidv4(), // Generate a unique ID
    ...req.body // Spread the request body into the new product object
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex !== -1) {
    const updatedProduct = {
      ...products[productIndex],
      ...req.body // Update the product with the request body
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } else {
    console.error(`Product with ID ${productId} not found`);
    res.status(404).json({ error: 'Product not found' });
  }
});
// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex !== -1) {
    products.splice(productIndex, 1); // Remove the product from the array
    res.status(204).send(); // No content response
  } else {
    console.error(`Product with ID ${productId} not found`);
    res.status(404).json({ error: 'Product not found' });
  }
});
// app.delete('/api/products/:id', (req, res) => {
//   const productId = req.params.id;
//   const productIndex = products.findIndex(p => p.id === productId);
//   if (!productIndex){
//     console.error(`Product with ID ${productId} not found`);
//     return res.status(404).json({ error: 'Product not found' });
//   }else{
//     const remainingProducts = products.filter(p => p.id !== productId);
//     products = remainingProducts; // Update the products array
//     res.status(204).send(products);
//   }
// });


// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 
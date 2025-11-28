const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Basic route for testing
app.get('/', (req, res) => {
  res.send('IAM Service is running!');
});

// --- Routes will be added here ---
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Start the server
app.listen(port, () => {
  console.log(`IAM Service listening on port ${port}`);
});

// src/server.js
const express = require('express');
const app = require('./app');
const { swaggerUi, specs } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

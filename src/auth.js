// src/auth.js
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Mantenha este segredo seguro

// Geração do Token
function generateToken(user) {
  return jwt.sign({ id: user.id, type: user.type }, secret, { expiresIn: '1h' });
}

// Verificação do Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  generateToken,
  authenticateToken,
};
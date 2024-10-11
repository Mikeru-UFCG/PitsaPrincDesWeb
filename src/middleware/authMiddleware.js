const jwt = require('jsonwebtoken');
const prisma = require('@prisma/client'); // Importa o Prisma Client

// Middleware para autenticação e autorização com base em papéis
const authenticateAndAuthorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido ou inválido' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verifica o token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');

      // Verifica se o papel do usuário está entre os papéis permitidos
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }

      // Verifica se o usuário existe no banco de dados usando Prisma
      let user;
      switch (decoded.role) {
        case 'estabelecimento':
          user = await prisma.estabelecimento.findUnique({
            where: { codigoAcesso: decoded.codigoAcesso },
          });
          break;
        case 'cliente':
          user = await prisma.cliente.findUnique({
            where: { codigoAcesso: decoded.codigoAcesso },
          });
          break;
        case 'entregador':
          user = await prisma.entregador.findUnique({
            where: { codigoAcesso: decoded.codigoAcesso },
          });
          break;
        default:
          return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Adiciona o usuário autenticado à requisição
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  };
};

module.exports = authenticateAndAuthorize;

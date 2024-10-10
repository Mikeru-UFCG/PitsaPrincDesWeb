const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SaborController {
  static async createSabor(req, res) {
    try {
      const sabor = await prisma.sabor.create({
        data: req.body,
      });
      res.status(201).json(sabor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar sabor' });
    }
  }

  static async updateSabor(req, res) {
    try {
      const { id } = req.params;
      const sabor = await prisma.sabor.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(sabor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar sabor' });
    }
  }

  static async deleteSabor(req, res) {
    try {
      const { id } = req.params;
      await prisma.sabor.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir sabor' });
    }
  }

  static async getSabor(req, res) {
    try {
      const { id } = req.params; // Obtém o ID do sabor da URL
      const sabor = await prisma.sabor.findUnique({
        where: { id: parseInt(id) }, // Busca o sabor pelo ID
      });
  
      if (!sabor) {
        // Se o sabor não for encontrado, retorna um erro 404
        return res.status(404).json({ error: 'Sabor não encontrado' });
      }
  
      res.status(200).json(sabor); // Retorna o sabor encontrado
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar sabor' }); // Trata erros
    }
  }

  static async getSabores(req, res) {
    try {
      const sabores = await prisma.sabor.findMany({
        where: { estabelecimentoId: parseInt(req.query.estabelecimentoId) },
      });
      res.status(200).json(sabores);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar sabores' });
    }
  }

  static async toggleDisponibilidadeSabor(req, res) {
    const { estabelecimentoId, saborId } = req.params;
    const { disponibilidade } = req.body;

    try {
      const estabelecimento = await prisma.estabelecimento.update({
        where: { id: estabelecimentoId },
        data: {
          sabores: {
            update: {
              where: { id: saborId },
              data: { disponibilidade: disponibilidade },
            },
          },
        },
      });

      res.json(estabelecimento);
    } catch (error) {
      if (error.code === 'P2025') {
        // Se o erro for P2025, significa que o registro não foi encontrado
        return res.status(404).json({ error: 'Sabor ou Estabelecimento não encontrado' });
      }

      // Caso contrário, retornamos o erro genérico
      return res.status(500).json({ error: 'Erro ao alterar a disponibilidade do sabor' });
    }
  }
  

}

module.exports = SaborController;
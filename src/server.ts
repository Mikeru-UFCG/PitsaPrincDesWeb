import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

// Rota principal
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Definição das interfaces para os objetos
interface Estabelecimento {
  nome: string;
  codigoAcesso: string;
}

interface Cliente {
  nome: string;
  endereco: string;
  codigoAcesso: string;
}

interface Entregador {
  nome: string;
  placaVeiculo: string;
  tipo: string; // carro ou moto
  corVeiculo: string;
  codigoAcesso: string;
}

// Simulação de banco de dados em memória
const estabelecimentos: Estabelecimento[] = [];
const clientes: Cliente[] = [];
const entregadores: Entregador[] = [];

// Rotas CRUD para Estabelecimento
app.post('/estabelecimentos', (req: Request, res: Response) => {
  const novoEstabelecimento: Estabelecimento = req.body;
  estabelecimentos.push(novoEstabelecimento);
  res.status(201).send(novoEstabelecimento);
});

app.get('/estabelecimentos', (req: Request, res: Response) => {
  res.send(estabelecimentos);
});

app.get('/estabelecimentos/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const estabelecimento = estabelecimentos.find(e => e.codigoAcesso === codigoAcesso);
  if (estabelecimento) {
    res.send(estabelecimento);
  } else {
    res.status(404).send({ message: 'Estabelecimento não encontrado' });
  }
});

app.put('/estabelecimentos/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const index = estabelecimentos.findIndex(e => e.codigoAcesso === codigoAcesso);
  if (index !== -1) {
    estabelecimentos[index] = req.body;
    res.send(estabelecimentos[index]);
  } else {
    res.status(404).send({ message: 'Estabelecimento não encontrado' });
  }
});

app.delete('/estabelecimentos/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const index = estabelecimentos.findIndex(e => e.codigoAcesso === codigoAcesso);
  if (index !== -1) {
    const deletedEstabelecimento = estabelecimentos.splice(index, 1);
    res.send(deletedEstabelecimento);
  } else {
    res.status(404).send({ message: 'Estabelecimento não encontrado' });
  }
});

// Rotas CRUD para Cliente
app.post('/clientes', (req: Request, res: Response) => {
  const novoCliente: Cliente = req.body;
  clientes.push(novoCliente);
  res.status(201).send(novoCliente);
});

app.get('/clientes', (req: Request, res: Response) => {
  res.send(clientes);
});

app.get('/clientes/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const cliente = clientes.find(c => c.codigoAcesso === codigoAcesso);
  if (cliente) {
    res.send(cliente);
  } else {
    res.status(404).send({ message: 'Cliente não encontrado' });
  }
});

app.put('/clientes/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const index = clientes.findIndex(c => c.codigoAcesso === codigoAcesso);
  if (index !== -1) {
    clientes[index] = req.body;
    res.send(clientes[index]);
  } else {
    res.status(404).send({ message: 'Cliente não encontrado' });
  }
});

app.delete('/clientes/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const index = clientes.findIndex(c => c.codigoAcesso === codigoAcesso);
  if (index !== -1) {
    const deletedCliente = clientes.splice(index, 1);
    res.send(deletedCliente);
  } else {
    res.status(404).send({ message: 'Cliente não encontrado' });
  }
});

// Rotas CRUD para Entregador
app.post('/entregadores', (req: Request, res: Response) => {
  const novoEntregador: Entregador = req.body;
  entregadores.push(novoEntregador);
  res.status(201).send(novoEntregador);
});

app.get('/entregadores', (req: Request, res: Response) => {
  res.send(entregadores);
});

app.get('/entregadores/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const entregador = entregadores.find(e => e.codigoAcesso === codigoAcesso);
  if (entregador) {
    res.send(entregador);
  } else {
    res.status(404).send({ message: 'Entregador não encontrado' });
  }
});

app.put('/entregadores/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const index = entregadores.findIndex(e => e.codigoAcesso === codigoAcesso);
  if (index !== -1) {
    entregadores[index] = req.body;
    res.send(entregadores[index]);
  } else {
    res.status(404).send({ message: 'Entregador não encontrado' });
  }
});

app.delete('/entregadores/:codigoAcesso', (req: Request, res: Response) => {
  const codigoAcesso = req.params.codigoAcesso;
  const index = entregadores.findIndex(e => e.codigoAcesso === codigoAcesso);
  if (index !== -1) {
    const deletedEntregador = entregadores.splice(index, 1);
    res.send(deletedEntregador);
  } else {
    res.status(404).send({ message: 'Entregador não encontrado' });
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

-- CreateEnum
CREATE TYPE "TipoVeiculo" AS ENUM ('MOTO', 'CARRO');

-- CreateEnum
CREATE TYPE "TipoSabor" AS ENUM ('SALGADO', 'DOCE');

-- CreateEnum
CREATE TYPE "PedidoStatus" AS ENUM ('RECEBIDO', 'PREPARO', 'PRONTO', 'ROTA', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "Pagamento" AS ENUM ('CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX');

-- CreateEnum
CREATE TYPE "EntregadorStatus" AS ENUM ('DESCANSO', 'ATIVO');

-- CreateEnum
CREATE TYPE "EntregaStatus" AS ENUM ('ATRIBUIDO', 'EM_PREPARO', 'PRONTO', 'EM_ROTA', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "TamanhoPizza" AS ENUM ('MEDIA', 'GRANDE');

-- CreateEnum
CREATE TYPE "OperacaoTipo" AS ENUM ('CADASTRO', 'ALTERACAO', 'EXCLUSAO');

-- CreateTable
CREATE TABLE "Estabelecimento" (
    "id" SERIAL NOT NULL,
    "codigoAcesso" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Estabelecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "codigoAcesso" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entregador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "placaVeiculo" TEXT NOT NULL,
    "tipoVeiculo" "TipoVeiculo" NOT NULL,
    "corVeiculo" TEXT NOT NULL,
    "codigoAcesso" TEXT NOT NULL,
    "status" "EntregadorStatus" NOT NULL DEFAULT 'DESCANSO',

    CONSTRAINT "Entregador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sabor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoSabor" NOT NULL,
    "valorMedio" DOUBLE PRECISION NOT NULL,
    "valorGrande" DOUBLE PRECISION NOT NULL,
    "disponibilidade" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sabor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "estabelecimentoId" INTEGER NOT NULL,
    "enderecoEntrega" TEXT,
    "status" "PedidoStatus" NOT NULL DEFAULT 'RECEBIDO',
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "pagamento" "Pagamento" NOT NULL,
    "entregadorId" INTEGER,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pizza" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "tamanho" "TamanhoPizza" NOT NULL,

    CONSTRAINT "Pizza_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PizzaSabor" (
    "id" SERIAL NOT NULL,
    "pizzaId" INTEGER NOT NULL,
    "saborId" INTEGER NOT NULL,

    CONSTRAINT "PizzaSabor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteresseSabor" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "saborId" INTEGER NOT NULL,

    CONSTRAINT "InteresseSabor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntregadorEstabelecimento" (
    "id" SERIAL NOT NULL,
    "entregadorId" INTEGER NOT NULL,
    "estabelecimentoId" INTEGER NOT NULL,
    "aprovado" BOOLEAN NOT NULL,

    CONSTRAINT "EntregadorEstabelecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntregadorCliente" (
    "id" SERIAL NOT NULL,
    "entregadorId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "EntregadorCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperacaoEstabelecimento" (
    "id" SERIAL NOT NULL,
    "estabelecimentoId" INTEGER NOT NULL,
    "codigoAcesso" TEXT NOT NULL,
    "operacaoTipo" "OperacaoTipo" NOT NULL,

    CONSTRAINT "OperacaoEstabelecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperacaoCliente" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "codigoAcesso" TEXT NOT NULL,
    "operacaoTipo" "OperacaoTipo" NOT NULL,

    CONSTRAINT "OperacaoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER,
    "pedidoId" INTEGER,
    "mensagem" TEXT NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "entregadorId" INTEGER,
    "status" "EntregaStatus" NOT NULL DEFAULT 'ATRIBUIDO',

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EstabelecimentoToSabor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Estabelecimento_codigoAcesso_key" ON "Estabelecimento"("codigoAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "_EstabelecimentoToSabor_AB_unique" ON "_EstabelecimentoToSabor"("A", "B");

-- CreateIndex
CREATE INDEX "_EstabelecimentoToSabor_B_index" ON "_EstabelecimentoToSabor"("B");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pizza" ADD CONSTRAINT "Pizza_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaSabor" ADD CONSTRAINT "PizzaSabor_pizzaId_fkey" FOREIGN KEY ("pizzaId") REFERENCES "Pizza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaSabor" ADD CONSTRAINT "PizzaSabor_saborId_fkey" FOREIGN KEY ("saborId") REFERENCES "Sabor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteresseSabor" ADD CONSTRAINT "InteresseSabor_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteresseSabor" ADD CONSTRAINT "InteresseSabor_saborId_fkey" FOREIGN KEY ("saborId") REFERENCES "Sabor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregadorEstabelecimento" ADD CONSTRAINT "EntregadorEstabelecimento_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregadorEstabelecimento" ADD CONSTRAINT "EntregadorEstabelecimento_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregadorCliente" ADD CONSTRAINT "EntregadorCliente_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntregadorCliente" ADD CONSTRAINT "EntregadorCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperacaoEstabelecimento" ADD CONSTRAINT "OperacaoEstabelecimento_estabelecimentoId_fkey" FOREIGN KEY ("estabelecimentoId") REFERENCES "Estabelecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperacaoCliente" ADD CONSTRAINT "OperacaoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstabelecimentoToSabor" ADD CONSTRAINT "_EstabelecimentoToSabor_A_fkey" FOREIGN KEY ("A") REFERENCES "Estabelecimento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstabelecimentoToSabor" ADD CONSTRAINT "_EstabelecimentoToSabor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sabor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

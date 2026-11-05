const express = require("express");
const crypto = require("crypto");
const Joi = require("joi");
const router = express.Router();
const db = require("../../db.js");

// price é opcional: se vier null/omitido, usa o preço cadastrado do produto
const gameCreditSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  price: Joi.number().integer().positive().allow(null)
});

// ==========================================
// JOGOS AUTORIZADOS
// Para liberar outro jogo no futuro, basta adicionar um item aqui
// (e o secret correspondente no .env). Jogo sem token = desativado.
// ==========================================
const JOGOS = [
  {
    nome: "bomb.exe",
    token: process.env.BOMBEXE_SECRET,
    // TODO: TROCAR pelo id real do produto do Bomb.exe (56 é provisório!)
    productId: 56
  }
];

// Comparação em tempo constante (evita descobrir o token por tempo de resposta)
const hash = (v) => crypto.createHash("sha256").update(String(v)).digest();

function tokenConfere(recebido, esperado) {
  if (!esperado) return false; // nunca aceita token vazio/não configurado
  return crypto.timingSafeEqual(hash(recebido), hash(esperado));
}

router.post("/gameCredit", async (req, res) => {
  // 1) Token do jogo (header Authorization: Bearer <secret>)
  const tokenRecebido = req.token;
  if (!tokenRecebido) {
    return res.sendStatus(401);
  }

  // Descobre a qual jogo o token pertence
  const jogo = JOGOS.find((j) => tokenConfere(tokenRecebido, j.token));
  if (!jogo) {
    return res.sendStatus(401);
  }

  try {
    // 2) Valida o corpo da requisição
    const { error, value } = gameCreditSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { userId, price } = value;

    // 3) Verifica se o usuário que vai receber o crédito existe
    const userSearch = await db.query(
      'SELECT "id" FROM "people" WHERE "id" = $1',
      [userId]
    );
    if (userSearch.rowCount === 0) {
      return res.sendStatus(404);
    }

    // 4) Verifica se o produto do jogo existe e é do tipo "games"
    const productSearch = await db.query(
      "SELECT price FROM products WHERE id = $1 AND type = (SELECT id FROM types WHERE name = 'games')",
      [jogo.productId]
    );
    if (productSearch.rowCount === 0) {
      return res.sendStatus(404);
    }

    // price do body, se enviado; senão, o preço cadastrado do produto
    const productValue =
      price === null || price === undefined
        ? productSearch.rows[0].price
        : price;

    // 5) Credita
    const result = await db.query(
      `INSERT INTO "operations"
       ("from", "to", "product", "value", "date", "completed")
       VALUES (1, $1, $2, $3, NOW(), true)
       RETURNING "id"`,
      [userId, jogo.productId, productValue]
    );

    return res.status(201).send({
      operationId: result.rows[0].id
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

module.exports = router;
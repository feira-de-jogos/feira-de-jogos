const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const Joi = require("joi");
const client = new OAuth2Client();
const audience = process.env.GOOGLE_CLIENT_ID.split(" ");
const db = require("../../db.js");

const adminCreditSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required()
});

router.post("/adminCredit", async (req, res) => {
  let payload;
  let email;
  try {
    const ticket = await client.verifyIdToken({
      audience,
      idToken: req.token,
    });
    payload = ticket.getPayload();
    email = payload.email;
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }

  try {
    // Verifica se o usuário é admin
    const auth = await db.query(
      'SELECT "id" FROM "people" WHERE "email" = $1 and "operator" = true',
      [email]
    );
    if (auth.rowCount === 0) {
      return res.sendStatus(401);
    }

    // Valida o corpo da requisição
    const { error } = adminCreditSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { userId, productId, quantity } = req.body;

    // Verifica se o usuário que vai receber o crédito existe
    const userSearch = await db.query(
      'SELECT "id" FROM "people" WHERE "id" = $1',
      [userId]
    );
    if (userSearch.rowCount === 0) {
      return res.sendStatus(404);
    }

    // Verifica se o produto existe e é do tipo "games"
    const productSearch = await db.query(
    "SELECT price FROM products WHERE id = $1 AND type = (SELECT id FROM types WHERE name = 'games')",
    [productId]
    );
    if (productSearch.rowCount === 0) {
      return res.sendStatus(404);
    }
    let productValue = productSearch.rows[0].price;

    if (quantity > 10){
      return res.sendStatus(429);
    } 
    const placeholders = [];

    for (let i = 0; i < quantity; i++) {
      placeholders.push(`(1, $1, $2, $3, NOW(), true)`);
    }

    const query = `
      INSERT INTO "operations"
      ("from", "to", "product", "value", "date", "completed")
      VALUES
      ${placeholders.join(",")}
      RETURNING "id"
    `;

    const result = await db.query(query, [
      userId,
      productId,
      productValue
    ]);

    // return res.status(201).send({
    // operations: result.rows.map(row => row.id) // Saída: "operations": [51, 52, 53]
    // });

    return res.status(201).send({
    created: result.rowCount // Saída: "created": 3
    });


  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }

});

module.exports = router;

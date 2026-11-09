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
    "SELECT id FROM products WHERE id = $1 AND type = (SELECT id FROM types WHERE name = 'games')",
    [productId]
    );
    if (productSearch.rowCount === 0) {
      return res.sendStatus(404);
    }

    const query = `
      INSERT INTO "operations"
      ("from", "to", "product", "value", "date", "completed")
      VALUES (1, $1, $2, $3, NOW(), true)
      RETURNING "id"
    `;

    const result = await db.query(query, [
      userId,
      productId,
      quantity
    ]);

    return res.status(201).send({
      created: result.rowCount
    });


  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }

});

module.exports = router;

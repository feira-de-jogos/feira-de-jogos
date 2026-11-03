const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const Joi = require("joi");
const client = new OAuth2Client();
const audience = process.env.GOOGLE_CLIENT_ID.split(" ");
const db = require("../../db.js");

const getUserSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});

router.post("/getUser", async (req, res) => {
  let email;
  try {
    const ticket = await client.verifyIdToken({
      audience,
      idToken: req.token,
    });
    email = ticket.getPayload().email;
  } catch (err) {
    console.error(err);
    return res.sendStatus(401);
  }

  try {
    // Verifica se quem chama é admin (operador)
    const auth = await db.query(
      'SELECT "id" FROM "people" WHERE "email" = $1 and "operator" = true',
      [email]
    );
    if (auth.rowCount === 0) {
      return res.sendStatus(401);
    }

    // Valida o corpo da requisição
    const { error, value } = getUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    const { userId } = value;

    // Busca o usuário solicitado
    const result = await db.query(
      'SELECT "id", "name" FROM "people" WHERE "id" = $1',
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).send({ error: "Usuário não encontrado." });
    }

    return res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

module.exports = router;
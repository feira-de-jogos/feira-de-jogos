require("dotenv").config();
const { app, httpServer } = require("./http-server.js");
const port = process.env.PORT || 3000;

const postLogin = require("./routes/postLogin");
const postTransfer = require("./routes/postTransfer");
const postDebit = require("./routes/postDebit");
const postCredit = require("./routes/postCredit");
const postMfa = require("./routes/postMfa");
const postConfirmPurchase = require("./routes/postConfirmPurchase.js");
const postAdminCredit = require("./routes/postAdminCredit.js");
const getBalance = require("./routes/getBalance");
const getGames = require("./routes/getGames");
const getStatement = require("./routes/getStatement");
const getProducts = require("./routes/getProducts");
const getUncompletedPurchases = require("./routes/getUncompletedPurchases");
const getHealth = require("./routes/getHealth");

app.use("/api/v2", postLogin);
app.use("/api/v2", postTransfer);
app.use("/api/v2", postDebit);
app.use("/api/v2", postCredit);
app.use("/api/v2", postMfa);
app.use("/api/v2", postConfirmPurchase);
app.use("/api/v2", getBalance);
app.use("/api/v2", getGames);
app.use("/api/v2", getStatement);
app.use("/api/v2", getProducts);
app.use("/api/v2", getUncompletedPurchases);
app.use("/api/v2", postAdminCredit);
app.use("/api/v2", getHealth);

require("./ws-namespaces/default.js");
require("./ws-namespaces/vending-machine.js");
require("./ws-namespaces/arcade.js");

httpServer.listen(port, () => {
  console.log("Server running!");
});

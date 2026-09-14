const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Página inicial
app.get("/", (req, res) => {
  res.send("ML Alert está online! 🔔");
});

// OAuth do Mercado Livre
app.get("/callback", (req, res) => {
  console.log("Callback recebido:", req.query);

  res.send(`
    <h1>ML Alert</h1>
    <p>Autorização recebida.</p>
    <p>Você pode fechar esta página.</p>
  `);
});

// Webhook do Mercado Livre
app.post("/notifications", (req, res) => {
  console.log("NOTIFICAÇÃO MERCADO LIVRE:");
  console.log(JSON.stringify(req.body, null, 2));

  // Responde rapidamente ao Mercado Livre
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`ML Alert rodando na porta ${PORT}`);
});

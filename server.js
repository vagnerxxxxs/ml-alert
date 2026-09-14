const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.ML_CLIENT_ID;
const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
const REDIRECT_URI = "https://ml-alert.onrender.com/callback";

// Página inicial
app.get("/", (req, res) => {
  res.send("ML Alert está online! 🔔");
});

// OAuth do Mercado Livre
app.get("/callback", async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error("Erro OAuth:", error, error_description || "");
    
    return res.status(400).send(`
      <h1>ML Alert</h1>
      <p>Erro na autorização do Mercado Livre.</p>
      <p>Você pode fechar esta página.</p>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <h1>ML Alert</h1>
      <p>Código de autorização não recebido.</p>
    `);
  }

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro ao obter token:", response.status, data);

      return res.status(400).send(`
        <h1>ML Alert</h1>
        <p>O Mercado Livre recusou a autorização.</p>
        <p>Verifique os logs do servidor.</p>
      `);
    }

    console.log("AUTORIZAÇÃO DO MERCADO LIVRE CONCLUÍDA!");
    console.log("User ID:", data.user_id);
    console.log("Token recebido com sucesso.");

    res.send(`
      <h1>🔔 ML Alert</h1>
      <h2>Autorização concluída!</h2>
      <p>O Mercado Livre foi conectado com sucesso.</p>
      <p>Você pode fechar esta página.</p>
    `);

  } catch (err) {
    console.error("Erro interno:", err);

    res.status(500).send(`
      <h1>ML Alert</h1>
      <p>Erro interno no servidor.</p>
    `);
  }
});

// Webhook do Mercado Livre
app.post("/notifications", (req, res) => {
  console.log("NOTIFICAÇÃO MERCADO LIVRE:");
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`ML Alert rodando na porta ${PORT}`);
});

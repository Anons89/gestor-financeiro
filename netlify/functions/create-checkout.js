// ---- PORTEIRO DO STRIPE: cria a tela de pagamento (Checkout) da assinatura ----
// A chave secreta do Stripe vive SÓ no cofre do Netlify (STRIPE_SECRET_KEY).
// Nunca no navegador, nunca no GitHub, nunca no chat.
// Quem a pessoa É vem do token dela (conferido no Supabase) — nunca do que o
// navegador diz. E a URL de volta é fixa aqui, pra ninguém criar um checkout
// nosso que redireciona pra um site falso.

const { verifyUser } = require("./lib/verify-user");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // O preço não é segredo (é só o "nome da prateleira"), então fica embutido aqui.
  // Deixar fixo aqui impede que o navegador peça um preço diferente.
  const PRICE_ID = "price_1Tzy4iD57sRDEP71XJlyoAkY"; // £2,99/mês (MODO REAL / live)
  const TRIAL_DAYS = 30;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: "Stripe key missing" }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (e) {}

  // CONFERE quem é a pessoa pelo token (aqui não precisa ser assinante ainda —
  // ela está justamente vindo assinar). Só precisa estar logada.
  const auth = await verifyUser(body.accessToken);
  if (!auth.ok) {
    return { statusCode: auth.code, body: JSON.stringify({ error: auth.error }) };
  }
  const userId = auth.userId;
  const email = auth.email;
  // URL de volta: a do próprio site (Netlify preenche URL), nunca a que o navegador mandar
  const origin = process.env.URL || "https://algent.co.uk";

  // Monta os campos no formato que o Stripe espera (formulário).
  const params = new URLSearchParams();
  params.append("mode", "subscription");
  params.append("line_items[0][price]", PRICE_ID);
  params.append("line_items[0][quantity]", "1");
  params.append("subscription_data[trial_period_days]", String(TRIAL_DAYS));
  // Carimba QUEM é a pessoa, pra o "escutador" do próximo degrau saber quem pagou.
  params.append("subscription_data[metadata][user_id]", userId);
  params.append("client_reference_id", userId);
  params.append("metadata[user_id]", userId);
  if (email) params.append("customer_email", email);
  params.append("success_url", origin + "/?paid=1");
  params.append("cancel_url", origin + "/?canceled=1");
  params.append("allow_promotion_codes", "true");

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/x-www-form-urlencoded",
        // Trava a versão da API: o Stripe atualizar a conta não quebra o app
        "Stripe-Version": "2024-06-20",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: (data && data.error && data.error.message) || "Stripe error" }) };
    }
    return { statusCode: 200, body: JSON.stringify({ url: data.url }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Request failed" }) };
  }
};

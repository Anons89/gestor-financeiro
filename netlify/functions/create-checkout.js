// ---- PORTEIRO DO STRIPE: cria a tela de pagamento (Checkout) da assinatura ----
// A chave secreta do Stripe vive SÓ no cofre do Netlify (STRIPE_SECRET_KEY).
// Nunca no navegador, nunca no GitHub, nunca no chat.

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
  const userId = body.userId;
  const email = body.email;
  const origin = body.origin || "";
  if (!userId) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing user" }) };
  }

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

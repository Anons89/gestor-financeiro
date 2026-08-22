// ---- PORTEIRO DO STRIPE: cria a tela de pagamento (Checkout) da assinatura ----
// A chave secreta do Stripe vive SÓ no cofre do Netlify (STRIPE_SECRET_KEY).
// Nunca no navegador, nunca no GitHub, nunca no chat.
// Quem a pessoa É vem do token dela (conferido no Supabase) — nunca do que o
// navegador diz. E a URL de volta é fixa aqui, pra ninguém criar um checkout
// nosso que redireciona pra um site falso.

const { verifyUser } = require("./lib/verify-user");
const { checkLimits } = require("./lib/rate-limit");

const MAX_BODY = 8 * 1024;

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  // O preço não é segredo (é só o "nome da prateleira"), então fica embutido aqui.
  // Deixar fixo aqui impede que o navegador peça um preço diferente.
  const PRICE_ID = "price_1Tzy4iD57sRDEP71XJlyoAkY"; // £2,99/mês (MODO REAL / live)
  const TRIAL_DAYS = 30;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return json(500, { error: "Stripe key missing" });
  }

  const raw = event.body || "{}";
  if (raw.length > MAX_BODY) return json(413, { error: "body too large" });

  let body;
  try { body = JSON.parse(raw); } catch (e) { return json(400, { error: "bad json" }); }
  if (!body || typeof body !== "object") return json(400, { error: "bad json" });

  // CONFERE quem é a pessoa pelo token (aqui não precisa ser assinante ainda —
  // ela está justamente vindo assinar). Só precisa estar logada.
  const auth = await verifyUser(body.accessToken);
  if (!auth.ok) {
    return json(auth.code, { error: auth.error });
  }

  // JÁ TEM ASSINATURA VIVA? Então não abre outra tela de pagamento.
  // Sem isto, a pessoa (ou um script) consegue criar várias assinaturas na mesma
  // conta e acabar sendo cobrada duas ou três vezes pelo mesmo app.
  if (auth.subscribed) {
    return json(409, { error: "already subscribed" });
  }

  // Freio: impede abrir dezenas de sessões de checkout em sequência.
  const limited = await checkLimits(auth.userId, {
    bucket: "checkout",
    burstCapacity: 3,
    burstRefillPerSec: 0.05,  // 1 a cada 20s
    dailyLimit: 20,
  });
  if (limited) return limited;

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
  // Volta para o APP, não para a landing. O ?paid=1 é lido pelo
  // handleReturnFromStripe() do app.js, que agradece, libera o acesso na hora e
  // confirma o status uns segundos depois — mandando para "/" nada disso rodava
  // e quem acabou de pagar caía na página de marketing, sem sinal nenhum.
  // O cancel_url segue junto: quem desistiu estava DENTRO do app.
  params.append("success_url", origin + "/app.html?paid=1");
  params.append("cancel_url", origin + "/app.html?canceled=1");
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
      // O erro real vai pro log do Netlify; o navegador recebe só o aviso genérico
      // (mensagem de erro do Stripe pode entregar detalhes da nossa conta).
      console.error("stripe checkout failed:", data && data.error);
      return json(502, { error: "Stripe error" });
    }
    return json(200, { url: data.url });
  } catch (e) {
    console.error("stripe checkout request failed:", e);
    return json(502, { error: "Request failed" });
  }
};

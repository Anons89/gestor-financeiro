// ---- CANCELAR ASSINATURA (com segurança) ----
// Quando a pessoa clica "cancelar assinatura" dentro do app, o navegador chama aqui.
// Passos deste porteiro:
//   1) CONFERE quem é a pessoa, de verdade, pelo token do Supabase (pra ninguém cancelar a de outro)
//   2) descobre o "cliente Stripe" dela na tabela subscriptions
//   3) pede pro Stripe cancelar AO FIM DO PERÍODO (ela mantém acesso até o fim do que já pagou / do teste)
//
// Segredos (só no cofre do Netlify, nunca no navegador/GitHub/chat):
//   STRIPE_SECRET_KEY      -> chave secreta do Stripe
//   SUPABASE_URL           -> endereço do projeto Supabase
//   SUPABASE_SERVICE_ROLE  -> chave-mestra do Supabase (só o servidor tem)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!stripeKey || !supaUrl || !supaKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server not configured" }) };
  }

  // Pega o token que o navegador mandou (prova de quem está logado)
  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (e) {}
  const accessToken = body.accessToken;
  if (!accessToken) {
    return { statusCode: 401, body: JSON.stringify({ error: "Not signed in" }) };
  }

  try {
    // 1) CONFERE a identidade: pergunta ao Supabase "de quem é este token?"
    const who = await fetch(supaUrl + "/auth/v1/user", {
      headers: { "apikey": supaKey, "Authorization": "Bearer " + accessToken },
    });
    if (!who.ok) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid session" }) };
    }
    const user = await who.json();
    const userId = user && user.id;
    if (!userId) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid session" }) };
    }

    // 2) Acha o cliente Stripe dessa pessoa na tabela subscriptions
    const rowRes = await fetch(
      supaUrl + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(userId) + "&select=stripe_customer_id",
      { headers: { "apikey": supaKey, "Authorization": "Bearer " + supaKey } }
    );
    const rows = rowRes.ok ? await rowRes.json() : [];
    const customerId = rows && rows[0] && rows[0].stripe_customer_id;

    // Sem cliente Stripe = acesso de cortesia ou nunca assinou. Nada pra cancelar no Stripe.
    if (!customerId) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, nothing: true }) };
    }

    // 3) Lista as assinaturas desse cliente no Stripe
    const listRes = await fetch(
      "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(customerId) + "&status=all&limit=10",
      { headers: { "Authorization": "Bearer " + stripeKey } }
    );
    const list = await listRes.json();
    const subs = (list && list.data) ? list.data : [];

    let periodEnd = null;
    let canceledAny = false;

    // Marca cada assinatura viva (ativa ou em teste) pra terminar no fim do período
    for (const s of subs) {
      const alive = (s.status === "active" || s.status === "trialing");
      if (alive && !s.cancel_at_period_end) {
        const params = new URLSearchParams();
        params.append("cancel_at_period_end", "true");
        const upd = await fetch("https://api.stripe.com/v1/subscriptions/" + s.id, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + stripeKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });
        if (upd.ok) {
          canceledAny = true;
          if (s.current_period_end) periodEnd = s.current_period_end; // segundos (epoch)
        }
      } else if (alive && s.cancel_at_period_end) {
        // já estava marcada pra cancelar — trata como sucesso e devolve a data
        canceledAny = true;
        if (s.current_period_end) periodEnd = s.current_period_end;
      }
    }

    if (!canceledAny) {
      // Nenhuma assinatura viva encontrada (talvez já cancelada)
      return { statusCode: 200, body: JSON.stringify({ ok: true, nothing: true }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, periodEnd: periodEnd }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Request failed" }) };
  }
};

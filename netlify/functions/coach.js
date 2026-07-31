// netlify/functions/coach.js
// O PORTEIRO DO COACH: roda no servidor, guarda a chave (do cofre) e conversa com a NVIDIA.
// Recebe a conversa + o perfil + o resumo de gastos, monta as REGRAS aqui (seguro, o celular não mexe nelas)
// e devolve só a resposta do coach.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "method" }) };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const profile = body.profile || {};
    const spending = body.spending || "(sem dados)";
    const langName = body.lang === "en" ? "British English (UK spelling and tone — organise, favourite, £, everyday British phrasing, not American)" : "português";

    const prof =
      "Renda mensal: " + (profile.income ? "£" + profile.income : "não informada") +
      ". Objetivo: " + (profile.goal || "não informado") +
      ". Conforto com risco: " + (profile.risk || "não informado") + ".";

    // As REGRAS do coach ficam AQUI no servidor (não no celular): educa, mas nunca recomenda compra/venda.
    const system =
      "Você é um COACH FINANCEIRO EDUCATIVO dentro de um app de controle de gastos chamado BudgetAI. O usuário é um jovem em Londres, moeda £. " +
      "Ajude a pessoa a entender o próprio dinheiro, criar hábitos melhores e APRENDER conceitos de finanças e investimento de forma geral e educativa. " +
      "REGRAS INEGOCIÁVEIS: " +
      "(1) EDUQUE e ORIENTE, mas NUNCA dê recomendação personalizada de compra ou venda de investimento específico. Nunca diga para comprar ou vender uma ação, fundo, cripto ou ativo específico, nem quanto investir em quê. " +
      "(2) PODE explicar conceitos gerais: reserva de emergência, diversificação, juros compostos, diferença entre poupar e investir, o que é um fundo de índice ou uma ISA de forma geral, por que vender no pânico prejudica. " +
      "(3) Para decisões de investimento específicas, oriente a pessoa a procurar um profissional certificado e regulado (no Reino Unido, autorizado pela FCA). " +
      "(4) Use os dados de gasto abaixo para dar orientação prática sobre hábitos e organização. " +
      "Tom amigável, direto, encorajador, sem jargão. Respostas curtas (2 a 5 frases), a não ser que peçam mais. Responda em " + langName + ". " +
      "PERFIL DA PESSOA: " + prof + " GASTOS REGISTRADOS: " + spending;

    const chat = [{ role: "system", content: system }].concat(
      messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      }))
    );

    const resp = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.NVIDIA_API_KEY, // mesma chave do cofre
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct", // mesmo modelo da categorização: rápido e confiável (evita estourar o tempo)
        messages: chat,
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    const data = await resp.json();
    const reply = (((data.choices || [])[0] || {}).message || {}).content || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply }),
    };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ reply: "", error: String(e) }) };
  }
};

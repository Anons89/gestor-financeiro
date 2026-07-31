// netlify/functions/categorize.js
// O "PORTEIRO": roda no servidor do Netlify, NÃO no celular.
// Ele é o único que conhece a chave (que vem do cofre: process.env.NVIDIA_API_KEY).
// O celular manda o texto pra cá, o porteiro fala com a NVIDIA e devolve só a resposta.

const CATS = ["Alimentação", "Transporte", "Mercado", "Lazer", "Contas", "Compras", "Saúde", "Outros"];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "method" }) };
  }
  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text) return { statusCode: 200, body: JSON.stringify({ ok: false }) };

    const prompt =
      'You categorize a spending entry. The message may be in Portuguese or British English. ' +
      'Reply ONLY with valid JSON, no markdown, no backticks. ' +
      'Exact format: {"amount": number, "category": string, "description": string}. ' +
      'The "category" must be EXACTLY one of: ' + CATS.join(", ") + '. ' +
      'Identify the merchant or item and pick the category from it, EVEN IF only a brand name is given (e.g. "Tesco 10" -> Mercado). Guide: ' +
      'Mercado (groceries/supermarket): Tesco, Sainsbury\'s, Asda, Aldi, Lidl, Morrisons, Waitrose, Iceland, Co-op, Ocado, M&S Food, Gopuff. ' +
      'Transporte (transport): Uber, Bolt, TfL, Oyster, train, Trainline, bus, tube, petrol, fuel, Lime. ' +
      'Alimentação (eating/food out): Pret, Greggs, McDonald\'s, KFC, Nando\'s, Burger King, Subway, Costa, Starbucks, Caffe Nero, Deliveroo, Just Eat, Domino\'s, Wagamama, restaurant, coffee, lunch, takeaway. ' +
      'Lazer (leisure/fun): Netflix, Spotify, Cineworld, Vue, Odeon, cinema, pub, bar, club, concert, gig, games, Steam, PlayStation, Xbox. ' +
      'Contas (bills): council tax, rent, electricity, water, internet, phone, Vodafone, EE, O2, Three, British Gas, Octopus, Sky, BT, Virgin Media. ' +
      'Compras (shopping): Amazon, Primark, ASOS, Zara, H&M, Next, Argos, Shein, eBay, John Lewis, clothes, shoes, trainers. ' +
      'Saúde (health): Boots, Superdrug, pharmacy, gym, PureGym, The Gym, dentist, doctor, medicine. ' +
      'Only use Outros if it truly fits nothing above. ' +
      'The "description" is a short label (e.g. "Tesco", "Uber", "Netflix"). ' +
      'Message: "' + text + '"';

    // Endpoint da NVIDIA (formato compatível com OpenAI).
    const resp = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.NVIDIA_API_KEY, // <- a chave vem do cofre
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct", // modelo pequeno e barato, ótimo pra categorizar
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    const data = await resp.json();
    const out = (((data.choices || [])[0] || {}).message || {}).content || "";

    let parsed = null;
    try { parsed = JSON.parse(out.replace(/```json|```/g, "").trim()); } catch (e) {}
    if (!parsed || typeof parsed.amount === "undefined") {
      return { statusCode: 200, body: JSON.stringify({ ok: false }) };
    }
    if (!CATS.includes(parsed.category)) parsed.category = "Outros";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, amount: parsed.amount, category: parsed.category, description: parsed.description || text }),
    };
  } catch (e) {
    // Qualquer erro: devolve ok:false pra o app cair no plano B (palavra-chave) sem quebrar.
    return { statusCode: 200, body: JSON.stringify({ ok: false, error: String(e) }) };
  }
};

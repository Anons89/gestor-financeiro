// ---- Cores das categorias (a CHAVE em português é o "id" interno; o texto exibido é traduzido) ----
// Paleta harmonizada: mesma "força" de cor em todas (nada grita mais que o resto),
// mas cada categoria mantém o matiz que a pessoa já conhece.
const CATEGORIES = {
  "Alimentação": "#F0705F", "Transporte": "#4CC38A", "Mercado": "#E4AE4E",
  "Lazer": "#B389E8", "Contas": "#59B3E8", "Compras": "#E87BAE",
  "Saúde": "#45C8B0", "Assinaturas": "#8B93E8", "Educação": "#6D87E0",
  "Viagem": "#4FC4DC", "Casa": "#E89B5A", "Beleza": "#DD8AE0",
  "Pets": "#9FCC5A", "Outros": "#93A0A8",
};

// ---- Ícones de interface (traço único, mesmo peso da barra de navegação) ----
const IC_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const ICONS = {
  pen: '<svg ' + IC_ATTRS + '><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z"/></svg>',
  x: '<svg ' + IC_ATTRS + '><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

// ---- IDIOMAS ----
const STR = {
  pt: {
    navHome: "Início", navStats: "Análise", navCoach: "AI", navSet: "Ajustes",
    planLabel: "Sua assinatura", planMonth: "mês", planTrial: "30 dias de teste grátis · acesso completo",
    planTrialEnds: "Teste grátis · termina em {d}", planRenews: "Assinatura ativa · renova em {d}",
    planCanceledUntil: "Cancelada · seu acesso vai até {date}", planCanceled: "Cancelada · você não será cobrado de novo",
    planEnded: "Assinatura encerrada", planPastDue: "Pagamento pendente · atualize seu cartão",
    day1: "1 dia", dayN: "{n} dias",
    prefLabel: "Preferências", langRowLabel: "Idioma", curRowLabel: "Moeda", accountLabel: "Conta",
    compareTitle: "Comparação mensal", statsEmpty: "Anote alguns gastos e seus gráficos aparecem aqui.",
    sub: 'Escreve do seu jeito, tipo "gastei 15 no uber". O app anota e organiza.',
    inputPh: "o que você gastou?", add: "Anotar", parsingTxt: "IA lendo...",
    totalLabel: "GASTO NO MÊS", fixedTitle: "FIXOS POR MÊS", fixedPh: "ex: academia 30 dia 15", addFixed: "+ Fixo",
    chipsTitle: "Atalhos rápidos", coachTitle: "AI", coachSub: "Tire dúvidas e aprenda a organizar melhor seu dinheiro.",
    insightsTitle: "Insights",
    insightTop: "Seu maior gasto é {cat}: {pc}% do mês.",
    insightLess: "Você gastou {v} a menos que no mês passado. 📉",
    insightMore: "Você gastou {v} a mais que no mês passado. 📈",
    insightCount: "Você anotou {n} gastos este mês. Consistência é tudo. 👏",
    themeRowLabel: "Tema", thAuto: "Auto", thLight: "Claro", thDark: "Escuro",
    receiptHead: "———— SEUS GASTOS ————",
    disclaimer: "Organiza e mostra pra onde vai o dinheiro. Não dá dica de investimento.",
    emptyExpenses: "Nada anotado ainda.<br>Toca num atalho aí em cima pra ver funcionar.",
    emptyFixed: 'Nenhum fixo ainda. Ex: "academia 30 dia 15".',
    perMonth: "/mês", remaining: "Falta sair esse mês:", allPaid: "Tudo pago esse mês ✅",
    biggest: "Maior peso:", heavy: "Tá pesando bastante, hein.", ok: "Sob controle por enquanto.",
    chartTitle: "Para onde vai seu dinheiro", chartBar: "Barras", chartPie: "Pizza",
    pickCat: "Escolha a categoria",
    dueDay: "cai dia", today: "Hoje", yesterday: "Ontem",
    weekdays: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    editChips: "editar", addChipPh: "novo atalho", okBtn: "ok",
    tabGastosLabel: "Gastos", tabCoachLabel: "Coach",
    profileTitle: "SEU PERFIL (opcional — ajuda o coach)", incomePh: "renda/mês £",
    riskQ: "risco?", riskLow: "risco baixo", riskMed: "risco médio", riskHigh: "risco alto",
    goalPh: "seu objetivo (ex: juntar pra uma viagem)",
    coachGreeting: "Oi! Sou seu coach financeiro. Ajudo você a entender pra onde vai seu dinheiro e explico conceitos — mas não digo o que comprar. Registra alguns gastos e me pergunta o que quiser. 👇",
    suggestions: ["Onde eu mais gasto?", "Como posso economizar?", "O que é reserva de emergência?", "O que fazer com o que sobra?"],
    coachPh: "pergunta pro seu coach...", send: "Enviar", thinkingTxt: "coach pensando...", coachErr: "Tive um problema pra pensar agora. Tenta de novo?",
    coachLimit: "Você fez muitas perguntas seguidas. Respira um pouquinho e me chama de novo em instantes. 🙂",
    chatClear: "Limpar conversa", chatClearConfirm: "Apagar toda a conversa com a AI? Isso não dá pra desfazer.",
    cmpThisMonth: "Esse mês:", cmpMore: "a mais que o mês passado", cmpLess: "a menos que o mês passado", cmpSame: "Igual ao mês passado.",
    share: "↗ Compartilhar", pdf: "PDF", shareTitle: "meus gastos", copied: "Copiado!",
    detectCur: "moeda daqui", localCur: "Moeda local",
    authTag: "Entra ou cria sua conta pra começar.", emailPh: "seu email", passPh: "sua senha",
    google: "Continuar com Google", apple: "Continuar com Apple", authOr: "ou",
    authTitleUp: "Criar conta", authTitleIn: "Entrar",
    haveAccount: "Já tem conta?", noAccount: "Não tem conta?", linkIn: "Entrar", linkUp: "Criar conta",
    googleUp: "Criar conta com Google", googleIn: "Entrar com Google",
    emailUp: "Criar conta com email", emailIn: "Entrar com email",
    legalPre: "Ao continuar, você aceita os", legalAnd: "e a",
    forgot: "Esqueci minha senha", typeEmailFirst: "Escreve seu email no campo acima primeiro, aí toca aqui.",
    resetSent: "Pronto! Mandei um link pro seu email pra você criar uma senha nova.",
    setNewPw: "Escolhe uma senha nova e salva.", saveNewPw: "Salvar nova senha",
    pwTooShort: "A senha precisa de pelo menos 6 caracteres.",
    login: "Entrar", signup: "Criar conta", logout: "Sair",
    authFillErr: "Preenche o email e a senha.", authLoading: "Só um segundo...",
    signupOk: "Conta criada! Confere seu email pra confirmar e depois entra.",
    badLogin: "Email ou senha errados.", genericErr: "Deu algum erro. Tenta de novo.",
    saveErr: "Não consegui salvar agora. Confere sua conexão e tenta de novo.",
    subscribe: "✦ Assinar — £2,99/mês", subLoading: "Abrindo pagamento...",
    subErr: "Não consegui abrir o pagamento agora. Tenta de novo?",
    subThanks: "Assinatura iniciada! Seus 30 dias grátis começaram. 🎉",
    payStart: "Comece seus 30 dias grátis", payStartSub: "Use o Algent completo por 30 dias, de graça. Só depois vem a cobrança de £2,99/mês, e você cancela quando quiser.",
    payEnded: "Seu teste acabou", payEndedSub: "Assine pra continuar usando o Algent — £2,99/mês.",
    payBtnTxt: "Começar teste grátis",
    cancelSub: "Cancelar assinatura", cancelBusy: "Cancelando...",
    cancelConfirm: "Tem certeza que quer cancelar? Você mantém o acesso até o fim do período que já pagou (ou do seu teste grátis), e não será cobrado de novo.",
    cancelDone: "Assinatura cancelada. Você continua com acesso até {date} e não será cobrado de novo.",
    cancelDoneNoDate: "Pronto, sua assinatura foi cancelada. Você não será cobrado de novo.",
    cancelNothing: "Não encontrei uma assinatura ativa pra cancelar por aqui.",
    reactivate: "Reativar plano", reactivateBusy: "Reativando...",
    reactivateDone: "Pronto! Sua assinatura volta a valer normalmente. Nada mudou no seu acesso.",
    reactivateNothing: "Não encontrei uma assinatura cancelada pra reativar por aqui.",
    reactivateErr: "Não consegui reativar agora. Tenta de novo daqui a pouco?",
    cancelErr: "Não consegui cancelar agora. Tenta de novo daqui a pouco?",
    legalPrivacy: "Privacidade", legalTerms: "Termos",
    aDel: "Apagar", aPaid: "Pago este mês", aCur: "Trocar moeda",
    cats: { "Alimentação": "🍔 Alimentação", "Transporte": "🚗 Transporte", "Mercado": "🛒 Mercado", "Lazer": "🎉 Lazer", "Contas": "🧾 Contas", "Compras": "🛍️ Compras", "Saúde": "🩺 Saúde", "Assinaturas": "📺 Assinaturas", "Educação": "📚 Educação", "Viagem": "✈️ Viagem", "Casa": "🏠 Casa", "Beleza": "💅 Beleza", "Pets": "🐾 Pets", "Outros": "📦 Outros" },
  },
  en: {
    navHome: "Home", navStats: "Analysis", navCoach: "AI", navSet: "Settings",
    planLabel: "Your subscription", planMonth: "month", planTrial: "30-day free trial · full access",
    planTrialEnds: "Free trial · ends in {d}", planRenews: "Subscription active · renews in {d}",
    planCanceledUntil: "Cancelled · your access runs until {date}", planCanceled: "Cancelled · you won't be charged again",
    planEnded: "Subscription ended", planPastDue: "Payment pending · please update your card",
    day1: "1 day", dayN: "{n} days",
    prefLabel: "Preferences", langRowLabel: "Language", curRowLabel: "Currency", accountLabel: "Account",
    compareTitle: "Monthly comparison", statsEmpty: "Log a few expenses and your charts show up here.",
    sub: 'Just type it, like "spent 15 on uber". The app logs and sorts it.',
    inputPh: "what did you spend on?", add: "Add", parsingTxt: "AI reading...",
    totalLabel: "SPENT THIS MONTH", fixedTitle: "MONTHLY FIXED", fixedPh: "e.g. gym 30 day 15", addFixed: "+ Fixed",
    chipsTitle: "Quick shortcuts", coachTitle: "AI", coachSub: "Ask questions and learn to organise your money better.",
    insightsTitle: "Insights",
    insightTop: "Your biggest expense is {cat}: {pc}% of the month.",
    insightLess: "You spent {v} less than last month. 📉",
    insightMore: "You spent {v} more than last month. 📈",
    insightCount: "You logged {n} expenses this month. Consistency is everything. 👏",
    themeRowLabel: "Theme", thAuto: "Auto", thLight: "Light", thDark: "Dark",
    receiptHead: "———— YOUR SPENDING ————",
    disclaimer: "Organises and shows where your money goes. Not investment advice.",
    emptyExpenses: "Nothing logged yet.<br>Tap a shortcut above to see how it works.",
    emptyFixed: 'No fixed costs yet. E.g. "gym 30 day 15".',
    perMonth: "/mth", remaining: "Left to pay this month:", allPaid: "All paid this month ✅",
    biggest: "Biggest chunk:", heavy: "That's weighing a lot.", ok: "Under control for now.",
    chartTitle: "Where your money goes", chartBar: "Bars", chartPie: "Pie",
    pickCat: "Pick the category",
    dueDay: "due day", today: "Today", yesterday: "Yesterday",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    editChips: "edit", addChipPh: "new shortcut", okBtn: "done",
    tabGastosLabel: "Spending", tabCoachLabel: "Coach",
    profileTitle: "YOUR PROFILE (optional — helps the coach)", incomePh: "income/mo £",
    riskQ: "risk?", riskLow: "low risk", riskMed: "medium risk", riskHigh: "high risk",
    goalPh: "your goal (e.g. save for a trip)",
    coachGreeting: "Hello! I'm your money coach. I help you understand where your money goes and explain concepts — but I won't tell you what to buy. Log some spending and ask me anything. 👇",
    suggestions: ["Where do I spend most?", "How can I save?", "What is an emergency fund?", "What to do with leftover money?"],
    coachPh: "ask your coach...", send: "Send", thinkingTxt: "coach thinking...", coachErr: "I had a problem thinking. Try again?",
    coachLimit: "That's a lot of questions in a row. Give it a moment and ask me again. 🙂",
    chatClear: "Clear chat", chatClearConfirm: "Delete the whole conversation with the AI? This can't be undone.",
    cmpThisMonth: "This month:", cmpMore: "more than last month", cmpLess: "less than last month", cmpSame: "Same as last month.",
    share: "↗ Share", pdf: "PDF", shareTitle: "my spending", copied: "Copied!",
    detectCur: "currency here", localCur: "Local currency",
    authTag: "Sign in or create your account to start.", emailPh: "your email", passPh: "your password",
    google: "Continue with Google", apple: "Continue with Apple", authOr: "or",
    authTitleUp: "Sign up", authTitleIn: "Sign in",
    haveAccount: "Already have an account?", noAccount: "Don't have an account?", linkIn: "Sign in", linkUp: "Sign up",
    googleUp: "Sign up with Google", googleIn: "Sign in with Google",
    emailUp: "Sign up with email", emailIn: "Sign in with email",
    legalPre: "By continuing, you accept the", legalAnd: "and the",
    forgot: "Forgotten your password?", typeEmailFirst: "Pop your email in the box above first, then tap here.",
    resetSent: "Done — I've sent a link to your email so you can set a new password.",
    setNewPw: "Choose a new password and save.", saveNewPw: "Save new password",
    pwTooShort: "Your password needs at least 6 characters.",
    login: "Sign in", signup: "Create account", logout: "Log out",
    authFillErr: "Please fill in your email and password.", authLoading: "One moment...",
    signupOk: "Account created! Check your email to confirm, then sign in.",
    badLogin: "Wrong email or password.", genericErr: "Something went wrong. Try again.",
    saveErr: "Couldn't save right now. Check your connection and try again.",
    subscribe: "✦ Subscribe — £2.99 a month", subLoading: "Opening payment...",
    subErr: "Couldn't open payment right now. Try again?",
    subThanks: "Subscription started! Your 30 free days have begun. 🎉",
    payStart: "Start your 30 free days", payStartSub: "Use the full Algent free for 30 days. Only then does the £2.99/mo charge begin, and you can cancel anytime.",
    payEnded: "Your trial has ended", payEndedSub: "Subscribe to keep using Algent — £2.99/mo.",
    payBtnTxt: "Start free trial",
    cancelSub: "Cancel subscription", cancelBusy: "Cancelling...",
    cancelConfirm: "Are you sure you want to cancel? You keep access until the end of the period you've already paid for (or your free trial), and you won't be charged again.",
    cancelDone: "Subscription cancelled. You keep access until {date}, and you won't be charged again.",
    cancelDoneNoDate: "Done — your subscription has been cancelled. You won't be charged again.",
    cancelNothing: "I couldn't find an active subscription to cancel here.",
    reactivate: "Reactivate plan", reactivateBusy: "Reactivating...",
    reactivateDone: "Done — your subscription is back to normal. Nothing changed about your access.",
    reactivateNothing: "I couldn't find a cancelled subscription to reactivate here.",
    reactivateErr: "Couldn't reactivate right now. Try again in a moment?",
    cancelErr: "I couldn't cancel right now. Try again in a moment?",
    legalPrivacy: "Privacy", legalTerms: "Terms",
    aDel: "Delete", aPaid: "Paid this month", aCur: "Change currency",
    cats: { "Alimentação": "🍔 Food", "Transporte": "🚗 Transport", "Mercado": "🛒 Groceries", "Lazer": "🎉 Leisure", "Contas": "🧾 Bills", "Compras": "🛍️ Shopping", "Saúde": "🩺 Health", "Assinaturas": "📺 Subscriptions", "Educação": "📚 Education", "Viagem": "✈️ Travel", "Casa": "🏠 Home", "Beleza": "💅 Beauty", "Pets": "🐾 Pets", "Outros": "📦 Other" },
  },
};

function detectLang() {
  try { const saved = localStorage.getItem("lang"); if (saved === "pt" || saved === "en") return saved; } catch (e) {}
  return (navigator.language || "en").toLowerCase().startsWith("pt") ? "pt" : "en";
}
let lang = detectLang();
const t = k => STR[lang][k];
const catLabel = c => STR[lang].cats[c] || c;
// Avisa o navegador/leitor de tela qual idioma a página está falando
function applyHtmlLang() { document.documentElement.lang = lang === "pt" ? "pt-BR" : "en-GB"; }
applyHtmlLang();

// ---- PLANO B do cérebro: palavra-chave (usado só se o porteiro/IA falhar) ----
// ---- Entende "quando" foi o gasto ----
// A pessoa esqueceu de anotar e escreve "Tesco 20 dia 2" ou "uber 8 ontem".
// Aqui tiramos a parte da data do texto (pra ela não virar o VALOR por engano)
// e devolvemos a data certa. O resto do texto segue normal pra IA/categorização.
//
// Regra do mês: se o dia escrito ainda não chegou neste mês (hoje é 2 e a pessoa
// escreveu "dia 28"), o gasto é do mês PASSADO — ninguém anota algo do futuro.
function extractDate(text) {
  const original = String(text || "");
  let s = original;
  const limpar = (x) => x.replace(/\s{2,}/g, " ").trim();
  // Meio-dia: encosta longe da virada do dia, então fuso/horário de verão não empurra pro dia errado
  const meioDia = (d) => { d.setHours(12, 0, 0, 0); return d; };

  // "ontem" / "yesterday"
  if (/\b(ontem|yesterday)\b/i.test(s)) {
    s = s.replace(/\b(ontem|yesterday)\b/gi, " ");
    const d = new Date(); d.setDate(d.getDate() - 1);
    return { date: meioDia(d), cleaned: limpar(s) || original };
  }
  // "anteontem"
  if (/\b(anteontem|antes de ontem)\b/i.test(s)) {
    s = s.replace(/\b(anteontem|antes de ontem)\b/gi, " ");
    const d = new Date(); d.setDate(d.getDate() - 2);
    return { date: meioDia(d), cleaned: limpar(s) || original };
  }

  let dia = null, mes = null;
  // "dia 2/8" ou "day 2/8" (dia/mês)
  let m = s.match(/\b(?:dia|day)\s*(\d{1,2})\s*[\/\-]\s*(\d{1,2})\b/i);
  if (m) { dia = +m[1]; mes = +m[2]; s = s.replace(m[0], " "); }
  else {
    // "dia 2" ou "day 2"
    m = s.match(/\b(?:dia|day)\s*(\d{1,2})\b/i);
    if (m) { dia = +m[1]; s = s.replace(m[0], " "); }
  }
  if (!dia || dia < 1 || dia > 31) return { date: null, cleaned: original };

  const agora = new Date();
  let ano = agora.getFullYear();
  let mesIdx = (mes ? mes - 1 : agora.getMonth());
  if (mes && (mes < 1 || mes > 12)) return { date: null, cleaned: original };

  if (!mes && dia > agora.getDate()) mesIdx -= 1;      // dia que ainda não chegou = mês passado
  if (mesIdx < 0) { mesIdx = 11; ano -= 1; }
  const d = new Date(ano, mesIdx, dia);
  // Dia que não existe no mês (ex: 31 de fevereiro) — o JS viraria pro mês seguinte
  if (d.getMonth() !== mesIdx || d.getDate() !== dia) return { date: null, cleaned: original };
  if (mes && d.getTime() > agora.getTime()) d.setFullYear(ano - 1); // mês/dia no futuro = ano passado

  return { date: meioDia(d), cleaned: limpar(s) || original };
}

function parseLocal(text) {
  const match = text.match(/(\d+(?:[.,]\d{1,2})?)/);
  const amount = match ? parseFloat(match[1].replace(",", ".")) : 0;
  const s = text.toLowerCase();
  let category = "Outros";
  if (/uber|bolt|99|taxi|[oô]nibus|bus|metr[oô]|tube|trem|train|trainline|tfl|oyster|lime|gasolina|petrol|fuel|transporte|transport|passagem|ride/.test(s)) category = "Transporte";
  else if (/mercado|supermerc|feira|hortifruti|groceries|grocery|supermarket|gopuff|tesco|sainsbury|asda|aldi|lidl|morrison|waitrose|iceland|ocado|co-?op|m&s|marks & spencer/.test(s)) category = "Mercado";
  else if (/comida|food|almo[cç]|lunch|jant|dinner|breakfast|lanch|snack|ifood|restaurante|restaurant|caf[eé]|coffee|pizza|burger|padaria|hamb|meal|takeaway|pret|greggs|mcdonald|kfc|nando|subway|costa|starbucks|nero|deliveroo|just *eat|domino|wagamama|five guys/.test(s)) category = "Alimentação";
  else if (/cinema|movie|jogo|game|bar|pub|balada|club|netflix|spotify|lazer|leisure|show|concert|gig|role|rol[eê]|golfe|golf|boliche|bowling|paintball|sinuca|kart|parque|cineworld|vue|odeon|steam|playstation|xbox|nintendo|disney/.test(s)) category = "Lazer";
  else if (/conta|bill|luz|electricity|[aá]gua|water|aluguel|rent|internet|telefone|phone|celular|fatura|vodafone|giffgaff|british gas|octopus|council tax|virgin media|now tv|thames water/.test(s)) category = "Contas";
  else if (/roupa|clothes|t[eê]nis|compra|shopping|amazon|loja|shop|shein|primark|asos|zara|h&m|argos|ebay|john lewis|trainers/.test(s)) category = "Compras";
  else if (/farm[aá]cia|pharmacy|rem[eé]dio|medicine|m[eé]dico|doctor|academia|gym|dentista|dentist|boots|superdrug|puregym|pure gym|nuffield/.test(s)) category = "Saúde";
  let desc = s
    .replace(/\b(gastei|paguei|comprei|gasto|spent|paid|bought)\b/g, "")
    .replace(/\d+(?:[.,]\d+)?/g, "").replace(/£|€|\$|r\$|reais|libras?|pounds?|euros?|d[oó]lares?|dollars?/gi, "")
    .replace(/\b(no|na|nos|nas|de|do|da|em|com|pra|para|o|a|um|uma|on|at|for|the|of|to|with|an)\b/g, "")
    .replace(/\s+/g, " ").trim();
  if (!desc) desc = catLabel(category);
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  return { amount, category, description: desc };
}

// Pega o token da sessão (a "prova de quem sou eu") pra mandar junto nas chamadas de IA.
// O servidor confere esse token antes de gastar a chave da NVIDIA.
async function getToken() {
  if (!sbClient) return "";
  try {
    const { data } = await sbClient.auth.getSession();
    return (data && data.session && data.session.access_token) || "";
  } catch (e) { return ""; }
}

// ---- O CÉREBRO DE VERDADE: chama o porteiro (Netlify Function -> NVIDIA). Se falhar, usa o plano B. ----
async function parse(text) {
  try {
    const res = await fetch("/.netlify/functions/categorize", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, accessToken: await getToken() }),
    });
    const data = await res.json();
    if (data && data.ok && typeof data.amount !== "undefined") {
      const cat = CATEGORIES[data.category] ? data.category : "Outros";
      return { amount: Number(data.amount) || 0, category: cat, description: (data.description || text) };
    }
  } catch (e) {}
  return parseLocal(text);
}

// ---- MEMÓRIA ----
function load() { try { return JSON.parse(localStorage.getItem("expenses") || "[]"); } catch (e) { return []; } }
function save() { localStorage.setItem("expenses", JSON.stringify(expenses)); }
let expenses = load();

function loadFixed() { try { return JSON.parse(localStorage.getItem("recurring") || "[]"); } catch (e) { return []; } }
function saveFixed() { localStorage.setItem("recurring", JSON.stringify(recurring)); queueSettingsSave(); }
let recurring = loadFixed();

// Atalhos editáveis (o usuário cria os próprios gastos frequentes)
const MAX_CHIPS = 3;
const DEFAULT_CHIPS = ["Café £3.20", "Meal Deal £3.85", "Bus £1.75"];
function loadChips() { try { const r = localStorage.getItem("quickchips_v3"); return (r ? JSON.parse(r) : DEFAULT_CHIPS.slice()).slice(0, MAX_CHIPS); } catch (e) { return DEFAULT_CHIPS.slice(); } }
function saveChips() { localStorage.setItem("quickchips_v3", JSON.stringify(quickChips)); queueSettingsSave(); }
let quickChips = loadChips();
let editingChips = false;

// ---- Coach: perfil + conversa (memória) ----
function loadProfile() { try { return JSON.parse(localStorage.getItem("coach_profile") || "{}"); } catch (e) { return {}; } }
function saveProfile() { localStorage.setItem("coach_profile", JSON.stringify(coachProfile)); queueSettingsSave(); }
let coachProfile = loadProfile();
function loadCoachMsgs() { try { const r = localStorage.getItem("coach_msgs"); if (r) return JSON.parse(r); } catch (e) {} return [{ role: "bot", content: STR[lang].coachGreeting }]; }
function saveCoachMsgs() { localStorage.setItem("coach_msgs", JSON.stringify(coachMessages)); }
let coachMessages = loadCoachMsgs();
let coachThinking = false;

// ---- Categorias que a pessoa ensinou (a IA aprende e reusa) ----
function loadLearned() { try { return JSON.parse(localStorage.getItem("learned_cats") || "{}"); } catch (e) { return {}; } }
function saveLearned() { try { localStorage.setItem("learned_cats", JSON.stringify(learnedCats)); } catch (e) {} queueSettingsSave(); }
let learnedCats = loadLearned();
// "normaliza" um texto pra virar chave (minúsculo, sem pontuação/moeda)
function catKey(s) { return (s || "").toLowerCase().trim().replace(/[£$€.,!?]/g, "").replace(/\s+/g, " ").trim(); }
// Se a pessoa já ensinou a categoria dessa palavra/descrição, devolve ela
function learnedCategoryFor(text, desc) {
  if (!learnedCats) return null;
  const dk = catKey(desc);
  if (dk && learnedCats[dk] && CATEGORIES[learnedCats[dk]]) return learnedCats[dk];
  const words = catKey(text).split(" ").filter(w => w.length >= 3);
  for (const w of words) { if (learnedCats[w] && CATEGORIES[learnedCats[w]]) return learnedCats[w]; }
  return null;
}

// ---- Ações: gastos do dia ----
async function addExpense(msg, curOverride) {
  const text = (msg !== undefined ? msg : input.value).trim();
  if (!text) return;
  const btn = document.getElementById("addBtn");
  btn.disabled = true; btn.textContent = t("parsingTxt");
  // Tira a data do texto ANTES de ler o valor — senão "Tesco 20 dia 2" corre o
  // risco de virar um gasto de 2, e a IA ainda gastaria token lendo "dia 2".
  const quando = extractDate(text);
  const parsed = await parse(quando.cleaned);
  // Se a pessoa já ensinou a categoria dessa palavra, a IA respeita a escolha dela
  const learned = learnedCategoryFor(quando.cleaned, parsed.description);
  if (learned) parsed.category = learned;
  const obj = {
    date: (quando.date || new Date()).toISOString(),
    cur: curOverride || curCurrency,
    ...parsed,
  };
  if (sbClient) {
    // salva na nuvem, na conta da pessoa, e usa a linha que o banco devolve (com o id de verdade)
    const saved = await cloudInsertExpense(obj);
    if (!saved) {
      btn.disabled = false; btn.textContent = t("add");
      alert(t("saveErr"));
      return;
    }
    expenses.unshift(saved); save();
  } else {
    // sem nuvem disponível: mantém o jeito antigo, salvando no aparelho
    expenses.unshift({ id: Date.now(), ...obj }); save();
  }
  input.value = "";
  btn.disabled = false; btn.textContent = t("add");
  render();
  // o gasto recém-anotado entra deslizando (só ele, não a lista inteira)
  const first = document.querySelector("#list .item");
  if (first) first.classList.add("just-added");
}
async function removeExpense(id) {
  if (sbClient) { await cloudDeleteExpense(id); }
  // compara como texto: funciona tanto com id numérico quanto com id tipo UUID
  expenses = expenses.filter(e => String(e.id) !== String(id)); save(); render();
}
// Atualiza a categoria de um gasto na nuvem
async function cloudUpdateExpenseCategory(id, cat) {
  if (!sbClient) return;
  try { await sbClient.from("expenses").update({ category: cat }).eq("id", id); } catch (e) {}
}
// A pessoa escolheu outra categoria: troca no gasto E ensina a IA pra próxima vez
async function changeCategory(id, cat) {
  const e = expenses.find(x => String(x.id) === String(id));
  if (!e || !CATEGORIES[cat]) return;
  e.category = cat;
  const k = catKey(e.description);
  if (k) learnedCats[k] = cat;                 // ensina pela descrição inteira
  const w = k.split(" ").filter(x => x.length >= 3)[0];
  if (w) learnedCats[w] = cat;                 // e pela palavra principal
  saveLearned();
  save();
  if (sbClient) { await cloudUpdateExpenseCategory(id, cat); }
  closeCatPicker();
  render();
}
// Abre o modal com as 8 categorias pra pessoa escolher
let catPickerTarget = null;
function openCatPicker(id) {
  catPickerTarget = id;
  const list = document.getElementById("catPickerList");
  if (list) {
    list.innerHTML = Object.keys(CATEGORIES).map(c =>
      '<button class="cat-opt" data-act="cat-pick" data-id="' + esc(String(id)) + '" data-cat="' + esc(c) + '">' +
        '<span class="dot" style="background:' + CATEGORIES[c] + '"></span>' + catLabel(c) +
      '</button>'
    ).join("");
  }
  const ti = document.getElementById("catPickerTitle"); if (ti) ti.textContent = t("pickCat");
  const p = document.getElementById("catPicker"); if (p) p.classList.remove("hidden");
  // move o foco pra dentro do modal (quem usa teclado/leitor de tela não se perde)
  if (list) { const first = list.querySelector("button"); if (first) first.focus(); }
}
function closeCatPicker() {
  catPickerTarget = null;
  const p = document.getElementById("catPicker"); if (p) p.classList.add("hidden");
}

// ---- Ações: atalhos ----
// Descobre a moeda escrita no texto do atalho (ex: "Café £3.20" -> GBP).
// A ordem importa: "R$"/"A$"/"C$" antes de "$", "CN¥" antes de "¥".
function curFromText(s) {
  if (/R\$/.test(s)) return "BRL";
  if (/A\$/.test(s)) return "AUD";
  if (/C\$/.test(s)) return "CAD";
  if (/CN¥/.test(s)) return "CNY";
  if (/£/.test(s)) return "GBP";
  if (/€/.test(s)) return "EUR";
  if (/CHF/i.test(s)) return "CHF";
  if (/¥/.test(s)) return "JPY";
  if (/\$/.test(s)) return "USD";
  return null;
}
// O atalho registra na moeda que está ESCRITA nele (não na que você está vendo agora)
function quickAdd(i) { const c = quickChips[i]; addExpense(c, curFromText(c) || undefined); }
function removeChip(i) { quickChips.splice(i, 1); saveChips(); renderChips(); }
function addChipFromInput() {
  if (quickChips.length >= MAX_CHIPS) return;
  const el = document.getElementById("chipInput");
  const v = el ? el.value.trim() : "";
  if (!v) return;
  quickChips.push(formatChip(v)); saveChips(); renderChips(); // "academia 5" -> "Academia £5"
  const el2 = document.getElementById("chipInput"); if (el2) el2.focus();
}
// Deixa o atalho bonito: 1ª letra maiúscula em cada palavra + moeda na frente do valor.
function formatChip(raw) {
  const m = raw.match(/(\d+(?:[.,]\d{1,2})?)/);
  const amount = m ? parseFloat(m[1].replace(",", ".")) : 0;
  let name = raw
    .replace(/\b(gastei|paguei|comprei|gasto|spent|paid|bought)\b/gi, "")
    .replace(/\d+(?:[.,]\d+)?/g, "")
    .replace(/£|€|\$|r\$|reais|libras?|pounds?|euros?|d[oó]lares?|dollars?/gi, "")
    .replace(/\s+/g, " ").trim();
  if (!name) name = "Item";
  name = name.split(" ").map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(" ");
  // usa a moeda que a pessoa está vendo AGORA — é nessa que o atalho vai registrar
  const sym = CURRENCIES[curCurrency] || "£";
  const amtStr = (amount % 1 === 0) ? String(amount) : amount.toFixed(2);
  return name + " " + sym + amtStr;
}
function toggleEditChips() { editingChips = !editingChips; renderChips(); }

// ---- Ações: fixos mensais ----
function parseFixed(text) {
  let s = text; let dueDay = null;
  const dm = s.match(/(?:dia|day)\s*(\d{1,2})/i);
  if (dm) { const d = parseInt(dm[1], 10); if (d >= 1 && d <= 31) dueDay = d; s = s.replace(dm[0], ""); }
  const m = s.match(/(\d+(?:[.,]\d{1,2})?)/);
  const amount = m ? parseFloat(m[1].replace(",", ".")) : 0;
  let name = s.replace(/\d+(?:[.,]\d+)?/g, "").replace(/£|r\$|reais|libras?|pounds?/gi, "").replace(/\s+/g, " ").trim();
  if (!name) name = "Fixo";
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return { name, amount, dueDay };
}
function addFixed() {
  const text = fixedInput.value.trim(); if (!text) return;
  recurring.unshift({ id: Date.now(), ...parseFixed(text) });
  saveFixed(); fixedInput.value = ""; renderFixed();
}
function removeFixed(id) { recurring = recurring.filter(x => String(x.id) !== String(id)); saveFixed(); renderFixed(); }
function monthKey() { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1); }
function isPaid(f) { return f.paidMonth === monthKey(); }
function togglePaid(id) {
  const f = recurring.find(x => String(x.id) === String(id)); if (!f) return;
  f.paidMonth = isPaid(f) ? null : monthKey();
  saveFixed(); renderFixed();
}

// ---- Utilidades ----
// ---- Moedas ----
const CURRENCIES = { GBP: "£", EUR: "€", USD: "$", BRL: "R$", JPY: "¥", AUD: "A$", CAD: "C$", CHF: "CHF", CNY: "CN¥" };
const FLAGS = { GBP: "🇬🇧", EUR: "🇪🇺", USD: "🇺🇸", BRL: "🇧🇷", JPY: "🇯🇵", AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳" };
const CUR_ORDER = ["GBP", "EUR", "USD", "BRL", "JPY", "AUD", "CAD", "CHF", "CNY"];
let curMenuOpen = false;
function loadCur(key, def) { try { const r = localStorage.getItem(key); return (r && CURRENCIES[r]) ? r : def; } catch (e) { return def; } }
let homeCurrency = loadCur("home_currency", "GBP");   // moeda de casa (fixos) — travada
let curCurrency = loadCur("cur_currency", homeCurrency); // moeda que você está vendo/registrando agora
const money = (n, cur) => (CURRENCIES[cur || curCurrency] || "£") + (Number(n) || 0).toFixed(2);
const expCur = e => e.cur || homeCurrency; // gastos antigos sem moeda = moeda de casa
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ts = e => e.date ? new Date(e.date).getTime() : e.id;
const dayKey = tv => { const d = new Date(tv); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
function dayLabel(tv) {
  const d = new Date(tv), now = new Date(); const yest = new Date(); yest.setDate(now.getDate() - 1);
  if (dayKey(tv) === dayKey(now)) return t("today");
  if (dayKey(tv) === dayKey(yest)) return t("yesterday");
  const dd = String(d.getDate()).padStart(2, "0"), mm = String(d.getMonth() + 1).padStart(2, "0");
  return t("weekdays")[d.getDay()] + ", " + dd + "/" + mm;
}

// ---- Referências ----
const input = document.getElementById("input");
const listEl = document.getElementById("list");
const totalEl = document.getElementById("total");
const noteEl = document.getElementById("note");
const fixedInput = document.getElementById("fixedInput");
const fixedListEl = document.getElementById("fixedList");
const fixedTotalEl = document.getElementById("fixedTotal");
const fixedSubEl = document.getElementById("fixedSub");

// ---- Atalhos (editáveis) ----
function renderChips() {
  const box = document.getElementById("chips");
  if (!editingChips) {
    box.innerHTML =
      quickChips.map((c, i) => '<button class="chip" data-act="chip-add" data-i="' + i + '">' + esc(c) + '</button>').join("") +
      '<button class="chip" style="border-style:dashed" data-act="chips-edit">' + ICONS.pen + ' ' + t("editChips") + '</button>';
  } else {
    const canAdd = quickChips.length < MAX_CHIPS;
    box.innerHTML =
      quickChips.map((c, i) => '<span class="chip chip-editing">' + esc(c) + '<button class="chip-x" aria-label="' + t("aDel") + ': ' + esc(c) + '" data-act="chip-del" data-i="' + i + '">' + ICONS.x + '</button></span>').join("") +
      (canAdd
        ? '<input id="chipInput" class="chip-input" placeholder="' + t("addChipPh") + '" />' +
          '<button class="chip" style="background:var(--btn-bg);color:var(--btn-ink);border:none" data-act="chip-ok">' + t("okBtn") + '</button>'
        : "") +
      '<button class="chip" data-act="chips-edit">' + ICONS.x + '</button>';
  }
}

// ---- Estado da assinatura, LEMBRADO ----
// Antes o texto do card era escrito uma vez e pronto. Só que applyStaticTexts()
// reescreve os textos fixos da tela — e ele roda DEPOIS, quando a sincronização
// com a nuvem termina e quando a pessoa troca de idioma. Resultado: o texto
// calculado ("Cancelada · acesso até X") era apagado e voltava o padrão
// "30 dias de teste grátis", como se a pessoa não tivesse cancelado.
// Guardando o estado aqui, a tela pode ser redesenhada quantas vezes for preciso
// sem perder a verdade e sem consultar o banco de novo.
let subState = { status: null, end: null, cancelAtEnd: false };

function applyStaticTexts() {
  input.setAttribute("placeholder", t("inputPh"));
  // aria-label: o placeholder some quando a pessoa digita; o rótulo de acessibilidade não
  input.setAttribute("aria-label", t("inputPh"));
  fixedInput.setAttribute("aria-label", t("fixedPh"));
  document.getElementById("coachInput").setAttribute("aria-label", t("coachPh"));
  document.getElementById("pIncome").setAttribute("aria-label", t("incomePh"));
  document.getElementById("pGoal").setAttribute("aria-label", t("goalPh"));
  document.getElementById("pRisk").setAttribute("aria-label", t("riskQ"));
  document.getElementById("langBtn").setAttribute("aria-label", t("langRowLabel"));
  document.getElementById("addBtn").textContent = t("add");
  document.getElementById("totalLabel").textContent = t("totalLabel");
  document.getElementById("fixedTitleEl").textContent = t("fixedTitle");
  fixedInput.setAttribute("placeholder", t("fixedPh"));
  document.getElementById("fixedBtn").textContent = t("addFixed");
  document.getElementById("receiptHead").textContent = t("receiptHead");
  document.getElementById("disclaimer").textContent = t("disclaimer");
  document.getElementById("langBtn").textContent = lang === "pt" ? "EN" : "PT";
  document.getElementById("profileTitle").textContent = t("profileTitle");
  document.getElementById("pIncome").setAttribute("placeholder", t("incomePh"));
  document.getElementById("pGoal").setAttribute("placeholder", t("goalPh"));
  document.getElementById("coachInput").setAttribute("placeholder", t("coachPh"));
  document.getElementById("coachSend").textContent = t("send");
  document.getElementById("shareBtn").textContent = t("share");
  document.getElementById("pdfBtn").textContent = t("pdf");
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setTxt("navHome", t("navHome")); setTxt("navStats", t("navStats")); setTxt("navCoach", t("navCoach")); setTxt("navSet", t("navSet"));
  setTxt("planLabel", t("planLabel")); setTxt("planMonth", t("planMonth"));
  // planTrial NÃO é escrito aqui de propósito: o texto dele depende do estado
  // da assinatura. Redesenhamos a partir do estado lembrado — senão esta função
  // apagaria "Cancelada · acesso até X" toda vez que rodasse.
  renderSubscriptionUI();
  setTxt("prefLabel", t("prefLabel")); setTxt("langRowLabel", t("langRowLabel")); setTxt("curRowLabel", t("curRowLabel")); setTxt("accountLabel", t("accountLabel"));
  setTxt("compareTitle", t("compareTitle")); setTxt("statsEmpty", t("statsEmpty"));
  setTxt("chipsTitle", t("chipsTitle"));
  setTxt("coachTitleEl", t("coachTitle")); setTxt("coachSubEl", t("coachSub")); setTxt("coachDisclaim", t("disclaimer"));
  setTxt("chatClearLbl", t("chatClear"));
  const _cc = document.getElementById("chatClearBtn"); if (_cc) _cc.setAttribute("aria-label", t("chatClear"));
  setTxt("insightsTitle", t("insightsTitle"));
  setTxt("themeRowLabel", t("themeRowLabel")); setTxt("thAuto", t("thAuto")); setTxt("thLight", t("thLight")); setTxt("thDark", t("thDark"));
  document.getElementById("pRisk").innerHTML =
    '<option value="">' + t("riskQ") + '</option>' +
    '<option value="baixo">' + t("riskLow") + '</option>' +
    '<option value="médio">' + t("riskMed") + '</option>' +
    '<option value="alto">' + t("riskHigh") + '</option>';
  document.getElementById("pRisk").value = coachProfile.risk || "";
  document.getElementById("pIncome").value = coachProfile.income || "";
  document.getElementById("pGoal").value = coachProfile.goal || "";
  renderChips();
  if (coachMessages.length === 1 && coachMessages[0].role === "bot") coachMessages[0].content = t("coachGreeting");
  renderSuggestions();
  renderChat();
}

// ---- Desenha os gastos do dia ----
function isThisMonth(e) {
  const d = new Date(ts(e)), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
}
// O emoji e o nome vêm do rótulo da categoria ("🍔 Alimentação").
// Uma categoria desconhecida (vinda da nuvem, editada à mão) volta como texto
// cru — então String() aqui e esc() na hora de desenhar; nunca vai crua pro HTML.
function catEmoji(cat) { const l = String(catLabel(cat)); const i = l.indexOf(" "); return i > 0 ? l.slice(0, i) : "📦"; }
function catName(cat) { const l = String(catLabel(cat)); const i = l.indexOf(" "); return i > 0 ? l.slice(i + 1) : l; }
function render() {
  const exp = expenses.filter(e => expCur(e) === curCurrency);
  const monthExp = exp.filter(isThisMonth);
  const total = monthExp.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  totalEl.textContent = money(total);

  const byCat = {};
  monthExp.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + (Number(e.amount) || 0); });
  const biggest = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  if (biggest) {
    const heavy = biggest[1] > total * 0.4 ? t("heavy") : t("ok");
    noteEl.innerHTML = t("biggest") + " <b>" + esc(catLabel(biggest[0])) + "</b> (" + esc(money(biggest[1])) + "). " + heavy;
  } else { noteEl.textContent = ""; }
  renderCurrencyBar();
  renderCompare();
  renderChart();

  if (exp.length === 0) { listEl.innerHTML = '<div class="empty">' + t("emptyExpenses") + '</div>'; return; }

  const groups = [];
  exp.forEach(e => {
    const key = dayKey(ts(e));
    let g = groups.find(x => x.key === key);
    if (!g) { g = { key: key, label: dayLabel(ts(e)), total: 0, items: [] }; groups.push(g); }
    g.total += Number(e.amount) || 0; g.items.push(e);
  });

  const itemHtml = e =>
    '<div class="item">' +
      '<div class="emo" aria-hidden="true">' + esc(catEmoji(e.category)) + '</div>' +
      '<div class="meta">' +
        '<div class="desc">' + esc(e.description) + '</div>' +
        '<button class="cat-edit" data-act="cat-open" data-id="' + esc(String(e.id)) + '">' + esc(catName(e.category)) + ' <span class="pen" aria-hidden="true">' + ICONS.pen + '</span></button>' +
      '</div>' +
      '<span class="amount">' + money(e.amount) + '</span>' +
      '<button class="del" aria-label="' + t("aDel") + ': ' + esc(e.description) + '" data-act="exp-del" data-id="' + esc(String(e.id)) + '">' + ICONS.x + '</button>' +
    '</div>';

  listEl.innerHTML = groups.map(g =>
    '<div class="day"><span class="day-label">' + g.label + '</span>' +
    '<span class="day-total">' + money(g.total) + '</span></div>' +
    g.items.map(itemHtml).join("")
  ).join("");
}

// ---- GRÁFICO: para onde vai o dinheiro (barras ou pizza) ----
// A pessoa escolhe o tipo; a escolha fica salva pra próxima vez.
let chartType = (function () {
  try { const v = localStorage.getItem("chart_type"); return (v === "pie" || v === "bar") ? v : "bar"; }
  catch (e) { return "bar"; }
})();

// Junta os gastos por categoria DO MÊS, na moeda ativa (mesmos números do herói)
function chartData() {
  const exp = expenses.filter(e => expCur(e) === curCurrency && isThisMonth(e));
  const byCat = {};
  exp.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + (Number(e.amount) || 0); });
  const rows = Object.entries(byCat)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => ({ cat: cat, val: val, color: CATEGORIES[cat] || "#94A0B8" }));
  const total = rows.reduce((s, r) => s + r.val, 0);
  return { rows: rows, total: total };
}

// Desenha o gráfico de BARRAS (cada barra proporcional à maior)
function barSVG(rows, total) {
  const W = 300, rowH = 36, padTop = 2;
  const maxVal = rows[0].val || 1;
  const H = padTop + rows.length * rowH;
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(t("chartTitle")) + ': ' + esc(money(total)) + '">';
  rows.forEach((r, i) => {
    const y = padTop + i * rowH;
    const barY = y + 20, barH = 12;
    const w = Math.max(4, (r.val / maxVal) * W);
    const pct = total > 0 ? Math.round(r.val / total * 100) : 0;
    s += '<text class="bar-label" x="0" y="' + (y + 13) + '">' + esc(catLabel(r.cat)) + '</text>';
    s += '<text class="bar-value" x="' + W + '" y="' + (y + 13) + '" text-anchor="end">' + esc(money(r.val)) + ' · ' + pct + '%</text>';
    s += '<rect class="bar-track" x="0" y="' + barY + '" width="' + W + '" height="' + barH + '" rx="6"/>';
    s += '<rect x="0" y="' + barY + '" width="' + w + '" height="' + barH + '" rx="6" fill="' + r.color + '"/>';
  });
  s += '</svg>';
  return s;
}

// Desenha o gráfico de PIZZA (rosquinha, com o total no meio)
function pieSVG(rows, total) {
  const size = 200, cx = size / 2, cy = size / 2, thickness = 34;
  const radius = (size / 2) - thickness / 2 - 2;
  const C = 2 * Math.PI * radius;
  let offset = 0;
  let s = '<svg viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(t("chartTitle")) + ': ' + esc(money(total)) + '">';
  s += '<g transform="rotate(-90 ' + cx + ' ' + cy + ')">';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="var(--bg)" stroke-width="' + thickness + '"/>';
  rows.forEach(r => {
    const frac = total > 0 ? r.val / total : 0;
    const len = frac * C;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="' + r.color +
         '" stroke-width="' + thickness + '" stroke-dasharray="' + len + ' ' + (C - len) +
         '" stroke-dashoffset="' + (-offset) + '"/>';
    offset += len;
  });
  s += '</g>';
  s += '<text class="pie-center-total" x="' + cx + '" y="' + (cy - 1) + '" text-anchor="middle" font-size="19">' + esc(money(total)) + '</text>';
  s += '<text class="pie-center-label" x="' + cx + '" y="' + (cy + 15) + '" text-anchor="middle" font-size="9">' + esc(t("totalLabel")) + '</text>';
  s += '</svg>';
  return s;
}

function chartLegendHTML(rows, total) {
  return rows.map(r => {
    const pct = total > 0 ? Math.round(r.val / total * 100) : 0;
    return '<div class="leg">' +
      '<span class="dot" style="background:' + r.color + '"></span>' +
      '<span class="nm">' + esc(catLabel(r.cat)) + '</span>' +
      '<span class="pc">' + pct + '%</span>' +
      '<span class="vl">' + esc(money(r.val)) + '</span>' +
    '</div>';
  }).join("");
}

// ---- Insights do mês (com o maior gasto, a comparação e a contagem) ----
function renderInsights(rows, total) {
  const box = document.getElementById("insights");
  const card = box ? box.closest(".analysis-card") : null;
  if (!box) return;
  if (!total) { box.innerHTML = ""; if (card) card.style.display = "none"; return; }
  if (card) card.style.display = "block";
  const top = rows[0];
  const pc = Math.round(top.val / total * 100);
  let html = '<div class="insight"><span class="iic">' + catEmoji(top.cat) + '</span><p>' +
    t("insightTop").replace("{cat}", "<b>" + esc(catName(top.cat)) + "</b>").replace("{pc}", pc) + "</p></div>";
  // comparação com o mês passado (mesma conta do renderCompare)
  const now = new Date();
  const lastD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const kLast = lastD.getFullYear() + "-" + lastD.getMonth();
  let lastM = 0;
  expenses.filter(e => expCur(e) === curCurrency).forEach(e => {
    const d = new Date(ts(e));
    if (d.getFullYear() + "-" + d.getMonth() === kLast) lastM += Number(e.amount) || 0;
  });
  if (lastM > 0) {
    const diff = total - lastM;
    const key = diff < 0 ? "insightLess" : "insightMore";
    html += '<div class="insight"><span class="iic">' + (diff < 0 ? "📉" : "📈") + '</span><p>' +
      t(key).replace("{v}", "<b>" + esc(money(Math.abs(diff))) + "</b>") + "</p></div>";
  }
  const count = expenses.filter(e => expCur(e) === curCurrency && isThisMonth(e)).length;
  html += '<div class="insight"><span class="iic">✍️</span><p>' + t("insightCount").replace("{n}", "<b>" + count + "</b>") + "</p></div>";
  box.innerHTML = html;
}

function renderChart() {
  const card = document.getElementById("chartCard");
  if (!card) return;
  const empty = document.getElementById("statsEmpty");
  const d = chartData();
  renderInsights(d.rows, d.total);
  if (d.rows.length === 0) { card.style.display = "none"; if (empty) empty.style.display = "block"; return; }
  if (empty) empty.style.display = "none";
  card.style.display = "block";
  document.getElementById("chartTitle").textContent = t("chartTitle");
  const barBtn = document.getElementById("chartTabBar"), pieBtn = document.getElementById("chartTabPie");
  if (barBtn) { barBtn.textContent = t("chartBar"); barBtn.classList.toggle("active", chartType === "bar"); }
  if (pieBtn) { pieBtn.textContent = t("chartPie"); pieBtn.classList.toggle("active", chartType === "pie"); }
  const bodyEl = document.getElementById("chartBody");
  bodyEl.className = "chart-body " + (chartType === "pie" ? "is-pie" : "is-bar");
  bodyEl.innerHTML = chartType === "pie" ? pieSVG(d.rows, d.total) : barSVG(d.rows, d.total);
  document.getElementById("chartLegend").innerHTML = chartLegendHTML(d.rows, d.total);
}

function setChartType(tp) {
  chartType = tp;
  try { localStorage.setItem("chart_type", tp); } catch (e) {}
  renderChart();
}

// ---- Desenha os fixos ----
function renderFixed() {
  const total = recurring.reduce((s, f) => s + (Number(f.amount) || 0), 0);
  fixedTotalEl.textContent = money(total, homeCurrency) + t("perMonth");

  const unpaid = recurring.filter(f => !isPaid(f)).reduce((s, f) => s + (Number(f.amount) || 0), 0);
  if (recurring.length === 0) fixedSubEl.textContent = "";
  else if (unpaid === 0) fixedSubEl.innerHTML = t("allPaid");
  else fixedSubEl.innerHTML = t("remaining") + ' <b>' + money(unpaid, homeCurrency) + '</b>';

  if (recurring.length === 0) { fixedListEl.innerHTML = '<div class="fixed-empty">' + t("emptyFixed") + '</div>'; return; }
  const sorted = [...recurring].sort((a, b) => {
    const pa = isPaid(a) ? 1 : 0, pb = isPaid(b) ? 1 : 0;
    if (pa !== pb) return pa - pb;
    return (a.dueDay || 999) - (b.dueDay || 999);
  });
  fixedListEl.innerHTML = sorted.map(f => {
    const paid = isPaid(f);
    return '<div class="fixed-item' + (paid ? ' paid' : '') + '">' +
      '<span class="fx-left">' +
        '<button class="check' + (paid ? ' on' : '') + '" aria-pressed="' + paid + '" aria-label="' + t("aPaid") + ': ' + esc(f.name) + '" data-act="fx-paid" data-id="' + esc(String(f.id)) + '">' + (paid ? '✓' : '') + '</button>' +
        '<span class="fx-info">' +
          '<span class="fx-name">' + esc(f.name) + '</span>' +
          (f.dueDay ? '<span class="fx-due">' + t("dueDay") + ' ' + (Number(f.dueDay) || "") + '</span>' : '') +
        '</span>' +
      '</span>' +
      '<span class="fx-right">' +
        '<span class="fx-amount">' + money(f.amount, homeCurrency) + '</span>' +
        '<button class="fx-del" aria-label="' + t("aDel") + ': ' + esc(f.name) + '" data-act="fx-del" data-id="' + esc(String(f.id)) + '">' + ICONS.x + '</button>' +
      '</span>' +
    '</div>';
  }).join("");
}

// ---- Coach: chat (dentro da bolinha) ----
function renderChat() {
  const c = document.getElementById("chat");
  c.innerHTML =
    coachMessages.map(m => '<div class="msg ' + (m.role === "user" ? "user" : "bot") + '">' + esc(m.content) + '</div>').join("") +
    (coachThinking ? '<div class="thinking">' + t("thinkingTxt") + '</div>' : "");
  c.scrollTop = c.scrollHeight;
  // O botão de limpar só faz sentido quando já existe conversa de verdade
  // (a saudação sozinha não conta — não há o que apagar).
  const bar = document.getElementById("chatBar");
  if (bar) bar.style.display = coachMessages.length > 1 ? "flex" : "none";
}
// Apaga a conversa e volta pra saudação. Some do aparelho e da nuvem.
function clearChat() {
  if (coachMessages.length <= 1) return;
  if (!confirm(t("chatClearConfirm"))) return;
  coachMessages = [{ role: "bot", content: STR[lang].coachGreeting }];
  saveCoachMsgs();
  renderChat();
}
function renderSuggestions() {
  document.getElementById("suggestions").innerHTML =
    t("suggestions").map((q, i) => '<button class="chip" data-act="sugg" data-i="' + i + '">' + esc(q) + '</button>').join("");
}
function askCoachSuggestion(i) { askCoach(t("suggestions")[i]); }
async function askCoach(preset) {
  const el = document.getElementById("coachInput");
  const q = (preset !== undefined ? preset : el.value).trim();
  if (!q || coachThinking) return;
  coachMessages.push({ role: "user", content: q });
  el.value = ""; coachThinking = true; renderChat();

  // resumo dos gastos (separado por moeda) pra dar contexto ao coach
  const spendParts = [];
  CUR_ORDER.forEach(code => {
    const exp = expenses.filter(e => expCur(e) === code);
    if (!exp.length) return;
    const tot = exp.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const bc = {}; exp.forEach(e => { bc[e.category] = (bc[e.category] || 0) + (Number(e.amount) || 0); });
    spendParts.push(money(tot, code) + " (" + Object.entries(bc).map(([c, v]) => c + " " + money(v, code)).join(", ") + ")");
  });
  const spending = spendParts.length ? spendParts.join(" | ") : "(sem gastos)";

  const payload = {
    lang: lang,
    profile: coachProfile,
    spending: spending,
    messages: coachMessages.slice(1).map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })).slice(-12),
    accessToken: await getToken(), // prova de assinante — o servidor confere antes de responder
  };
  try {
    const res = await fetch("/.netlify/functions/coach", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    // 429 = a pessoa bateu no limite de uso. Merece um aviso claro, não um
    // "deu erro" genérico que parece defeito do app.
    if (res.status === 429) {
      coachMessages.push({ role: "bot", content: t("coachLimit") });
    } else {
      const data = await res.json();
      coachMessages.push({ role: "bot", content: (data && data.reply) ? data.reply : t("coachErr") });
    }
  } catch (e) {
    coachMessages.push({ role: "bot", content: t("coachErr") });
  }
  coachThinking = false; saveCoachMsgs(); renderChat();
}

// ---- Comparação mês a mês ----
function renderCompare() {
  const el = document.getElementById("compare");
  const now = new Date();
  const kThis = now.getFullYear() + "-" + now.getMonth();
  const lastD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const kLast = lastD.getFullYear() + "-" + lastD.getMonth();
  let thisM = 0, lastM = 0;
  expenses.filter(e => expCur(e) === curCurrency).forEach(e => {
    const d = new Date(ts(e)); const k = d.getFullYear() + "-" + d.getMonth();
    if (k === kThis) thisM += Number(e.amount) || 0;
    else if (k === kLast) lastM += Number(e.amount) || 0;
  });
  if (lastM === 0) { el.innerHTML = ""; return; } // ainda não há mês passado pra comparar
  const diff = thisM - lastM;
  if (Math.abs(diff) < 0.005) { el.innerHTML = t("cmpThisMonth") + " " + money(thisM) + ". " + t("cmpSame"); return; }
  const up = diff > 0;
  // usa a variável do tema: no claro o verde escurece sozinho e continua legível
  const color = up ? "#F87171" : "var(--spent)";
  const arrow = up ? "↑" : "↓";
  const word = up ? t("cmpMore") : t("cmpLess");
  el.innerHTML = t("cmpThisMonth") + " " + money(thisM) + '. <span style="color:' + color + '">' + arrow + " " + money(Math.abs(diff)) + " " + word + "</span>";
}

// ---- Compartilhar / PDF ----
function summaryText() {
  let out = "Algent — " + t("shareTitle");
  CUR_ORDER.forEach(code => {
    const exp = expenses.filter(e => expCur(e) === code);
    if (!exp.length) return;
    const total = exp.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const byCat = {}; exp.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + (Number(e.amount) || 0); });
    out += "\n\n" + t("totalLabel") + " (" + CURRENCIES[code] + "): " + money(total, code) + "\n" +
      Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([c, v]) => "- " + catLabel(c) + ": " + money(v, code)).join("\n");
  });
  return out;
}
async function shareSummary() {
  const text = summaryText();
  if (navigator.share) { try { await navigator.share({ title: "Algent", text: text }); } catch (e) {} return; }
  try { await navigator.clipboard.writeText(text); alert(t("copied")); } catch (e) { alert(text); }
}
function exportPDF() { window.print(); }

// ---- Seletor de moeda + detecção de local ----
function setCurCurrency(code) {
  if (!CURRENCIES[code]) return;
  curCurrency = code; curMenuOpen = false;
  try { localStorage.setItem("cur_currency", code); } catch (e) {}
  queueSettingsSave();
  render();
}
// Quem impede o clique de vazar pro "fecha o menu" é o ouvinte delegado lá embaixo.
function toggleCurMenu() { curMenuOpen = !curMenuOpen; renderCurrencyBar(); }
function renderCurrencyBar() {
  document.getElementById("curbar").innerHTML =
    '<button class="cur-toggle" aria-haspopup="true" aria-expanded="' + curMenuOpen + '" aria-label="' + t("aCur") + '" data-act="cur-toggle">' + FLAGS[curCurrency] + ' ' + CURRENCIES[curCurrency] + ' <span class="caret" aria-hidden="true">▾</span></button>' +
    '<div class="cur-menu' + (curMenuOpen ? ' open' : '') + '">' +
      CUR_ORDER.map(code => '<button class="cur-opt' + (code === curCurrency ? ' active' : '') + '" data-act="cur-set" data-cur="' + esc(code) + '">' + FLAGS[code] + ' ' + CURRENCIES[code] + '  ' + code + '</button>').join("") +
      '<button class="cur-opt local" data-act="cur-detect">📍 ' + t("localCur") + '</button>' +
    '</div>';
}
// Detecta a moeda do lugar (aproximado): 1º tenta GPS, 2º cai pro fuso horário. Nunca mexe nos fixos.
function currencyFromCoords(lat, lon) {
  if (lat >= 49 && lat <= 61 && lon >= -11 && lon <= 2.5) return "GBP";
  if (lat >= -34 && lat <= 6 && lon >= -74 && lon <= -34) return "BRL";
  if (lat >= 18 && lat <= 50 && lon >= -125 && lon <= -66) return "USD";
  if (lat >= 34 && lat <= 71 && lon >= -11 && lon <= 32) return "EUR";
  return null;
}
function currencyFromTZ() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Europe/London") return "GBP";
    if (/Sao_Paulo|Bahia|Fortaleza|Recife|Manaus|Belem|Cuiaba/.test(tz)) return "BRL";
    if (tz.indexOf("Europe/") === 0) return "EUR";
    if (tz.indexOf("America/") === 0) return "USD";
  } catch (e) {}
  return null;
}
function detectCurrency() {
  curMenuOpen = false; renderCurrencyBar();
  const apply = code => { if (code && CURRENCIES[code]) setCurCurrency(code); };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => apply(currencyFromCoords(pos.coords.latitude, pos.coords.longitude) || currencyFromTZ()),
      () => apply(currencyFromTZ()),
      { timeout: 8000 }
    );
  } else { apply(currencyFromTZ()); }
}

// ---- Liga os botões ----
document.getElementById("addBtn").onclick = () => addExpense();
input.addEventListener("keydown", e => { if (e.key === "Enter") addExpense(); });
document.getElementById("fixedBtn").onclick = () => addFixed();
fixedInput.addEventListener("keydown", e => { if (e.key === "Enter") addFixed(); });
document.getElementById("langBtn").onclick = () => {
  lang = lang === "pt" ? "en" : "pt";
  try { localStorage.setItem("lang", lang); } catch (e) {}
  applyHtmlLang();
  applyStaticTexts(); render(); renderFixed(); applyAuthTexts();
};

const _ctBar = document.getElementById("chartTabBar"); if (_ctBar) _ctBar.onclick = () => setChartType("bar");
const _ctPie = document.getElementById("chartTabPie"); if (_ctPie) _ctPie.onclick = () => setChartType("pie");

// ---- Navegação por abas ----
function go(scr) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById("s-" + scr);
  if (target) target.classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => {
    const on = b.getAttribute("data-scr") === scr;
    b.classList.toggle("on", on);
    if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
  });
  try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
}
document.querySelectorAll(".nav-btn[data-scr]").forEach(b => b.onclick = () => go(b.getAttribute("data-scr")));
const _catBackdrop = document.getElementById("catPickerBackdrop"); if (_catBackdrop) _catBackdrop.onclick = closeCatPicker;

// ---- Coach wiring ----
document.getElementById("coachSend").onclick = () => askCoach();
document.getElementById("coachInput").addEventListener("keydown", e => { if (e.key === "Enter") askCoach(); });
document.getElementById("pIncome").addEventListener("input", e => { coachProfile.income = e.target.value; saveProfile(); });
document.getElementById("pGoal").addEventListener("input", e => { coachProfile.goal = e.target.value; saveProfile(); });
document.getElementById("pRisk").addEventListener("change", e => { coachProfile.risk = e.target.value; saveProfile(); });
document.getElementById("shareBtn").onclick = () => shareSummary();
document.getElementById("pdfBtn").onclick = () => exportPDF();

// ---- TEMA: auto (segue o celular), claro ou escuro ----
const themeMq = window.matchMedia("(prefers-color-scheme: light)");
let themeMode = (function () {
  try { const v = localStorage.getItem("theme_mode"); return (v === "light" || v === "dark" || v === "auto") ? v : "auto"; }
  catch (e) { return "auto"; }
})();
function applyTheme() {
  let mode = themeMode;
  if (mode === "auto") mode = themeMq.matches ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", mode);
  document.querySelectorAll("#themeSeg button").forEach(b => b.classList.toggle("on", b.getAttribute("data-t") === themeMode));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", mode === "light" ? "#EEF3F0" : "#0A0B12");
}
function setTheme(m) {
  themeMode = m;
  try { localStorage.setItem("theme_mode", m); } catch (e) {}
  applyTheme();
}
document.querySelectorAll("#themeSeg button").forEach(b => b.onclick = () => setTheme(b.getAttribute("data-t")));
try { themeMq.addEventListener("change", () => { if (themeMode === "auto") applyTheme(); }); } catch (e) {}
applyTheme();

// ---- UM ouvinte só pra tudo que é criado na hora (delegação de eventos) ----
// Antes cada botão gerado carregava um onclick="..." dentro do próprio HTML.
// Isso obrigava a CSP a permitir script inline — ou seja, se um dia entrasse
// texto malicioso na tela, ele rodaria. Agora o botão só CARREGA UM RÓTULO
// (data-act) e quem decide o que fazer é este mapa aqui, que o atacante não
// alcança. Rótulo desconhecido simplesmente não faz nada.
const ACTIONS = {
  "chip-add":    (el) => quickAdd(Number(el.dataset.i)),
  "chip-del":    (el) => removeChip(Number(el.dataset.i)),
  "chip-ok":     () => addChipFromInput(),
  "chips-edit":  () => toggleEditChips(),
  "cat-open":    (el) => openCatPicker(el.dataset.id),
  "cat-pick":    (el) => changeCategory(el.dataset.id, el.dataset.cat),
  "exp-del":     (el) => removeExpense(el.dataset.id),
  "fx-paid":     (el) => togglePaid(el.dataset.id),
  "fx-del":      (el) => removeFixed(el.dataset.id),
  "sugg":        (el) => askCoachSuggestion(Number(el.dataset.i)),
  "cur-toggle":  () => toggleCurMenu(),
  "cur-set":     (el) => setCurCurrency(el.dataset.cur),
  "cur-detect":  () => detectCurrency(),
  "chat-clear":  () => clearChat(),
  "sub-reactivate": () => reactivateSubscription(),
};
// Registrado ANTES do "clique fora fecha o menu" logo abaixo — a ordem importa:
// o botão de moeda precisa poder impedir que o próprio clique feche o menu que
// ele acabou de abrir.
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const run = ACTIONS[el.dataset.act];
  if (!run) return;
  if (el.dataset.act === "cur-toggle") e.stopImmediatePropagation();
  run(el);
});
// Enter no campo de novo atalho (o campo nasce e morre junto com o modo de edição)
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target && e.target.id === "chipInput") addChipFromInput();
});

document.addEventListener("click", () => { if (curMenuOpen) { curMenuOpen = false; renderCurrencyBar(); } });
// Esc fecha o que estiver aberto (modal de categoria ou menu de moeda)
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  closeCatPicker();
  if (curMenuOpen) { curMenuOpen = false; renderCurrencyBar(); }
});

applyStaticTexts();
render();
renderFixed();

// ---- LOGIN (Supabase Auth) ----
// A publishable key é feita pra viver aqui no navegador — quem protege os dados
// são as regras de segurança (RLS) que a gente monta no último degrau.
const SUPA_URL = "https://efytffndatdkvbzeoxgm.supabase.co";
const SUPA_KEY = "sb_publishable_C9sNWRMrJFzyQQLEi9592Q_dgAYpaBM";
let sbClient = null;
try { sbClient = window.supabase.createClient(SUPA_URL, SUPA_KEY); } catch (e) {}
let currentUserId = null;     // id da pessoa logada (pra carimbar a ficha de configurações)
let settingsTimer = null;     // espera um tiquinho antes de mandar pra nuvem (evita mandar toda hora)
let applyingRemote = false;   // enquanto aplico o que veio da nuvem, não reenvio de volta

const authScreen = document.getElementById("authScreen");
function showApp() { authScreen.classList.add("hidden"); syncCloud(); gate(); }
function showLogin() {
  // Tira a marca do boot.js: a sessão guardada não valia (expirou, foi
  // revogada), então a tela de login precisa voltar a aparecer.
  document.documentElement.classList.remove("has-session");
  authScreen.classList.remove("hidden");
  if (!recoveryMode) { authMode = "signup"; emailOpen = false; setAuthMsg("", ""); renderAuth(); }
}

// ---- TRAVA DE ASSINANTE (paywall) ----
// "Tem acesso" = está no teste grátis (trialing) ou pagando (active). Qualquer outra coisa = trava.
function hasAccess(status) { return status === "trialing" || status === "active"; }
async function fetchSubStatus() {
  if (!sbClient) return null;
  try {
    // select("*") de propósito: se a coluna cancel_at_period_end ainda não existir
    // no banco, pedir ela pelo nome faria a consulta INTEIRA falhar — e aí a pessoa
    // levaria paywall mesmo tendo assinatura. Assim, o que existir vem.
    const { data, error } = await sbClient.from("subscriptions")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (error || !data || !data.length) return null;
    return {
      status: data[0].status || null,
      end: data[0].current_period_end || null,
      cancelAtEnd: data[0].cancel_at_period_end === true,
    };
  } catch (e) { return null; }
}
function showPaywall(status) {
  // se já teve algum status antes (e perdeu), fala "seu teste acabou"; senão, "comece seu teste"
  const returning = status && status !== "trialing" && status !== "active";
  document.getElementById("payTitle").textContent = returning ? t("payEnded") : t("payStart");
  document.getElementById("paySub").textContent = returning ? t("payEndedSub") : t("payStartSub");
  document.getElementById("payScreen").classList.remove("hidden");
}
function hidePaywall() { document.getElementById("payScreen").classList.add("hidden"); }
// Os dois botões da conta são um par: nunca aparecem juntos.
//   assinatura viva e não cancelada  -> "Cancelar assinatura"
//   cancelada mas ainda com acesso   -> "Reativar plano" (dá pra voltar atrás)
//   sem acesso nenhum                -> nenhum dos dois
function updateSubButtons(status, cancelAtEnd) {
  const cancelar = document.getElementById("cancelSubBtn");
  const reativar = document.getElementById("reactivateBtn");
  if (!cancelar) return;
  const temAcesso = hasAccess(status);
  cancelar.style.display = (temAcesso && !cancelAtEnd) ? "flex" : "none";
  if (reativar) {
    reativar.style.display = (temAcesso && cancelAtEnd) ? "flex" : "none";
    const lbl = document.getElementById("reactivateLbl");
    if (lbl) lbl.textContent = t("reactivate");
  }
}
function setSubState(status, end, cancelAtEnd) {
  subState = { status: status || null, end: end || null, cancelAtEnd: cancelAtEnd === true };
  renderSubscriptionUI();
}
// Redesenha tudo que depende da assinatura, sempre a partir do estado lembrado
function renderSubscriptionUI() {
  renderPlanInfo(subState.status, subState.end, subState.cancelAtEnd);
  updateSubButtons(subState.status, subState.cancelAtEnd);
}

async function gate() {
  if (!sbClient) { hidePaywall(); setSubState(null, null, false); return; } // se a nuvem falhar, não tranca ninguém (libera)
  const sub = await fetchSubStatus();
  const status = sub ? sub.status : null;
  const cancelAtEnd = sub ? sub.cancelAtEnd : false;
  if (hasAccess(status)) hidePaywall(); else showPaywall(status);
  setSubState(status, sub ? sub.end : null, cancelAtEnd);
}
// Escreve a data por extenso no idioma da pessoa ("10 de setembro de 2026")
function longDate(ms) {
  try {
    return new Date(ms).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" });
  } catch (e) { return ""; }
}
// "1 dia" / "12 dias" — sem o "1 dias" que entrega app amador
function daysWord(n) {
  return n === 1 ? t("day1") : t("dayN").replace("{n}", n);
}
// A linha de baixo do card da assinatura. Diz em que pé a coisa está:
// quantos dias faltam do teste, quando renova, ou até quando vai o acesso
// depois de cancelada.
function renderPlanInfo(status, end, cancelAtEnd) {
  const el = document.getElementById("planTrial");
  if (!el) return;
  let endMs = null;
  if (end) {
    if (typeof end === "number") endMs = end > 1e12 ? end : end * 1000;
    else { const p = Date.parse(end); if (!isNaN(p)) endMs = p; }
  }

  // Cancelada: o que importa é ATÉ QUANDO ela ainda tem acesso.
  if (cancelAtEnd) {
    el.textContent = endMs
      ? t("planCanceledUntil").replace("{date}", longDate(endMs))
      : t("planCanceled");
    return;
  }
  if (status === "canceled") { el.textContent = t("planEnded"); return; }
  if (status === "past_due" || status === "unpaid") { el.textContent = t("planPastDue"); return; }

  if (endMs && endMs > Date.now()) {
    const days = Math.max(1, Math.ceil((endMs - Date.now()) / 86400000));
    const key = status === "trialing" ? "planTrialEnds" : "planRenews";
    el.textContent = t(key).replace("{d}", daysWord(days));
    return;
  }
  el.textContent = t("planTrial"); // ainda sem data vinda do Stripe: texto padrão
}

// ---- NUVEM: gastos no Supabase, amarrados à conta logada ----
function expenseFromRow(r) {
  return { id: r.id, date: r.date, cur: r.cur, amount: Number(r.amount) || 0, category: r.category, description: r.description };
}
async function cloudLoadExpenses() {
  if (!sbClient) return null;
  try {
    const { data, error } = await sbClient.from("expenses").select("*").order("date", { ascending: false });
    if (error || !data) return null;
    return data.map(expenseFromRow);
  } catch (e) { return null; }
}
async function cloudInsertExpense(obj) {
  if (!sbClient) return null;
  try {
    const { data, error } = await sbClient.from("expenses")
      .insert({ date: obj.date, cur: obj.cur, amount: obj.amount, category: obj.category, description: obj.description })
      .select().single();
    if (error || !data) return null;
    return expenseFromRow(data);
  } catch (e) { return null; }
}
async function cloudDeleteExpense(id) {
  if (!sbClient) return false;
  try {
    const { error } = await sbClient.from("expenses").delete().eq("id", id);
    return !error;
  } catch (e) { return false; }
}
// Leva pra nuvem, UMA vez, o que já estava salvo no aparelho antes do login existir
async function migrateLocalExpenses() {
  if (!sbClient) return;
  try {
    if (localStorage.getItem("migrated_expenses_v1") === "1") return;
    let local = [];
    try { local = JSON.parse(localStorage.getItem("expenses") || "[]"); } catch (e) { local = []; }
    if (local.length) {
      const rows = local.map(e => ({
        date: e.date || new Date().toISOString(),
        cur: e.cur || homeCurrency,
        amount: Number(e.amount) || 0,
        category: e.category || "Outros",
        description: e.description || ""
      }));
      const { error } = await sbClient.from("expenses").insert(rows);
      if (error) return; // se falhou, não marca como migrado — tenta de novo na próxima
    }
    localStorage.setItem("migrated_expenses_v1", "1");
  } catch (e) {}
}
let cloudSynced = false;
async function syncCloud() {
  if (!sbClient || cloudSynced) return;
  cloudSynced = true;
  try { const { data: u } = await sbClient.auth.getUser(); currentUserId = (u && u.user) ? u.user.id : null; } catch (e) {}
  await migrateLocalExpenses();
  const cloud = await cloudLoadExpenses();
  if (cloud) { expenses = cloud; save(); render(); }
  await syncSettings();
}

// ---- NUVEM: configurações (fixos, perfil do coach, atalhos, moeda) numa ficha só ----
function collectSettings() {
  return {
    recurring: recurring,
    quickchips: quickChips,
    coach_profile: coachProfile,
    home_currency: homeCurrency,
    cur_currency: curCurrency,
    learned_cats: learnedCats
  };
}
async function cloudSaveSettings() {
  if (!sbClient || !currentUserId) return;
  try {
    await sbClient.from("settings").upsert(
      { user_id: currentUserId, data: collectSettings(), updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  } catch (e) {}
}
function queueSettingsSave() {
  if (!sbClient || applyingRemote) return;
  if (settingsTimer) clearTimeout(settingsTimer);
  settingsTimer = setTimeout(cloudSaveSettings, 800);
}
async function cloudLoadSettings() {
  if (!sbClient) return null;
  try {
    const { data, error } = await sbClient.from("settings").select("data").maybeSingle();
    if (error || !data) return null;
    return data.data || null;
  } catch (e) { return null; }
}
// Une duas listas sem duplicar (pelo id) — assim nunca se perde o que existe de um lado
function mergeById(a, b) {
  const out = []; const seen = {};
  [].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : []).forEach(item => {
    if (!item || typeof item !== "object") return;
    const key = (item.id != null) ? String(item.id) : JSON.stringify(item);
    if (seen[key]) return;
    seen[key] = 1; out.push(item);
  });
  return out;
}
async function syncSettings() {
  if (!sbClient) return;
  const remote = await cloudLoadSettings();
  const r = (remote && typeof remote === "object") ? remote : {};
  applyingRemote = true;
  // FIXOS: JUNTA aparelho + nuvem (nunca apaga um lado pelo outro)
  recurring = mergeById(recurring, r.recurring); saveFixed();
  // ATALHOS: só usa os da nuvem se ela tiver algum
  if (Array.isArray(r.quickchips) && r.quickchips.length) { quickChips = r.quickchips.slice(0, MAX_CHIPS); saveChips(); }
  // PERFIL: só usa o da nuvem se estiver preenchido
  if (r.coach_profile && typeof r.coach_profile === "object" && Object.keys(r.coach_profile).length) { coachProfile = r.coach_profile; saveProfile(); }
  if (r.home_currency && CURRENCIES[r.home_currency]) homeCurrency = r.home_currency;
  if (r.cur_currency && CURRENCIES[r.cur_currency]) { curCurrency = r.cur_currency; try { localStorage.setItem("cur_currency", curCurrency); } catch (e) {} }
  // CATEGORIAS ENSINADAS: junta nuvem + aparelho (o que está no aparelho tem preferência)
  if (r.learned_cats && typeof r.learned_cats === "object") {
    learnedCats = Object.assign({}, r.learned_cats, learnedCats);
    try { localStorage.setItem("learned_cats", JSON.stringify(learnedCats)); } catch (e) {}
  }
  applyingRemote = false;
  // devolve a versão JUNTA pra nuvem, pra ela ficar sempre com o conjunto completo
  await cloudSaveSettings();
  applyStaticTexts(); renderFixed(); renderCurrencyBar(); render();
}
function setAuthMsg(text, kind) {
  const m = document.getElementById("authMsg");
  m.textContent = text || "";
  m.className = "auth-msg" + (kind ? " " + kind : "");
}
// ---- TELA DE LOGIN: modo (criar conta / entrar) e formulário que abre ao clicar ----
let authMode = "signup"; // pessoas novas veem "Criar conta" primeiro
let emailOpen = false;
function renderAuth() {
  if (recoveryMode) return; // na recuperação de senha, a tela é controlada à parte
  const up = authMode === "signup";
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("authTitle", up ? t("authTitleUp") : t("authTitleIn"));
  set("authSwitchText", up ? t("haveAccount") : t("noAccount"));
  set("authToggle", up ? t("linkIn") : t("linkUp"));
  set("googleTxt", up ? t("googleUp") : t("googleIn"));
  set("emailToggleBtn", up ? t("emailUp") : t("emailIn"));
  set("authLoginBtn", up ? t("signup") : t("login"));
  set("authLegalPre", t("legalPre"));
  set("authLegalAnd", t("legalAnd"));
  const fields = document.getElementById("emailFields"); if (fields) fields.style.display = emailOpen ? "flex" : "none";
  const eb = document.getElementById("emailToggleBtn"); if (eb) eb.style.display = emailOpen ? "none" : "block";
  const fg = document.getElementById("forgotBtn"); if (fg) fg.style.display = (!up && emailOpen) ? "block" : "none";
}
function openEmailForm() { emailOpen = true; renderAuth(); setTimeout(() => { const e = document.getElementById("authEmail"); if (e) e.focus(); }, 40); }
function toggleAuthMode() { authMode = (authMode === "signup") ? "signin" : "signup"; setAuthMsg("", ""); renderAuth(); }

function applyAuthTexts() {
  document.getElementById("authEmail").placeholder = t("emailPh");
  document.getElementById("authPass").placeholder = t("passPh");
  document.getElementById("authEmail").setAttribute("aria-label", t("emailPh"));
  document.getElementById("authPass").setAttribute("aria-label", t("passPh"));
  const ao = document.getElementById("authOr"); if (ao) ao.textContent = t("authOr");
  const fg = document.getElementById("forgotBtn"); if (fg) fg.textContent = t("forgot");
  const lo = document.getElementById("logoutLbl"); if (lo) lo.textContent = t("logout");
  const sb = document.getElementById("subscribeBtn"); if (sb) sb.textContent = t("subscribe");
  const pb = document.getElementById("payBtn"); if (pb) pb.textContent = t("payBtnTxt");
  const pl = document.getElementById("payLogout"); if (pl) pl.textContent = t("logout");
  const cs = document.getElementById("cancelSubLbl"); const csb = document.getElementById("cancelSubBtn");
  if (cs && csb && !csb.disabled) cs.textContent = t("cancelSub");
  document.querySelectorAll(".js-legal-priv").forEach(a => { a.textContent = t("legalPrivacy"); });
  document.querySelectorAll(".js-legal-terms").forEach(a => { a.textContent = t("legalTerms"); });
  renderAuth();
}
async function doLogin() {
  const email = document.getElementById("authEmail").value.trim();
  const pass = document.getElementById("authPass").value;
  if (!email || !pass) { setAuthMsg(t("authFillErr"), "err"); return; }
  if (!sbClient) { setAuthMsg(t("genericErr"), "err"); return; }
  setAuthMsg(t("authLoading"), "");
  try {
    const { error } = await sbClient.auth.signInWithPassword({ email: email, password: pass });
    if (error) { setAuthMsg(t("badLogin"), "err"); return; }
    setAuthMsg("", ""); showApp();
  } catch (e) { setAuthMsg(t("genericErr"), "err"); }
}
async function doSignup() {
  const email = document.getElementById("authEmail").value.trim();
  const pass = document.getElementById("authPass").value;
  if (!email || !pass) { setAuthMsg(t("authFillErr"), "err"); return; }
  if (!sbClient) { setAuthMsg(t("genericErr"), "err"); return; }
  setAuthMsg(t("authLoading"), "");
  try {
    const { data, error } = await sbClient.auth.signUp({ email: email, password: pass });
    if (error) { setAuthMsg(error.message || t("genericErr"), "err"); return; }
    if (data && data.session) { setAuthMsg("", ""); showApp(); return; } // confirmação de email desligada
    setAuthMsg(t("signupOk"), "ok");
  } catch (e) { setAuthMsg(t("genericErr"), "err"); }
}
async function doLogout() {
  if (sbClient) { try { await sbClient.auth.signOut(); } catch (e) {} }
  cloudSynced = false; currentUserId = null;
  // limpa TUDO que é pessoal do aparelho — memória E localStorage.
  // Senão a próxima conta que logar aqui herda conversa do coach, fixos etc.
  ["expenses", "recurring", "quickchips_v3", "coach_profile", "coach_msgs", "learned_cats", "migrated_expenses_v1"]
    .forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
  expenses = []; recurring = []; quickChips = DEFAULT_CHIPS.slice();
  coachProfile = {}; learnedCats = {};
  coachMessages = [{ role: "bot", content: STR[lang].coachGreeting }];
  applyStaticTexts(); renderFixed(); renderCurrencyBar(); render();
  hidePaywall();
  showLogin();
}
async function checkSession() {
  if (!sbClient) { showApp(); return; } // se o Supabase não carregar, não trava o app
  try {
    const { data } = await sbClient.auth.getSession();
    if (data && data.session) showApp(); else showLogin();
  } catch (e) { showLogin(); }
}
// ---- ASSINATURA: abre a tela de pagamento do Stripe ----
async function startCheckout() {
  if (!sbClient) { alert(t("subErr")); return; }
  const btn = document.getElementById("payBtn") || document.getElementById("subscribeBtn");
  if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = t("subLoading"); }
  try {
    // manda só o token — o servidor descobre sozinho quem é a pessoa e o email dela
    const token = await getToken();
    if (!token) { throw new Error("Sem usuário logado"); }
    const res = await fetch("/.netlify/functions/create-checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token })
    });
    const data = await res.json();
    if (data && data.url) { window.location.href = data.url; return; }
    throw new Error((data && data.error) ? data.error : "sem resposta do pagamento");
  } catch (e) {
    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || t("payBtnTxt"); }
    alert(t("subErr") + "\n\n( " + (e && e.message ? e.message : e) + " )");
  }
}
// ---- CANCELAR ASSINATURA ----
async function cancelSubscription() {
  if (!sbClient) { alert(t("cancelErr")); return; }
  if (!confirm(t("cancelConfirm"))) return;
  const btn = document.getElementById("cancelSubBtn");
  const lbl = document.getElementById("cancelSubLbl");
  if (btn) btn.disabled = true;
  if (lbl) lbl.textContent = t("cancelBusy");
  try {
    // pega o token da sessão pra provar, no servidor, quem é a pessoa
    let token = "";
    try {
      const { data } = await sbClient.auth.getSession();
      if (data && data.session) token = data.session.access_token || "";
    } catch (e) {}
    if (!token) throw new Error("no session");
    const res = await fetch("/.netlify/functions/cancel-subscription", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token })
    });
    const data = await res.json();
    if (!res.ok || !data || !data.ok) throw new Error((data && data.error) || "failed");
    if (data.nothing) {
      alert(t("cancelNothing"));
    } else {
      // MOSTRA O CANCELAMENTO NA HORA. O Stripe mantém o status "active" até o
      // período acabar, e o aviso dele pro nosso servidor pode demorar alguns
      // segundos. Sem isto a tela continuaria dizendo "assinatura ativa" logo
      // depois de cancelar — foi exatamente o que dava a impressão de não ter
      // funcionado.
      // Mantém o status REAL (active/trialing) — a pessoa segue com acesso pago.
      // Passar null aqui faria os dois botões sumirem e ela ficaria sem como
      // voltar atrás.
      const endMs = data.periodEnd ? data.periodEnd * 1000 : null;
      setSubState(subState.status, endMs, true);
      alert(endMs ? t("cancelDone").replace("{date}", longDate(endMs)) : t("cancelDoneNoDate"));
    }
    // NÃO reconferimos com o servidor aqui de propósito.
    // Antes havia um gate() com atraso de 2,5s: ele relia o banco, o aviso do
    // Stripe às vezes ainda não tinha chegado, e a tela voltava a dizer
    // "assinatura ativa" com o botão de cancelar de novo — parecia que o
    // cancelamento tinha falhado.
    // Agora a própria função de cancelar já grava no banco antes de responder,
    // então o estado correto aparece sozinho na próxima vez que o app abrir.
  } catch (e) {
    alert(t("cancelErr"));
  } finally {
    if (btn) btn.disabled = false;
    if (lbl) lbl.textContent = t("cancelSub");
  }
}

// ---- REATIVAR: desfaz o cancelamento enquanto o período pago não acabou ----
// Não abre checkout novo de propósito: isso criaria uma SEGUNDA assinatura no
// Stripe e a pessoa seria cobrada duas vezes. O servidor apenas desmarca o
// cancelamento da assinatura que ela já tem.
async function reactivateSubscription() {
  if (!sbClient) { alert(t("reactivateErr")); return; }
  const btn = document.getElementById("reactivateBtn");
  const lbl = document.getElementById("reactivateLbl");
  if (btn) btn.disabled = true;
  if (lbl) lbl.textContent = t("reactivateBusy");
  try {
    const token = await getToken();
    if (!token) throw new Error("no session");
    const res = await fetch("/.netlify/functions/reactivate-subscription", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token }),
    });
    const data = await res.json();
    if (!res.ok || !data || !data.ok) throw new Error((data && data.error) || "failed");
    if (data.nothing) {
      alert(t("reactivateNothing"));
    } else {
      const endMs = data.periodEnd ? data.periodEnd * 1000 : subState.end;
      setSubState(subState.status, endMs, false);
      alert(t("reactivateDone"));
    }
  } catch (e) {
    alert(t("reactivateErr"));
  } finally {
    if (btn) btn.disabled = false;
    if (lbl) lbl.textContent = t("reactivate");
  }
}
// Quando a pessoa volta do pagamento, agradece e limpa o ?paid=1 da barra de endereço
function handleReturnFromStripe() {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("paid") === "1") {
      setTimeout(() => alert(t("subThanks")), 400);
      history.replaceState({}, "", window.location.pathname);
      hidePaywall(); // acabou de pagar: libera na hora
      setTimeout(gate, 4000); // e confirma o status de verdade uns segundos depois
    } else if (q.get("canceled") === "1") {
      history.replaceState({}, "", window.location.pathname);
    }
  } catch (e) {}
}

async function oauth(provider) {
  if (!sbClient) { setAuthMsg(t("genericErr"), "err"); return; }
  setAuthMsg(t("authLoading"), "");
  try {
    const { error } = await sbClient.auth.signInWithOAuth({ provider: provider, options: { redirectTo: window.location.origin } });
    if (error) { setAuthMsg(t("genericErr"), "err"); }
  } catch (e) { setAuthMsg(t("genericErr"), "err"); }
}

// ---- ESQUECI A SENHA / TROCAR SENHA ----
let recoveryMode = false;
async function doForgot() {
  const email = document.getElementById("authEmail").value.trim();
  if (!email) { setAuthMsg(t("typeEmailFirst"), "err"); return; }
  if (!sbClient) { setAuthMsg(t("genericErr"), "err"); return; }
  setAuthMsg(t("authLoading"), "");
  try {
    const { error } = await sbClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) { setAuthMsg(t("genericErr"), "err"); return; }
    setAuthMsg(t("resetSent"), "ok");
  } catch (e) { setAuthMsg(t("genericErr"), "err"); }
}
// Quando a pessoa volta do link do email, mostra só o campo de nova senha
function enterRecoveryMode() {
  recoveryMode = true;
  showLogin();
  emailOpen = true;
  ["googleBtn", "emailToggleBtn", "authSwitch", "authEmail", "forgotBtn", "authLegal"].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = "none";
  });
  const div = document.querySelector(".auth-divider"); if (div) div.style.display = "none";
  const ff = document.getElementById("emailFields"); if (ff) ff.style.display = "flex";
  const title = document.getElementById("authTitle"); if (title) title.textContent = t("setNewPw");
  document.getElementById("authPass").value = "";
  const lb = document.getElementById("authLoginBtn"); if (lb) { lb.textContent = t("saveNewPw"); lb.style.display = "block"; }
  setAuthMsg("", "");
}
async function saveNewPassword() {
  const pass = document.getElementById("authPass").value;
  if (!pass || pass.length < 6) { setAuthMsg(t("pwTooShort"), "err"); return; }
  if (!sbClient) { setAuthMsg(t("genericErr"), "err"); return; }
  setAuthMsg(t("authLoading"), "");
  try {
    const { error } = await sbClient.auth.updateUser({ password: pass });
    if (error) { setAuthMsg(t("genericErr"), "err"); return; }
    recoveryMode = false;
    setAuthMsg("", "");
    try { history.replaceState({}, "", window.location.pathname); } catch (e) {}
    showApp();
  } catch (e) { setAuthMsg(t("genericErr"), "err"); }
}
function doLoginOrRecover() {
  if (recoveryMode) return saveNewPassword();
  return (authMode === "signup") ? doSignup() : doLogin();
}
if (sbClient) {
  try {
    sbClient.auth.onAuthStateChange((evt) => { if (evt === "PASSWORD_RECOVERY") enterRecoveryMode(); });
  } catch (e) {}
}

document.getElementById("authLoginBtn").onclick = doLoginOrRecover;
const _emailToggle = document.getElementById("emailToggleBtn"); if (_emailToggle) _emailToggle.onclick = openEmailForm;
const _authToggle = document.getElementById("authToggle"); if (_authToggle) _authToggle.onclick = toggleAuthMode;
const _forgotBtn = document.getElementById("forgotBtn"); if (_forgotBtn) _forgotBtn.onclick = doForgot;
const _gBtn = document.getElementById("googleBtn"); if (_gBtn) _gBtn.onclick = () => oauth("google");
const _payBtn = document.getElementById("payBtn"); if (_payBtn) _payBtn.onclick = startCheckout;
const _payLogout = document.getElementById("payLogout"); if (_payLogout) _payLogout.onclick = doLogout;
document.getElementById("authPass").addEventListener("keydown", e => { if (e.key === "Enter") doLoginOrRecover(); });
document.getElementById("authEmail").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("authPass").focus(); });
const _logoutBtn = document.getElementById("logoutBtn");
if (_logoutBtn) _logoutBtn.onclick = doLogout;
const _cancelSubBtn = document.getElementById("cancelSubBtn");
if (_cancelSubBtn) _cancelSubBtn.onclick = cancelSubscription;
const _subBtn = document.getElementById("subscribeBtn");
if (_subBtn) _subBtn.onclick = startCheckout;
applyAuthTexts();
handleReturnFromStripe();
checkSession();

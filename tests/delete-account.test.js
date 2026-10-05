const test = require("node:test");
const assert = require("node:assert");
const rateLimit = require("../netlify/functions/lib/rate-limit.js");

const FAKE_USER_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
const FAKE_TOKEN = "valid-token-123";
const FAKE_CUSTOMER = "cus_test123";

function mockEnv() {
  process.env.SUPABASE_URL = "https://fake.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE = "fake-service-role";
  process.env.STRIPE_SECRET_KEY = "sk_test_fake";
}
function clearEnv() {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE;
  delete process.env.STRIPE_SECRET_KEY;
}

function makeEvent(body) {
  return { httpMethod: "POST", body: JSON.stringify(body || {}) };
}

function freshHandler() {
  delete require.cache[require.resolve("../netlify/functions/delete-account.js")];
  delete require.cache[require.resolve("../netlify/functions/lib/verify-user.js")];
  return require("../netlify/functions/delete-account.js");
}

function buildFetch(opts) {
  const calls = [];
  const fn = async (url, init) => {
    const method = (init && init.method) || "GET";
    calls.push({ url, method, body: init && init.body });

    // Rate limiter RPC
    if (url.includes("/rpc/bump_ai_usage")) {
      return { ok: true, status: 200, json: async () => true };
    }
    // Auth: verify token
    if (url.includes("/auth/v1/user") && !url.includes("/admin/")) {
      if (opts.authFail) return { ok: false, status: 401, json: async () => ({}) };
      return { ok: true, status: 200, json: async () => ({ id: FAKE_USER_ID, email: "test@test.com" }) };
    }
    // Supabase REST reads (GET on subscriptions for status or stripe_customer_id)
    if (url.includes("/rest/v1/subscriptions") && method === "GET") {
      if (url.includes("select=stripe_customer_id")) {
        if (opts.noCustomer) return { ok: true, status: 200, json: async () => [] };
        return { ok: true, status: 200, json: async () => [{ stripe_customer_id: FAKE_CUSTOMER }] };
      }
      return { ok: true, status: 200, json: async () => [{ status: "active" }] };
    }
    // Stripe list subscriptions
    if (url.includes("api.stripe.com/v1/subscriptions") && method === "GET") {
      if (opts.stripeListFail) return { ok: false, status: 500, json: async () => ({}) };
      return { ok: true, status: 200, json: async () => ({ data: [{ id: "sub_1", status: "active" }] }) };
    }
    // Stripe cancel (DELETE)
    if (url.includes("api.stripe.com/v1/subscriptions/") && method === "DELETE") {
      if (opts.stripeCancelFail) return { ok: false, status: 500, json: async () => ({}) };
      return { ok: true, status: 200, json: async () => ({ id: "sub_1", status: "canceled" }) };
    }
    // Supabase REST delete rows
    if (url.includes("/rest/v1/") && method === "DELETE") {
      const m = url.match(/rest\/v1\/(\w+)/);
      const table = m && m[1];
      if (opts.tableDeleteFail && opts.tableDeleteFail === table) {
        return { ok: false, status: 500, text: async () => "db error" };
      }
      return { ok: true, status: 200, text: async () => "" };
    }
    // Supabase Auth admin delete user
    if (url.includes("/auth/v1/admin/users/") && method === "DELETE") {
      if (opts.authDeleteFail) return { ok: false, status: 500, text: async () => "fail" };
      return { ok: true, status: 200, json: async () => ({}) };
    }
    return { ok: true, status: 200, json: async () => ({}), text: async () => "" };
  };
  return { fn, calls };
}

function withMock(opts, testFn) {
  return async () => {
    rateLimit._reset();
    mockEnv();
    const orig = globalThis.fetch;
    const { fn, calls } = buildFetch(opts);
    globalThis.fetch = fn;
    try {
      const mod = freshHandler();
      await testFn(mod.handler, calls);
    } finally {
      globalThis.fetch = orig;
      clearEnv();
    }
  };
}

test("GET → 405", withMock({}, async (handler) => {
  const res = await handler({ httpMethod: "GET", body: "{}" });
  assert.strictEqual(res.statusCode, 405);
}));

test("sem token → 401", withMock({ authFail: true }, async (handler) => {
  const res = await handler(makeEvent({}));
  assert.strictEqual(res.statusCode, 401);
}));

test("token forjado → 401", withMock({ authFail: true }, async (handler) => {
  const res = await handler(makeEvent({ accessToken: "forged-token" }));
  assert.strictEqual(res.statusCode, 401);
}));

test("user_id no body é ignorado (usa o do token)", withMock({}, async (handler, calls) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN, user_id: "attacker-id" }));
  assert.strictEqual(res.statusCode, 200);
  const authDelCall = calls.find(c => c.url.includes("/auth/v1/admin/users/") && c.method === "DELETE");
  assert.ok(authDelCall);
  assert.ok(authDelCall.url.includes(FAKE_USER_ID));
  assert.ok(!authDelCall.url.includes("attacker-id"));
}));

test("falha do Stripe ao listar aborta antes de apagar tabelas e Auth", withMock({ stripeListFail: true }, async (handler, calls) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  assert.strictEqual(res.statusCode, 502);
  const tableDels = calls.filter(c => c.url.includes("/rest/v1/") && c.method === "DELETE");
  assert.strictEqual(tableDels.length, 0, "no table deletes should happen");
  const authDel = calls.filter(c => c.url.includes("/auth/v1/admin/users/") && c.method === "DELETE");
  assert.strictEqual(authDel.length, 0, "auth delete should not happen");
}));

test("falha do Stripe ao cancelar aborta antes de apagar tabelas e Auth", withMock({ stripeCancelFail: true }, async (handler, calls) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  assert.strictEqual(res.statusCode, 502);
  const tableDels = calls.filter(c => c.url.includes("/rest/v1/") && c.method === "DELETE");
  assert.strictEqual(tableDels.length, 0, "no table deletes should happen");
  const authDel = calls.filter(c => c.url.includes("/auth/v1/admin/users/") && c.method === "DELETE");
  assert.strictEqual(authDel.length, 0, "auth delete should not happen");
}));

test("falha ao apagar uma tabela aborta antes de apagar o Auth", withMock({ tableDeleteFail: "settings" }, async (handler, calls) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  assert.strictEqual(res.statusCode, 502);
  const authDel = calls.filter(c => c.url.includes("/auth/v1/admin/users/") && c.method === "DELETE");
  assert.strictEqual(authDel.length, 0, "auth delete should not happen");
}));

test("caminho feliz: ordem Stripe → tabelas → Auth, devolve 200", withMock({}, async (handler, calls) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.ok, true);

  const stripeCancelIdx = calls.findIndex(c => c.url.includes("api.stripe.com") && c.method === "DELETE");
  const expensesDelIdx = calls.findIndex(c => c.url.includes("/rest/v1/expenses") && c.method === "DELETE");
  const authDelIdx = calls.findIndex(c => c.url.includes("/auth/v1/admin/users/") && c.method === "DELETE");

  assert.ok(stripeCancelIdx >= 0, "Stripe cancel must happen");
  assert.ok(expensesDelIdx >= 0, "expenses delete must happen");
  assert.ok(authDelIdx >= 0, "auth delete must happen");
  assert.ok(stripeCancelIdx < expensesDelIdx, "Stripe before tables");
  assert.ok(expensesDelIdx < authDelIdx, "tables before Auth");
}));

test("sem stripe_customer_id: salta Stripe sem erro, apaga dados e Auth", withMock({ noCustomer: true }, async (handler, calls) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  assert.strictEqual(res.statusCode, 200);
  const stripeCalls = calls.filter(c => c.url.includes("api.stripe.com"));
  assert.strictEqual(stripeCalls.length, 0);
  const authDel = calls.filter(c => c.url.includes("/auth/v1/admin/users/") && c.method === "DELETE");
  assert.strictEqual(authDel.length, 1);
}));

test("Stripe cancela com DELETE imediato, não cancel_at_period_end", withMock({}, async (handler, calls) => {
  await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  const stripeDel = calls.find(c => c.url.includes("api.stripe.com/v1/subscriptions/sub_") && c.method === "DELETE");
  assert.ok(stripeDel, "must use HTTP DELETE for immediate cancellation");
  assert.strictEqual(stripeDel.body, undefined, "DELETE must have no body");
}));

test("resposta de erro não vaza dados pessoais", withMock({ stripeListFail: true }, async (handler) => {
  const res = await handler(makeEvent({ accessToken: FAKE_TOKEN }));
  assert.strictEqual(res.statusCode, 502);
  const body = JSON.parse(res.body);
  assert.ok(body.error, "must have error field");
  assert.ok(!body.error.includes(FAKE_USER_ID), "must not leak user id");
  assert.ok(!body.error.includes(FAKE_CUSTOMER), "must not leak customer id");
}));

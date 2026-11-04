import { afterEach, expect, it, vi } from "vitest";
const getDatabase = vi.hoisted(() => vi.fn(() => { throw new Error("database unavailable"); }));
vi.mock("@netlify/database", () => ({ getDatabase }));
import collect from "../../netlify/functions/collect";
import dashboard from "../../netlify/functions/dashboard";
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
it("does not initialize a database while collection is off", async () => {
  vi.stubGlobal("Netlify", { env: { get: () => undefined } });
  expect((await collect(new Request("http://localhost/api/collect/", { method: "POST", body: "{}" }))).status).toBe(204);
  expect(getDatabase).not.toHaveBeenCalled();
});
it("authenticates before connecting and handles connection configuration failures", async () => {
  const token = "test-only-dashboard-token";
  vi.stubGlobal("Netlify", { env: { get: () => token } });
  expect((await dashboard(new Request("http://localhost/analytics/"))).status).toBe(401);
  expect(getDatabase).not.toHaveBeenCalled();
  expect((await dashboard(new Request("http://localhost/analytics/", { headers: {
    authorization: `Basic ${Buffer.from(`operator:${token}`).toString("base64")}`,
  }}))).status).toBe(503);
});

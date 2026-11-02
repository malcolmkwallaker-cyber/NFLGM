import { rotatingVisitorIds } from "@/lib/analytics/identity";
import type { EventName, GameMode, UtmFields } from "@/lib/analytics/types";
import { hasUtm, parseUtm, referrerHostname, trackingAllowed } from "@/lib/analytics/validate";

const COLLECT_PATH = "/api/collect/";
const SESSION_ID = "rtr_session_id";
const SESSION_START = "rtr_session_started_at";
const FIRST_ACTION = "rtr_first_action";
const SESSION_ENDED = "rtr_session_end_sent";
const UTM_KEY = "rtr_utm";
const VISITOR_SEED = "rtr_visitor_seed";

export type KeyValueStore = {
  get(key: string): string | null;
  set(key: string, value: string): void;
};

export type Transport = {
  beacon?: (url: string, body: string) => boolean;
  fetch?: (url: string, body: string) => void | Promise<void>;
};

type TrackerOptions = {
  enabled: boolean;
  local: KeyValueStore;
  session: KeyValueStore;
  doNotTrack: string | null;
  globalPrivacyControl: boolean;
  now: () => Date;
  randomId: () => string;
  pageHost: string;
  send: (body: string) => void;
};

export type Tracker = {
  pageview(pathname: string, search: string, referrer: string): Promise<void>;
  event(name: EventName, extra?: { mode?: GameMode }): Promise<void>;
  sessionEnd(): Promise<void>;
};

export function memoryStore(initial?: Record<string, string>): KeyValueStore {
  const values = new Map(Object.entries(initial ?? {}));
  return {
    get: (key) => values.get(key) ?? null,
    set: (key, value) => {
      values.set(key, value);
    },
  };
}

export function safeStore(storage: Storage | null | undefined): KeyValueStore {
  return {
    get(key) {
      try {
        return storage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        storage?.setItem(key, value);
      } catch {
        /* storage can be blocked; the event still sends without a durable id */
      }
    },
  };
}

export function deliver(body: string, transport: Transport): void {
  try {
    if (transport.beacon?.(COLLECT_PATH, body)) return;
  } catch {
    /* try fetch below */
  }
  try {
    const result = transport.fetch?.(COLLECT_PATH, body);
    if (result && typeof (result as Promise<void>).then === "function") void (result as Promise<void>).catch(() => {});
  } catch {
    /* analytics must not affect the game */
  }
}

function browserTransport(): Transport {
  return {
    beacon(url, body) {
      if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return false;
      const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
      return navigator.sendBeacon(url, blob);
    },
    fetch(url, body) {
      if (typeof fetch !== "function") return;
      void fetch(url, {
        method: "POST",
        headers: { "content-type": "text/plain;charset=UTF-8" },
        body,
        keepalive: true,
        credentials: "omit",
        cache: "no-store",
      }).catch(() => {});
    },
  };
}

function readUtm(session: KeyValueStore, search: string): UtmFields {
  const current = parseUtm(search);
  if (hasUtm(current)) {
    session.set(UTM_KEY, JSON.stringify(current));
    return current;
  }
  const saved = session.get(UTM_KEY);
  if (!saved) return current;
  try {
    const parsed = JSON.parse(saved) as Partial<UtmFields>;
    return {
      source: typeof parsed.source === "string" ? parsed.source : null,
      medium: typeof parsed.medium === "string" ? parsed.medium : null,
      campaign: typeof parsed.campaign === "string" ? parsed.campaign : null,
      content: typeof parsed.content === "string" ? parsed.content : null,
    };
  } catch {
    return current;
  }
}

function visitorSeed(local: KeyValueStore, randomId: () => string): string | null {
  const existing = local.get(VISITOR_SEED);
  if (existing) return existing;
  const created = randomId();
  local.set(VISITOR_SEED, created);
  return local.get(VISITOR_SEED) === created ? created : null;
}

export function createTracker(options: TrackerOptions): Tracker {
  let lastPage = "";
  let lastPageAt = 0;
  const allowed = options.enabled && trackingAllowed({ doNotTrack: options.doNotTrack, globalPrivacyControl: options.globalPrivacyControl });

  async function visitorFields(): Promise<Record<string, string>> {
    const seed = visitorSeed(options.local, options.randomId);
    if (!seed) return {};
    const ids = await rotatingVisitorIds(seed, options.now());
    return { visitorId: ids.id, visitorPrev: ids.prev, visitorD7: ids.d7 };
  }

  function sessionId(): string | null {
    const existing = options.session.get(SESSION_ID);
    if (existing) return existing;
    const created = options.randomId();
    options.session.set(SESSION_ID, created);
    options.session.set(SESSION_START, String(options.now().getTime()));
    return options.session.get(SESSION_ID);
  }

  async function post(payload: Record<string, unknown>): Promise<void> {
    if (!allowed) return;
    try {
      const id = sessionId();
      if (!id) return;
      const body = JSON.stringify({ sessionId: id, ...(await visitorFields()), ...payload });
      options.send(body);
    } catch {
      /* analytics must not affect the game */
    }
  }

  return {
    async pageview(pathname, search, referrer) {
      if (!allowed || !pathname.startsWith("/")) return;
      const key = `${pathname}?${search}`;
      const at = options.now().getTime();
      if (key === lastPage && at - lastPageAt < 1000) return;
      lastPage = key;
      lastPageAt = at;
      const utm = readUtm(options.session, search);
      await post({
        event: "pageview",
        path: pathname,
        referrerHost: referrerHostname(referrer, options.pageHost),
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
        utmContent: utm.content,
      });
    },
    async event(name, extra) {
      if (!allowed) return;
      if (name === "first_action") {
        if (options.session.get(FIRST_ACTION) === "1") return;
        options.session.set(FIRST_ACTION, "1");
      }
      await post({
        event: name,
        ...(extra?.mode ? { mode: extra.mode } : {}),
      });
    },
    async sessionEnd() {
      if (!allowed) return;
      if (options.session.get(SESSION_ENDED) === "1") return;
      const started = Number(options.session.get(SESSION_START) ?? options.now().getTime());
      const durationMs = Math.max(0, options.now().getTime() - (Number.isFinite(started) ? started : options.now().getTime()));
      options.session.set(SESSION_ENDED, "1");
      await post({ event: "session_end", durationMs });
    },
  };
}

const disabled: Tracker = {
  pageview: async () => {},
  event: async () => {},
  sessionEnd: async () => {},
};

let singleton: Tracker | null = null;

function defaultTracker(): Tracker {
  if (singleton) return singleton;
  if (typeof window === "undefined") return disabled;
  singleton = createTracker({
    enabled: process.env.NEXT_PUBLIC_ANALYTICS === "on",
    local: safeStore(window.localStorage),
    session: safeStore(window.sessionStorage),
    doNotTrack: navigator.doNotTrack ?? (window as Window & { doNotTrack?: string }).doNotTrack ?? null,
    globalPrivacyControl: (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
    now: () => new Date(),
    randomId: () => crypto.randomUUID(),
    pageHost: window.location.host,
    send: (body) => deliver(body, browserTransport()),
  });
  return singleton;
}

export function guard(run: () => void): void {
  try {
    run();
  } catch {
    /* analytics must not affect the game */
  }
}

export function trackPageview(pathname: string): void {
  guard(() => {
    void defaultTracker()
      .pageview(pathname, window.location.search, document.referrer)
      .catch(() => {});
  });
}

export function trackGameStart(mode: GameMode): void {
  guard(() => {
    void defaultTracker().event("game_start", { mode }).catch(() => {});
  });
}

export function trackFirstAction(): void {
  guard(() => {
    void defaultTracker().event("first_action").catch(() => {});
  });
}

export function trackNamed(name: Extract<EventName, "season_complete" | "draft_complete" | "trade_made" | "share_card_click">): void {
  guard(() => {
    void defaultTracker().event(name).catch(() => {});
  });
}

export function bindSessionLifecycle(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  const end = () => {
    guard(() => {
      void defaultTracker().sessionEnd().catch(() => {});
    });
  };
  const onHide = () => {
    if (document.visibilityState === "hidden") end();
  };
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", end);
  return () => {
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", end);
  };
}

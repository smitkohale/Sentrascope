const SESSION_KEY = "sentra_session_id";
const isDev = import.meta.env.DEV;
const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export interface LogPayload {
  eventType: string;
  category: string;
  action: string;
  metadata?: Record<string, unknown>;
  userId?: number;
  path?: string;
}

export function logEvent(payload: LogPayload): void {
  if (isDev) {
    console.debug(
      `%c[${payload.category}] ${payload.action}`,
      "color:#38bdf8;font-weight:bold",
      payload.metadata ?? "",
    );
  }

  const body = JSON.stringify({
    ...payload,
    sessionId: getSessionId(),
    path: payload.path ?? window.location.pathname,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${API_BASE}/api/logs/event`,
        new Blob([body], { type: "application/json" }),
      );
    } else {
      fetch(`${API_BASE}/api/logs/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // fire-and-forget
  }
}

export const log = {
  pageView: (page: string, metadata?: Record<string, unknown>) =>
    logEvent({ eventType: "page_view", category: "navigation", action: `view:${page}`, metadata }),

  auth: (action: string, metadata?: Record<string, unknown>) =>
    logEvent({ eventType: "auth", category: "authentication", action, metadata }),

  chat: (action: string, metadata?: Record<string, unknown>) =>
    logEvent({ eventType: "chat", category: "bot_interaction", action, metadata }),

  dashboard: (action: string, metadata?: Record<string, unknown>) =>
    logEvent({ eventType: "dashboard", category: "user_action", action, metadata }),

  feature: (feature: string, action: string, metadata?: Record<string, unknown>) =>
    logEvent({ eventType: "feature_use", category: feature, action, metadata }),

  error: (action: string, metadata?: Record<string, unknown>) =>
    logEvent({ eventType: "error", category: "application_error", action, metadata }),
};

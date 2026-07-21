import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const SESSION_KEY = "sentra_session_id";
function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const _originalFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : (input as Request).url;
  if (url.startsWith("/api/")) {
    const headers = new Headers((init?.headers as HeadersInit) ?? {});
    headers.set("x-session-id", getOrCreateSessionId());
    return _originalFetch(input, { ...init, headers });
  }
  return _originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);

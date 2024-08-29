import nprogress from "nprogress";
import "nprogress/nprogress.css";

function DOMEnabled(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

let timer: NodeJS.Timeout | null = null;
let state: "loading" | "stop" | undefined;
let activeRequests = 0;
const delay = 800;

function load() {
  if (state === "loading") return;
  state = "loading";
  timer = setTimeout(() => {
    nprogress.start();
  }, delay); // chỉ hiển thị nếu quá delay
}

function stop() {
  if (activeRequests > 0) return;
  state = "stop";
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  nprogress.done();
}

if (DOMEnabled()) {
  const _fetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    if (activeRequests === 0) load();
    activeRequests++;
    try {
      const result = await _fetch(input, init);
      return result;
    } catch (ex) {
      return Promise.reject(ex);
    } finally {
      activeRequests -= 1;
      if (activeRequests === 0) stop();
    }
  };
}

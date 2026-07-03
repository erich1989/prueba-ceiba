const DEFAULT_INTERVAL_MINUTES = 10;
const REQUEST_TIMEOUT_MS = 60000;

async function pingOnce(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    console.log(`✓ [keep-alive] Ping ${url} → ${res.status}`);
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'timeout' : error.message;
    console.warn(`⚠ [keep-alive] Ping ${url} falló: ${reason}`);
  } finally {
    clearTimeout(timeout);
  }
}

function startKeepAlive() {
  const url = process.env.KEEPALIVE_URL;

  if (!url) {
    return null;
  }

  const minutes = Number(process.env.KEEPALIVE_INTERVAL_MINUTES) || DEFAULT_INTERVAL_MINUTES;
  const intervalMs = minutes * 60 * 1000;

  console.log(`✓ [keep-alive] Activo: ping a ${url} cada ${minutes} min`);

  const timer = setInterval(() => pingOnce(url), intervalMs);
  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  return timer;
}

module.exports = { startKeepAlive, pingOnce };

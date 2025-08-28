// server/middleware/requestLogger.js
export default function requestLogger(req, res, next) {
  try {
    const bodyJson = req.body ? JSON.stringify(req.body) : undefined;
    const bodyInfo = { present: !!req.body, length: bodyJson ? bodyJson.length : 0 };
    console.log('[REQ]', JSON.stringify({ method: req.method, url: req.url, bodyInfo }));
  } catch (e) {
    console.log('[REQ] logging failed', e);
  }
  next();
}

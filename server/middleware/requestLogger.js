// server/middleware/requestLogger.js
export default function requestLogger(req, res, next) {
  // Only log small/safe info
  const safeHeaders = {
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent'],
    'content-length': req.headers['content-length']
  };

  // Avoid dumping huge bodies: log size + allowed keys only
  const rawBody = req.body;
  let bodyInfo = {};
  if (rawBody && typeof rawBody === 'object') {
    const keys = Object.keys(rawBody);
    bodyInfo.keys = keys;
    bodyInfo.estimatedSize = Buffer.byteLength(JSON.stringify(rawBody)).toString() + ' bytes';
    // For login we only care about "email"
    if (typeof rawBody.email === 'string') {
      bodyInfo.emailPreview = rawBody.email.slice(0, 64);
    }
  } else {
    bodyInfo.type = typeof rawBody;
  }

  console.log('[LOGIN REQ]',
    JSON.stringify({
      method: req.method,
      url: req.originalUrl,
      headers: safeHeaders,
      bodyInfo
    })
  );
  next();
}


const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  // always log to console
  console.error(`[ERROR] ${status} - ${message}`);
  if (err.stack) console.error(err.stack);

  // append stack to log file for capture by tooling
  try {
    const logPath = path.join(__dirname, '../../error.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${status} ${message}\n${err.stack || ''}\n\n`);
  } catch (writeErr) {
    console.error('Failed to write error log', writeErr);
  }

  return res.status(status).json({
    ok: false,
    status,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

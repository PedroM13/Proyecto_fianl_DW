module.exports = function adminAuth(req, res, next) {
  const required = process.env.ADMIN_SECRET;
  if (!required) {
    // If not configured, allow free access (for simplicity in demos)
    return next();
  }
  const provided = req.header('x-admin-secret');
  if (provided && provided === required) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: missing or invalid admin secret' });
};

module.exports = function requireAuth(req, res, next) {
  // req.session 是 express-session 掛上去的
  // 如果登入成功，會設定 req.session.userId
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // 有 userId 就放行
  next()
}

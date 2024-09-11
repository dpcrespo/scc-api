export const verifyAdmin = (req, res, next) => {
  if (req.role_id === 1) {
    return next()
  }

  return res.status(403).json({ error: 'Unauthorized only admin user' })
}

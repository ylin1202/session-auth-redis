const db = require('../db/database')

function createUser(email, passwordHash) {
  try {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash)
      VALUES (?, ?)
    `)

    const result = stmt.run(email, passwordHash)

    return {
      id: result.lastInsertRowid,
      email
    }
  } catch (err) {
    // SQLite 重複鍵錯誤
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      const error = new Error('EMAIL_ALREADY_EXISTS')
      error.status = 409
      throw error
    }

    // 其他未知錯誤
    err.status = 500
    throw err
  }
}

function findByEmail(email) {
  const stmt = db.prepare(`
    SELECT id, email, password_hash
    FROM users
    WHERE email = ?
  `)

  const user = stmt.get(email)

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    passwordHash: user.password_hash
  }
}

module.exports = { createUser, findByEmail }

module.exports = {
  createUser,
  findByEmail
}

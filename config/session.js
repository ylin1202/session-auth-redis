const session = require('express-session')
const connectRedis = require('connect-redis')

const { redisClient } = require('./redis')

const RedisStore = connectRedis.RedisStore

function sessionMiddleware() {
  // 建立 RedisStore
  const store = new RedisStore({ client: redisClient })

  // 回傳一個 session middleware，給 app.use() 使用
  return session({
    // 設定 cookie 的名字
    name: 'sid',

    // session 資料放 Redis
    store,

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    // cookie 設定（存在使用者瀏覽器）, session 資料在 Redis
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false,
      sameSite: 'lax'
    },
    rolling: true // 每次有請求就重設 cookie 的 maxAge（延長登入時間）
  })
}

module.exports = sessionMiddleware

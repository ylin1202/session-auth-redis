require('dotenv').config()

const express = require('express')
const sessionMiddleware = require('./config/session')
const { connectRedis } = require('./config/redis')

const authRoutes = require('./routes/auth')
const requireAuth = require('./middleware/requireAuth')

const app = express()

// 解析 JSON body
app.use(express.json())

// 先連 Redis
connectRedis()

// 掛上 session middleware（沒這行就沒有 req.session）
app.use(sessionMiddleware())

// auth routes
app.use('/auth', authRoutes)

// 測試用的保護路由
app.get('/profile', requireAuth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    userId: req.session.userId
  })
})

module.exports = app

const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const router = express.Router()

// 註冊
router.post('/register', async (req, res) => {
    // 從 request body 取出 email 和 password
    const { email, password } = req.body

    // 如果沒有 email 或 password，直接拒絕
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        })
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        // 嘗試建立新使用者（寫入 SQLite）
        // 如果 email 重複，這行會丟出錯誤
        const user = User.createUser(email, passwordHash)

        // 建立成功
        res.status(201).json({
            message: 'Registered',
            user
        })
    } catch (err) {
        // 如果是在 Model 層定義的「Email 已存在」錯誤
        if (err.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({
                message: 'Email already registered'
            })
        }

        // 其他未知錯誤（例如 DB 壞掉）印出來給後端看
        console.error(err)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
})

// 登入
router.post('/login', async (req, res) => {
    const { email, password } = req.body
  
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }
  
    // 從資料庫找使用者（用 email）
    const user = User.findByEmail(email)
  
    // 如果找不到使用者，統一回傳登入失敗，避免帳號被猜測
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }
  
    // 密碼比對
    const ok = await bcrypt.compare(password, user.passwordHash)
  
    // 密碼不正確
    if (!ok) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }
  
    // 登入成功
    // 把 userId 存進 session
    req.session.userId = user.id
  
    // 回傳登入成功
    res.json({
      message: 'Logged in',
      user: {
        id: user.id,
        email: user.email
      }
    })
  })
  

// 登出
router.post('/logout', (req, res) => {
    // destroy：把 server-side session 刪掉（Redis 也會刪）
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' })
        }

        // 清掉 cookie（讓瀏覽器不要再帶 sid）
        res.clearCookie('sid')
        res.json({ message: 'Logged out' })
    })
})

module.exports = router

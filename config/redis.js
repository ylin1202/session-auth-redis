const { createClient } = require('redis')

const redisUrl = process.env.REDIS_URL

// 建立 client
const redisClient = createClient({ url: redisUrl })

// 監聽錯誤事件
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

// 用 async function 連線
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
    console.log('Redis connected')
  }
}

// - redisClient 給 session store 用
// - connectRedis 給 app 啟動時先連線用
module.exports = { redisClient, connectRedis }

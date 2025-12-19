# Session-Based Authentication System with Redis and SQLite

A production-style backend authentication system built with Node.js and Express.  
This project demonstrates secure session-based authentication using Redis as a centralized session store and SQLite for persistent user data storage.

The system is designed with stateless backend servers, allowing horizontal scalability across multiple server instances.


## ✨ Features

- Session-based authentication using `express-session`
- Redis-backed session storage (Docker-based)
- Persistent user storage with SQLite
- Secure password hashing with bcrypt
- Automatic session expiration (TTL)
- Logout with session invalidation
- Duplicate email registration protection
- Proper HTTP status codes and error handling
- Multi-server support with shared session state


## 🏗 Architecture Overview

```text
Client (Browser / curl)
        |
        |  Cookie (session ID)
        v
Node.js / Express Server
        |
        |-- Redis   (Session Store)
        |
        `-- SQLite  (User Database)
```

- Cookies store only the session ID
- Session data is stored server-side in Redis
- User credentials are persisted in SQLite
- Backend servers are stateless and interchangeable

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker
- npm


### 1. Clone the Repository

```bash
git clone https://github.com/your-username/session-auth-redis.git
cd session-auth-redis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Redis (Docker)

```bash
docker run -d --name redis -p 6379:6379 redis:7
```

### 4. Environment Variables
Create a `.env` file in the project root:

```text
SESSION_SECRET=your-session-secret
REDIS_URL=redis://localhost:6379
```

### 5. Start the Server

```bash
npm run dev
```

Server runs at:
```text
http://localhost:3000
```

## 🧪 API Endpoints

### 1. Register

```text
POST /auth/register

{
  "email": "user@example.com",
  "password": "123456"
}
```

### 2. Login

```text
POST /auth/login

{
  "email": "user@example.com",
  "password": "123456"
}
```

### 3. Protected Route

Requires a valid session cookie.

```text
GET /profile
```

### 4. Logout

Requires a valid session cookie.

```text
POST /auth/logout
```

## 🔁 Session Management

- Sessions are stored in Redis with a configurable TTL
- Redis automatically removes expired sessions
- Logout explicitly destroys the session
- All server instances share the same session store



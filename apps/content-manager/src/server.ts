import express from 'express'
import payload from 'payload'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3001', 'http://localhost:3000', 'https://app.vibecodedbyx.com'],
  credentials: true,
}

app.use(cors(corsOptions))

// Serve static files (frontend, media)
app.use('/media', express.static(path.resolve(dirname, '../media')))
app.use(express.static(path.resolve(dirname, '../public')))

// Initialize Payload
const start = async () => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      express: app,
      onInit: async () => {
        payload.logger.info(`\n✅ Payload CMS initialized successfully!`)
        payload.logger.info(`📚 Admin Panel: ${payload.getAdminURL()}`)
        payload.logger.info(`🌐 API Docs: ${payload.getAdminURL()}/api-docs`)
        payload.logger.info(`\n👉 Create your first admin user at: ${payload.getAdminURL()}`)
      },
    })

    // Serve frontend at root
    app.get('/', (req, res) => {
      res.sendFile(path.resolve(dirname, '../index.html'))
    })

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      })
    })

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`)
      console.log(`📚 Admin: http://localhost:${PORT}/admin`)
      console.log(`🌐 Frontend: http://localhost:${PORT}\n`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received, shutting down gracefully...')
  process.exit(0)
})

start()

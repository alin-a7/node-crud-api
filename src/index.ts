import { createServer } from 'node:http'
import 'dotenv/config'

const port = process.env.PORT || 3000

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello from Node.js + TypeScript!' }))
})

server.listen(port, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${port}`)
})

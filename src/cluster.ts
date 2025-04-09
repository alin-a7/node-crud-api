import 'dotenv/config'

import { fork } from 'node:child_process'
import cluster from 'node:cluster'
import http from 'node:http'
import os from 'node:os'

const BASE_PORT = Number(process.env.PORT)
const numCPUs = os.availableParallelism()
const workerPorts: number[] = []

let currentIndex = 0

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`)
  
  // Running workers on different ports
  for (let i = 1; i < numCPUs; i++) {
    const port = BASE_PORT + i
    workerPorts.push(port)
    fork('./src/worker.ts', [], {
      env: { ...process.env, PORT: port.toString() },
    })
  }

  // Load balancer on the BASE_PORT
  const server = http.createServer((req, res) => {
    const targetPort = workerPorts[currentIndex]
    currentIndex = (currentIndex + 1) % workerPorts.length

    const proxyReq = http.request(
      {
        hostname: 'localhost',
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers)
        proxyRes.pipe(res, { end: true })
      },
    )
    req.pipe(proxyReq, { end: true })
  })
  server.listen(BASE_PORT, () => {
    console.log(`Load balancer listening on port ${BASE_PORT}`)
  })
}

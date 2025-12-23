import { createServer } from 'http'

import { randomUUID } from 'crypto'
import request from 'supertest'

import Application from '@/framework/Application'
import { jsonMiddleware, urlMiddleware } from '@/framework/middleware'

import { ERROR_MESSAGES } from '@/constants'

import { AppDataSource } from '@/typeorm.config'
import { userRouter } from '@/users'

let app: Application
let server: ReturnType<typeof createServer>
let userId: string

const PORT = Number(process.env.PORT) || 3000
const BASE_URL = process.env.BASE_URL || 'http://localhost'

beforeAll(async () => {
  app = new Application()
  app.use(jsonMiddleware)
  app.use(urlMiddleware(`${BASE_URL}:${PORT}`))

  app.addRouter(userRouter)

  await AppDataSource.initialize()

  server = createServer((req, res) => {
    app.getServer().emit('request', req, res)
  })
})

afterAll(async () => {
  await AppDataSource.destroy()
})

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return empty array initially', async () => {
      const res = await request(server).get('/api/users')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('POST /api/users', () => {
    it('should create new user and return it', async () => {
      const res = await createUser()

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        username: 'Test User',
        age: 30,
        hobbies: ['reading', 'coding'],
      })

      userId = res.body.id
      expect(userId).toBeDefined()
    })

    it('should validate required fields', async () => {
      const testCases = [
        {
          body: { age: 30, hobbies: ['reading'] },
          message: ERROR_MESSAGES.fieldRequired('username'),
        },
        {
          body: { username: 'John', hobbies: ['reading'] },
          message: ERROR_MESSAGES.fieldRequired('age'),
        },
        {
          body: { username: 'John', age: 20 },
          message: ERROR_MESSAGES.fieldRequired('hobbies'),
        },
      ]

      for (const { body, message } of testCases) {
        const res = await request(server).post('/api/users').send(body)
        expect(res.status).toBe(400)
        expect(res.body.message).toBe(message)
      }
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return created user', async () => {
      const res = await request(server).get(`/api/users/${userId}`)
      expect(res.status).toBe(200)
      expect(res.body.id).toBe(userId)
    })

    it('should return 400 for invalid user id (not uuid)', async () => {
      const res = await request(server).get(`/api/users/some-invalid-id`)
      expect(res.status).toBe(400)
      expect(res.body.message).toBe(ERROR_MESSAGES.invalidUserId)
    })

    it('should return 404 for non-existent user', async () => {
      const res = await request(server).get(`/api/users/${randomUUID()}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe(ERROR_MESSAGES.userNotFound)
    })
  })

  describe('PUT /api/users/:id', () => {
    it('should update user data', async () => {
      const updated = {
        username: 'Updated User',
        age: 25,
        hobbies: ['gaming'],
      }

      const res = await request(server).put(`/api/users/${userId}`).send(updated)
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ ...updated, id: userId })
    })

    it('should validate hobbies is an array', async () => {
      const res = await request(server)
        .put(`/api/users/${userId}`)
        .send({ hobbies: 'not-an-array' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe(ERROR_MESSAGES.fieldIsArray('hobbies'))
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const res = await request(server).delete(`/api/users/${userId}`)
      expect(res.status).toBe(204)
    })

    it('should return 404 for deleted user', async () => {
      const res = await request(server).get(`/api/users/${userId}`)
      expect(res.status).toBe(404)
      expect(res.body.message).toBe(ERROR_MESSAGES.userNotFound)
    })
  })

  describe('GET unknown endpoint', () => {
    it('should return 404 and human-friendly message', async () => {
      const res = await request(server).get('/some-non/existing/resource')
      expect(res.status).toBe(404)
      expect(res.body.message).toBe(ERROR_MESSAGES.endpointNotFound)
    })
  })
})

// Helpers to create user
const createUser = async () =>
  request(server)
    .post('/api/users')
    .send({
      username: 'Test User',
      age: 30,
      hobbies: ['reading', 'coding'],
    })

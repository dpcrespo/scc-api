import jwt from 'jsonwebtoken'
import { createClient } from 'redis'
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../config.js'

// redis
const redisClient = createClient({
  port: 6379,
  host: '127.0.0.1'
})

redisClient.on('error', err => console.log('Redis Client Error', err))

await redisClient.connect()

export const signAccessToken = (user) => {
  return new Promise((resolve, reject) =>
    jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  )
}

export const verifyAccessToken = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send('You are unauthorized')

  const authHeader = req.headers.authorization
  const bearerToken = authHeader.split(' ')
  const token = bearerToken[1]

  req.session = { user: null }

  jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, (err, payload) => {
    if (err) return res.status(401).send('You are unauthorized')
    req.session.user = payload
  })

  next()
}

export const signRefreshToken = (user) => {
  return new Promise((resolve, reject) =>
    jwt.sign(
      {},
      REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: '7d',
        issuer: 'clubtriatlonbenalmadena.es',
        audience: user.email
      },
      (err, token) => {
        if (err) reject(err)
        redisClient.SET(user.email, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          console.log(reply)
          if (err) reject(err)
        })
        resolve(token)
      }
    )
  )
}

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)
    if (payload.aud) {
      const userEmail = payload.aud
      const token = await redisClient.GET(userEmail)
      if (refreshToken === token) return userEmail
      throw new Error('Invalid token')
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteRefreshToken = async (userEmail) => {
  try {
    return await redisClient.DEL(userEmail)
  } catch (err) {
    throw new Error('Internal server')
  }
}

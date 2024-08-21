import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRespository } from './user-repository.js'

import userRouter from './routes/user.js'

// const __dirname = dirname(fileURLToPath(import.meta.url))

export const createApp = ({ userModel }) => {
  const app = express()

  app.set('view engine', 'ejs')
  app.use(cors())
  app.disable('x-powered-by')
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cookieParser())
  app.use(express.static(path.join(import.meta.dirname, '/public')))
  // verify jwt token
  app.use((req, res, next) => {
    const token = req.cookies.access_token

    req.session = { user: null }

    try {
      const data = jwt.verify(token, SECRET_JWT_KEY)
      req.session.user = data
    } catch {}

    next()
  })

  app.get('/', (req, res) => {
    const { user } = req.session
    res.render('index', user)
  })

  app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await UserRespository.login({ username, password })
      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_JWT_KEY,
        { expiresIn: '1h' }
      )
      res
        .cookie('access_token', token, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor y no por javascript
          secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
          sameSite: true, // la cookie solo se puede acceder en el mismo dominio
          maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
        })
        .send({ user })
    } catch (error) {
      res.status(401).send(error.message)
    }
  })

  app.post('/register', async (req, res) => {
    const { username, password } = req.body
  
    try {
      const id = await UserRespository.create({ username, password })
      res.send({ id })
    } catch (error) {
      res.status(400).send(error.message)
    }
  })

  app.post('/logout', (req, res) => {
    res
      .clearCookie('access_token')
      .json({ message: 'Logout successful' })
  })

  app.get('/protected', (req, res) => {
    const { user } = req.session
    if (!user) {
      res.status(403).send('Access not Authorized')
    }
    res.render('protected', user)
  })

  app.use('/users', userRouter({ userModel }))

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

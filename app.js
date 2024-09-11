import express from 'express'

import cors from 'cors'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import { PORT } from './config.js'
// import { verifyAccessToken } from './middlewares/jwt.middleware.js'

import createUserRouter from './routes/user.routes.js'
import createAuthRouter from './routes/auth.routes.js'

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
  // app.use(verifyAccessToken)

  app.get('/', (req, res) => {
    console.log(req)
    // const { user } = req.session
    res.render('index')
  })

  app.use('/auth', createAuthRouter({ userModel }))

  app.get('/protected', (req, res) => {
    const { user } = req.session
    if (!user) {
      res.status(403).send('Access not Authorized')
    }
    res.render('protected', user)
  })

  app.use('/users', createUserRouter({ userModel }))

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

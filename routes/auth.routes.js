import { Router } from 'express'
import { AuthHandler } from '../handlers/auth.handler.js'

const createAuthRouter = ({ userModel }) => {
  const authRouter = Router()

  const authHandler = new AuthHandler({ userModel })

  authRouter.post('/login', authHandler.login)
  authRouter.post('/register', authHandler.register)
  authRouter.post('/logout', authHandler.logout)
  authRouter.post('/refresh-token', authHandler.refreshToken)

  return authRouter
}

export default createAuthRouter

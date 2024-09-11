import { Router } from 'express'
import { UserHandler } from '../handlers/users.handler.js'
import { verifyAccessToken } from '../middlewares/jwt.middleware.js'

const createUserRouter = ({ userModel }) => {
  const userHandler = new UserHandler({ userModel })

  const usersRouter = Router()

  usersRouter.route('/')
    .get(verifyAccessToken, userHandler.getAllUsers)
    .patch(userHandler.updateUser)
    .delete(userHandler.deleteUser)

  usersRouter.get('/:id', userHandler.getUserById)

  return usersRouter
}

export default createUserRouter

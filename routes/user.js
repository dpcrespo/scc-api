import { Router } from 'express'
import { UserController } from '../handlers/users.js'

const createUserRouter = ({ userModel }) => {
  const userController = new UserController({ userModel })

  const usersRouter = Router()

  usersRouter.route('/')
    .get(userController.getAllUsers)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

  usersRouter.get('/:id', userController.getUserById)

  return usersRouter
}

export default createUserRouter

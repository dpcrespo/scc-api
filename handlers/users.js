import { validatePartialUser } from '../schemas/user.js'

export class UserController {
  constructor ({ UserModel }) {
    this.userModel = UserModel
  }

  getAllUsers = async (req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }

  updateUser = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    if (!id) {
      return res.status(404).json({ message: 'User not found' })
    }

    const updatedUser = await this.userModel.update({ id, input: result.data })
    return res.json(updatedUser)
  }

  deleteUser = async (req, res) => {
    const { id } = req.params
    const deletedUser = await this.userModel.delete({ id })

    res.json(deletedUser)
  }

  getUserById = async (req, res) => {
    const { id } = req.query
    const user = await this.userModel.getById({ id })
    res.json(user)
  }
}

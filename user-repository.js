import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRespository {
  static async create ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    // 2. Asegurarse que el username no existe
    const user = User.findOne(({ username }))
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    const user = User.findOne({ username })
    if (!user) throw new Error('username does not exist')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password is invalid')

    return {
      username: user.username
    }
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('usersname must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters long')
  }
}

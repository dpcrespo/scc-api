import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'dan',
  password: 'DarDar$1920',
  database: 'ctb'
}

const connection = await mysql.createConnection(config)

export class UserModel {
  static getAll = async () => {
    const [users] = await connection.query(
      'SELECT first_name, first_surname, second_surname, date_of_birth, genre,  BIN_TO_UUID(id) id FROM User;'
    )
    console.log(users)

    if (users.length === 0) return []

    return users
  }

  static getById = async ({ id }) => {
    const [users] = await connection.query(
      `SELECT first_name, second_name, date_of_birth,  BIN_TO_UUID(id) id 
       FROM User 
       WHERE user_id = ?;`, [id]
    )

    if (users.length === 0) return []

    return users[0]
  }

  static create = async ({ input }) => {
    const {
      email,
      password
    } = input
    Validation.email(email)
    Validation.password(password)

    const user = await connection.query(
      'SELECT email FROM User WHERE LOWER(email) = ?;', [email]
    )

    if (user[0].length > 0) throw new Error('this email already exists')

    const [uuidresult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidresult

    const hashedPassword = await bcrypt.hash(password, 10)

    await connection.query(
      'INSERT INTO User (id, email, password) VALUES (UUID_TO_BIN(?),?,?);',
      [uuid, email, hashedPassword]
    )

    const newUser = await connection.query(
      'SELECT BIN_TO_UUID(id) id, email, role_id FROM User WHERE id = UUID_TO_BIN(?);',
      [uuid]
    )

    return newUser[0]
  }

  static update = async ({ id, input }) => {
  }

  static delete = async ({ id }) => {
    await connection.query(
      'DELETE FROM user WHERE user_id = UUID_TO_BIN(?);', [id]
    )

    return true
  }

  static async login ({ email, password }) {
    const user = await connection.query(
      'SELECT password, email FROM User WHERE email = ?;', [email]
    )

    if (user[0].length === 0) throw new Error('User does not exist')

    const isValid = await bcrypt.compare(password, user[0][0].password)
    if (!isValid) throw new Error('Username/Password is invalid')

    return {
      email: user[0][0].email
    }
  }
}

class Validation {
  static email (email) {
    if (typeof email !== 'string') throw new Error('usersname must be a string')
    if (email.length < 3) throw new Error('username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters long')
  }
}

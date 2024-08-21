import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dandan2604',
  database: 'ctb'
}

const connection = await mysql.createConnection(config)

export class UserModel {
  static getAll = async () => {
    const [users] = await connection.query(
      'SELECT name, first_name, second_name, date_of_birth, genre,  BIN_TO_UUID(id) id FROM user;'
    )

    if (users.length === 0) return []

    return users
  }

  static getByid = async ({ id }) => {
    const [users] = await connection.query(
      `SELECT first_name, second_name, date_of_birth,  BIN_TO_UUID(id) id 
       FROM user 
       WHERE user_id = ?;`, [id]
    )

    if (users.length === 0) return []

    return users[0]
  }

  static create = async ({ input }) => {
    const {
      password,
      firstName,
      firstSurname,
      secondSurname,
      email
    } = input

    const [uuidresult] = connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidresult

    await connection.query(
      'INSERT INTO user (user_id, password, first_name, first_surname, second_surname, email) VALUES (UUID_TO_BIN(?),?,?,?,?);',
      [uuid, password, firstName, firstSurname, secondSurname, email]
    )

    const user = connection.query(
      'SELECT BIN_TO_UUID(user_id) id FROM user WHERE user_id = UUID_TO_BIN(?);',
      [uuid]
    )

    return user[0]
  }

  static update = async ({ id, input }) => {
  }

  static delete = async ({ id }) => {
    await connection.query(
      'DELETE FROM user WHERE user_id = UUID_TO_BIN(?);', [id]
    )

    return true
  }
}

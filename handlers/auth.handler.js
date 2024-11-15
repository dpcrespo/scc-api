import { signAccessToken, signRefreshToken, verifyRefreshToken, deleteRefreshToken } from '../middlewares/jwt.middleware.js'

export class AuthHandler {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  login = async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await this.userModel.login({ email, password })
      const accessToken = await signAccessToken(user)
      const refreshToken = await signRefreshToken(user)
      res
        .cookie('access_token', accessToken, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor y no por javascript
          secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
          sameSite: true, // la cookie solo se puede acceder en el mismo dominio
          maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor y no por javascript
          secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
          sameSite: true, // la cookie solo se puede acceder en el mismo dominio
          maxAge: 1000 * 60 * 60 * 24 * 7 // la cookie tiene un tiempo de validez de 7 dias
        })
        .send({ user })
    } catch (error) {
      res.status(401).send(error.message)
    }
  }

  register = async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await this.userModel.create({ input: { email, password } })
      const accessToken = await signAccessToken(user[0])
      const refreshToken = await signRefreshToken(user[0])
      res
        .cookie('access_token', accessToken, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor y no por javascript
          secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
          sameSite: true, // la cookie solo se puede acceder en el mismo dominio
          maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
        })
        .cookie('refresh_token', refreshToken, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor y no por javascript
          secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
          sameSite: true, // la cookie solo se puede acceder en el mismo dominio
          maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
        })
        .send({ user })
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  logout = async (req, res) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) res.status(400).send('Bad Request')
      const userEmail = await verifyRefreshToken(refreshToken)
      // const result = await deleteRefreshToken(userEmail)
      console.log(userEmail)
      console.log(userEmail.name)
      console.log(userEmail.message)
      res
        .status(204)
        .clearCookie('access_token')
        .clearCookie('refresh_token')
        .send('logout')
    } catch (err) {
      res.status(400).send('Bad Request')
    }
  }

  refreshToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) return res.status(400).send('Refresh token is missing')
    const userId = await verifyRefreshToken(refreshToken)

    const accessToken = await signAccessToken(userId)
    const newRefreshToken = await signAccessToken(userId)
    res.send({ accessToken, refreshToken: newRefreshToken })
  }
}

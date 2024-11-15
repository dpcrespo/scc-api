import zod from 'zod'

const userSchema = zod.object({
  email: zod.string(),
  password: zod.string(),
  first_name: zod.string(),
  first_surname: zod.string(),
  second_surname: zod.string(),
  date_of_birth: zod.date(),
  document_id: zod.string(),
  genre: zod.enum(['Male', 'Female']),
  license: zod.string(),
  registered_id: zod.string(),
  phone_number: zod.string(),
  access_token: zod.string(),
  refresh_token: zod.string()
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

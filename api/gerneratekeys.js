import crypto from 'crypto'

const key1 = crypto.randomBytes(64).toString('hex')
const key2 = crypto.randomBytes(64).toString('hex')

console.table({ key1, key2 })

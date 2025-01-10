import { MongoClient } from 'mongodb'
const password = encodeURIComponent('wlfyd15643#')
const url = `mongodb+srv://jiyong0419:${password}@wholesome-gee.ccwio.mongodb.net/?retryWrites=true&w=majority&appName=Wholesome-Gee`
const options = { useNewUrlParser: true }
let connectDB

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {
    global._mongo = new MongoClient(url, options).connect()
  }
  connectDB = global._mongo
} else {
  connectDB = new MongoClient(url, options).connect()
}
export { connectDB }
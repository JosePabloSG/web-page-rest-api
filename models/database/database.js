// FIXME: CRUD terminado esperando para revision
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('DB-River-date')
    return database.collection('Data')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class WebModel {
  static async getAll () {
    const db = await connect()

    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connect()
    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deleteCount } = await db.deleteOne({ _id: objectId })
    return deleteCount > 0
  }
}

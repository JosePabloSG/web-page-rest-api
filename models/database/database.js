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

async function run () {
  try {
    // Connect the client to the server(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
run().catch(console.dir)

export class WebModel {
  static async getAll () {
    const db = await run()
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await run()
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await run()
    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async update ({ id, input }) {
    const db = await run()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }

  static async delete ({ id }) {
    const db = await run()
    const objectId = new ObjectId(id)
    const { deleteCount } = await db.deleteOne({ _id: objectId })
    return deleteCount > 0
  }
}

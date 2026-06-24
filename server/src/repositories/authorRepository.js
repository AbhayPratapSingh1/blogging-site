const COLLECTION = "authors"

export const findAll = (db) =>
  db.collection(COLLECTION).find().toArray()

export const findById = (db, id) =>
  db.collection(COLLECTION).findOne({ _id: id })

export const findByEmail = (db, email) =>
  db.collection(COLLECTION).findOne({ email })

export const create = (db, data) =>
  db.collection(COLLECTION).insertOne(data)

export const update = (db, id, data) =>
  db.collection(COLLECTION).updateOne({ _id: id }, { $set: { ...data, updatedAt: Date.now() } })

export const remove = (db, id) =>
  db.collection(COLLECTION).deleteOne({ _id: id })

const COLLECTION = "tags"

export const findAll = (db) =>
  db.collection(COLLECTION).find().toArray()

export const findBySiteId = (db, siteId) =>
  db.collection(COLLECTION).find({ siteId }).toArray()

export const findById = (db, id) =>
  db.collection(COLLECTION).findOne({ _id: id })

export const create = (db, data) =>
  db.collection(COLLECTION).insertOne(data)

export const update = (db, id, data) =>
  db.collection(COLLECTION).updateOne({ _id: id }, { $set: { ...data, updatedAt: Date.now() } })

export const remove = (db, id) =>
  db.collection(COLLECTION).deleteOne({ _id: id })

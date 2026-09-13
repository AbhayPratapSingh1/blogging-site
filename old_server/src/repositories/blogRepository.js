const COLLECTION = "blogs"

export const findAll = (db) =>
  db.collection(COLLECTION).find().toArray()

export const findBySlug = (db, slug) =>
  db.collection(COLLECTION).findOne({ slug })

export const findFeatured = (db) =>
  db.collection(COLLECTION).findOne({ featured: true })

export const findByAuthorId = (db, authorId) =>
  db.collection(COLLECTION).find({ "author.authorId": authorId }).toArray()

export const findByCategory = (db, category) =>
  db.collection(COLLECTION).find({ category: { $regex: new RegExp(`^${category}$`, "i") } }).toArray()

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

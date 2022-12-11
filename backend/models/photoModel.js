'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

// Get all photos by a specific user
const getAllPhotosByUser = async (userId, res) => {
  try {
    const sql =
      'SELECT photo_id, filename, photos.description, created_at, photos.user_id, coords, users.username, users.avatar FROM photos JOIN users ON photos.user_id = users.user_id WHERE photos.user_id = ?'
    const [rows] = await promisePool.query(sql, [userId])
    return rows
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

// Get 1 photo by the photo id
const getPhotoById = async (photoId, res) => {
  try {
    const sql =
      'SELECT photo_id, filename, photos.description, created_at, photos.user_id, coords, users.username, users.avatar FROM photos JOIN users ON photos.user_id = users.user_id WHERE photo_id = ?'
    const [rows] = await promisePool.query(sql, [photoId])
    return rows[0]
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

// Get 5 photos randomly
const getPhotoRandomly = async (res) => {
  try {
    const sql =
      'SELECT photo_id, filename, photos.description, created_at, photos.user_id, coords, users.username, users.avatar FROM photos JOIN users ON photos.user_id = users.user_id ORDER BY RAND()'
    const [rows] = await promisePool.query(sql)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

// Add new photo
const addPhoto = async (photo, res) => {
  try {
    const sql =
      'INSERT INTO photos(filename, description, user_id, coords) VALUE (?, ?, ?, ?)'
    const values = [
      photo.filename,
      photo.description,
      photo.userId,
      photo.coords
    ]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

// Delete 1 photo by id
const deletePhotosById = async (photoId, user, res) => {
  try {
    if (user.role == 0) {
      const value = [photoId]
      // Delete comments and likes that belongs to the photo (has photo_id as foreign key)
      const deleteComment = 'DELETE FROM comments WHERE photo_id = ?'
      await promisePool.query(deleteComment, value)
      const removeLike = 'DELETE FROM likes WHERE photo_id = ?'
      await promisePool.query(removeLike, value)
      // Delete photo
      const deletePhoto = 'DELETE FROM photos WHERE photo_id = ?'
      const [rows] = await promisePool.query(deletePhoto, value)
      return rows
    } else {
      const value = [photoId, user.user_id]
      const deleteComment = 'DELETE FROM comments WHERE photo_id = ?'
      await promisePool.query(deleteComment, value)
      const removeLike = 'DELETE FROM likes WHERE photo_id = ?'
      await promisePool.query(removeLike, value)
      const deleteTag = 'DELETE FROM photo_tags WHERE photo_id = ?'
      await promisePool.query(deleteTag, value)
      const deletePhoto =
        'DELETE FROM photos WHERE photo_id = ? and user_id = ?'
      const [rows] = await promisePool.query(deletePhoto, value)
      return rows
    }
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

// Modify photo description
// const updateDescriptionById = async (photo, user, res) => {
//   try {
//     if (user.role == 0) {
//       const sql = 'UPDATE photos SET description = ? WHERE photo_id = ?'
//       const values = [photo.description, photo.photoId]
//       const [rows] = await promisePool.query(sql, values)
//       return rows
//     } else {
//       const sql =
//         'UPDATE photos SET description = ? WHERE photo_id = ? and user_id = ?'
//       const values = [photo.description, photo.photoId, user.user_id]
//       const [rows] = await promisePool.query(sql, values)
//       return rows
//     }
//   } catch (e) {
//     res.status(500).json({ error: e.message })
//     console.error('error', e.message)
//   }
// }

// Modify photo description and photo
const updateDescriptionAndPhotoById = async (photo, user, res) => {
  try {
    const sql =
      'UPDATE photos SET description = ?, filename = ? WHERE photo_id = ? and user_id = ?'
    const values = [
      photo.description,
      photo.filename,
      photo.photoId,
      user.user_id
    ]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

// Get photo by user's follower
const getPhotoByFollower = async (userId, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM photos JOIN follows ON photos.user_id = follower_id JOIN users ON users.user_id = photos.user_id WHERE followee_id = ?',
      [userId]
    )
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

module.exports = {
  getAllPhotosByUser,
  getPhotoById,
  addPhoto,
  deletePhotosById,
  // updateDescriptionById,
  updateDescriptionAndPhotoById,
  getPhotoByFollower,
  getPhotoRandomly
}

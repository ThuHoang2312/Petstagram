'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

const getAllphotosByUser = async (res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM photos')
    return rows
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

const getPhotoById = async (photoId, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM photos WHERE photo_id = ?',
      [photoId]
    )
    return rows[0]
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const addPhoto = async (photo, res) => {
  try {
    const sql = 'INSERT INTO photos VALUE (0, ?, ?, ?, ?)'
    const values = [
      photo.filename,
      photo.description,
      photo.createAt,
      photo.userId
    ]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

const deletePhotosById = async (photoId, owner, role, res) => {
  try {
    if (role == 0) {
      const [rows] = await promisePool.query('', [photoId])
      return rows
    } else {
      const [rows] = await promisePool.query('', [photoId, owner])
      return rows
    }
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const updateDescriptionById = async (photo, res) => {
  try {
    const sql = 'UPDATE photos SET description = ? WHERE photo_id = ?'
    const values = [photo.description, photo.photoId]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

const updateDescriptionAndPhotoById = async (photo, res) => {
  try {
    const sql =
      'UPDATE photos SET description = ?, filename = ? WHERE photo_id = ?'
    const values = [photo.description, photo.filename, photo.photoId]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

const getPhotoByFollower = async (userId, followeeId, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT photo_id, filename, description, created_at, user_id FROM photos, follows WHERE user_id = follower_id and followee_id = ?',
      [userId, followeeId]
    )
    return rows[0]
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const addComment = async (comment, res) => {
  try {
    const sql = 'INSERT INTO comments VALUE (0, ?, ?, ?, ?)'
    const values = [
      comment.commentText,
      comment.createdAt,
      comment.photoId,
      comment.userId
    ]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

const deleteComment = async (photoId, userId, role, res) => {
  try {
    const sql = 'DELETE FROM comments WHERE id = ? and user_id = ?'
    const value = [photoId, userId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const editComment = async (comment, photoId, userId, res) => {
  try {
    const sql =
      'UPDATE comments SET comment_text = ? WHERE photo_id = ? and user_id = ?'
    const values = [comment.commentText, photoId, userId]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

const addLike = async (like, res) => {
  try {
    const sql = 'INSERT INTO likes VALUE (?, ?)'
    const values = [like.userId, like.photoId]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

const removeLike = async (photoId, userId, role, res) => {
  try {
    const sql = 'DELETE FROM likes WHERE user_id = ? and photo_id = ?'
    const value = [userId, photoId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

module.exports = {
  getAllphotosByUser,
  getPhotoById,
  addPhoto,
  deletePhotosById,
  updateDescriptionById,
  updateDescriptionAndPhotoById,
  getPhotoByFollower,
  addComment,
  addLike,
  removeLike,
  deleteComment,
  editComment
}


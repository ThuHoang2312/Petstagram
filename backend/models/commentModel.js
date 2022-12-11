'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

// Add new comment to photo
const addComment = async (comment, userId, photoId, res) => {
  try {
    const sql =
      'INSERT INTO comments(comment_text, photo_id, user_id) VALUE (?, ?, ?)'
    const values = [comment.comment, photoId, userId]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

// Delete comment
const deleteComment = async (commentId, user, res) => {
  try {
    if (user.role == 0) {
      const sql = 'DELETE FROM comments WHERE id = ?'
      const value = [commentId]
      const [rows] = await promisePool.query(sql, value)
      return rows
    } else {
      const sql = 'DELETE FROM comments WHERE id = ? and user_id = ?'
      const value = [commentId, user.user_id]
      const [rows] = await promisePool.query(sql, value)
      return rows
    }
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

// Modify comment
const editComment = async (comment, user, photoId, res) => {
  try {
    if (user.role == 0) {
      const sql =
        'UPDATE comments SET comment_text = ? WHERE id = ? and photo_id = ?'
      const values = [comment.commentText, comment.id, photoId]
      const [rows] = await promisePool.query(sql, values)
      return rows
    } else {
      const sql =
        'UPDATE comments SET comment_text = ? WHERE id = ? and photo_id = ? and user_id = ?'
      const values = [comment.commentText, comment.id, photoId, user.user_id]
      const [rows] = await promisePool.query(sql, values)
      return rows
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

// Get all comments belong in a photo
const getAllCommentsByPhoto = async (photoId, res) => {
  try {
    const sql =
      'SELECT comments.id, comments.user_id, comments.comment_text, comments.created_at, comments.photo_id, users.avatar, users.username FROM comments JOIN users ON users.user_id = comments.user_id WHERE photo_id = ?'
    const [rows] = await promisePool.query(sql, [photoId])
    return rows
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

module.exports = {
  addComment,
  deleteComment,
  editComment,
  getAllCommentsByPhoto
}

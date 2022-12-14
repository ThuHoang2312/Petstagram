'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

// Add like to photo
const addLike = async (userId, photoId, res) => {
  try {
    const sql = 'INSERT INTO likes VALUE (?, ?)'
    const values = [userId, photoId]
    const [result] = await promisePool.query(sql, values)
    return result
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// Remove like from photo
const removeLike = async (userId, photoId, res) => {
  try {
    const sql = 'DELETE FROM likes WHERE user_id = ? and photo_id = ?'
    const value = [userId, photoId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
  }
}


const getLikeStatusByPhotoId = async (userId, photoId, res) => {
  try {
    const sql = 'SELECT * FROM likes WHERE user_id = ? and photo_id = ?'
    const value = [userId, photoId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
  }
}

const getAllLikesByPhoto = async (photoId, res) => {
  try {
    const sql = 'SELECT * FROM likes WHERE photo_id = ?'
    const value = [photoId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
  }
}

module.exports = {
  addLike,
  removeLike,
  getLikeStatusByPhotoId,
  getAllLikesByPhoto
}
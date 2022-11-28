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
      photo.create_at,
      photo.user_id
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
    const values = [photo.description, photo.photo_id]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

const updateDescriptionAndPhotoById = async (photo, res) => {
  try {
    const sql = 'UPDATE photos SET description = ?, filename = ? WHERE photo_id = ?'
    const values = [photo.description, photo.filename, photo.photo_id]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.error('error', e.message)
  }
}

module.exports = {
  getAllphotosByUser,
  getPhotoById,
  addPhoto,
  deletePhotosById,
  updateDescriptionById,
  updateDescriptionAndPhotoById
}

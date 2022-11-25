'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

const getAllphotosByUser = async (res) => {
  try {
    const [rows] = await promisePool.query('')
    return rows
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

const getPhotoById = async (photoId, res) => {
  try {
    const [rows] = await promisePool.query('', [photoId])
    return rows[0]
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const addPhoto = async (photo, res) => {
  try {
    const sql = ''
    const values = []
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

const updatePhotoById = async (photo, owner, role, res) => {
  try {
    if (role == 0) {
      const sql = ""
      const values = []

      const [rows] = await promisePool.query(sql, values)
      return rows
    } else {
      const sql = ""
      const values = []
      const [rows] = await promisePool.query(sql, values)
      return rows
    }
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
  updatePhotoById
}

'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

const addTag = async (tagName, res) => {
  try {
    const sql = 'INSERT INTO tags (tag_name) VALUE (?)'
    const [result] = await promisePool.query(sql, tagName)
    return result
  } catch (error) {
    res.status(500).send(error.message)
    console.error('error', error.message)
  }
}

// const addTagWithPhoto = async (photoId, tagId, res) => {
//   try {
//     const sql = 'INSERT INTO photo_tags (photo_id, tag_id) VALUE (?, ?)'
//     const [result] = await promisePool.query(sql, [photoId, tagId])
//     return result
//   } catch (error) {
//     res.status(500).send(error.message)
//     console.error('error', error.message)
//   }
// }

const getTagName = async (tagName, res) => {
  try {
    const sql = 'SELECT * FROM tags WHERE tag_name = ?'
    const [result] = await promisePool.query(sql, tagName)
    return result
  } catch (error) {
    res.status(500).send(error.message)
    console.error('error', error.message)
  }
}

const getAllTags = async (res) => {
  try {
    const sql = 'SELECT tag_name FROM tags'
    const [result] = await promisePool.query(sql)
    return result
  } catch (error) {
    res.status(500).send(error.message)
    console.error('error', error.message)
  }
}

const getTagByPhoto = async (photoId, res) => {
  try {
    const sql =
      'SELECT tags.tag_id, tag_name, photo_id FROM tags JOIN photo_tags ON photo_tags.tag_id = tags.tag_id where photo_tags.photo_id = ?'
    const [result] = await promisePool.query(sql, photoId)
    return result
  } catch (error) {
    res.status(500).send(error.message)
    console.error('error', error.message)
  }
}

const deleteTag = async (tagId, res) => {
  try {
    await promisePool.query('DELETE FROM photo_tags WHERE tag_id = ?', tagId)
    const sql = 'DELETE FROM tags WHERE tag_id = ?'
    const [result] = await promisePool.query(sql, tagId)
    return result
  } catch (error) {
    res.status(500).send(error.message)
    console.error('error', error.message)
  }
}

module.exports = { addTag, getAllTags, deleteTag, getTagName, getTagByPhoto }

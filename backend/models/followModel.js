'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

// Add like to photo
const addFollow = async (followerId, followeeId, res) => {
  try {
    const sql = 'INSERT INTO follows VALUE (?, ?)'
    const values = [followerId, followeeId]
    const [result] = await promisePool.query(sql, values)
    return result
  } catch (e) {
    res.status(500).send(e.message)
    console.error('error', e.message)
  }
}

// Remove like from photo
const removeFollow = async (followerId, followeeId, res) => {
  try {
    const sql = 'DELETE FROM follows WHERE follower_id = ? and followee_id = ?'
    const value = [followerId, followeeId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}


const getFollowStatus = async (followerId, followeeId, res) => {
  try {
    const sql = 'SELECT * FROM likes  follower_id = ? and followee_id = ?'
    const value = [followerId, followeeId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const countFollowersByUser = async (userId, res) => {
  try {
    const sql = 'SELECT * FROM follows WHERE followee_id = ?'
    const value = [userId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

const countFollowingByUser = async (userId, res) => {
  try {
    const sql = 'SELECT * FROM follows WHERE follower_id = ?'
    const value = [userId]
    const [rows] = await promisePool.query(sql, value)
    return rows
  } catch (e) {
    res.status(404).send(e.message)
    console.error('error', e.message)
  }
}

module.exports = {
  getFollowStatus,
  addFollow,
  removeFollow,
  countFollowersByUser,
  countFollowingByUser
}
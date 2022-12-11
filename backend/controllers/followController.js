'use strict'
const followModel = require('../models/followModel')

// Add follow
const addFollow = async (req, res) => {
  const followeeId = req.params.followeeId
  await followModel.addFollow(req.user.user_id, followeeId, res)
  res.status(201).json({ message: 'Follow added' })
}

// Remove follow
const removeFollow = async (req, res) => {
  const followeeId = req.params.followeeId
  const result = await followModel.removeFollow(
    req.user.user_id,
    followeeId,
    res
  )
  if (result.affectedRows > 0) {
    res.json({ message: 'Follow removed' })
  }
}

// Checking if the user is follow by another user
const isUserFollowing = async (req, res) => {
  const followeeId = req.params.followeeId
  const result = await followModel.getFollowStatus(
    req.user.user_id,
    followeeId,
    res
  )
  if (result.length == 0) {
    res.json(false)
  } else {
    res.json(true)
  }
}

// Count user's followings
const countFollowers = async (req, res) => {
  const result = await followModel.countFollowersByUser(req.user.user_id, res)
  if (result) {
    res.json(result.length)
  } else {
    res.status(404).json({ message: 'error' })
  }
}

// Count user's followers
const countFollowings = async (req, res) => {
  const result = await followModel.countFollowingByUser(req.user.user_id, res)
  if (result) {
    res.json(result.length)
  } else {
    res.status(404).json({ message: 'error' })
  }
}

module.exports = {
  addFollow,
  isUserFollowing,
  countFollowers,
  countFollowings,
  removeFollow
}

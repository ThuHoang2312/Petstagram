'use strict'
const commentModel = require('../models/commentModel')
const { validationResult } = require('express-validator')

// Upload comment into a photo
const uploadComment = async (req, res) => {
  const errors = validationResult(req)
  console.log('validation errors', errors)
  if (errors.isEmpty()) {
    const comment = req.body
    const photoId = req.params.photoId
    // Get date and time when the user create the comment
    comment.createdAt = new Date()
    console.log('create a new comment: ', comment)
    const result = await commentModel.addComment(comment, req.user.user_id, photoId, res)
    res.status(201).json({ message: 'comment created', result })
  } else {
    res
      .status(400)
      .json({ message: 'comment creation failed', errors: errors.array() })
  }
}

// Modify an existing comment
const modifyComment = async (req, res) => {
  const errors = validationResult(req)
  console.log('validation errors', errors)
  if (errors.isEmpty()) {
    const comment = req.body
    const photoId = req.params.photoId
    const result = await commentModel.editComment(
      comment,
      req.user,
      photoId,
      res
    )
    if (result.affectedRows > 0) {
      res.json({ message: 'Comment modified' })
    }
  } else {
    res.status(401).json({ message: 'comment modify failed' })
  }
}

// Delete an existing comment
const removeComment = async (req, res) => {
  const errors = validationResult(req)
  console.log('validation errors', errors)
  if (errors.isEmpty()) {
    const comment = req.body
    const photoId = req.params.photoId
    const result = await commentModel.deleteComment(
      comment,
      req.user,
      photoId,
      res
    )
    if (result.affectedRows > 0) {
      res.json({ message: 'Comment modified' })
    }
  } else {
    res.status(401).json({ message: 'comment delete failed' })
  }
}

// Get all comments of a photo
const getAllCommentsByPhotoId = async (req, res) => {
  const cats = await commentModel.getAllCommentsByPhoto(req.params.photoId, res)
  res.json(cats)
}

module.exports = {
  uploadComment,
  modifyComment,
  removeComment,
  getAllCommentsByPhotoId
}



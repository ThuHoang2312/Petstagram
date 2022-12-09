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
    const result = await commentModel.editComment(
      comment,
      req.user,
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
    const commentId = req.params.commentId
    const result = await commentModel.deleteComment(
      commentId,
      req.user,
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
  const comments = await commentModel.getAllCommentsByPhoto(req.params.photoId, res)
  res.json(comments)
}

module.exports = {
  uploadComment,
  modifyComment,
  removeComment,
  getAllCommentsByPhotoId
}



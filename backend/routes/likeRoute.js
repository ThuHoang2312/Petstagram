const express = require('express')
const router = express.Router()

const likeController = require('../controllers/likeController')

router
  .post('/:photoId', likeController.addLike)
  .get('/user/:photoId', likeController.isPhotoLikedByUser)
  .get('/photo/:photoId', likeController.countLikesByPhoto)
  .delete('/:photoId', likeController.removeLike)


  module.exports = router
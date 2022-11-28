const express = require('express')
const router = express.Router()
const multer = require('multer')
// const { body } = require('express-validator')

const photoController = require('../controllers/photoController')

const fileFilter = (req, file, cb) => {
  const acceptedType = ['image/jpeg', 'image/png', 'image/gif']
  if (acceptedType.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ dest: 'uploads/', fileFilter })

router.get('/', photoController.getAllphotosByUser)
router.get('/:photoId', photoController.getPhotoById)
router.post('/', upload.single('photo'), photoController.uploadPhoto)
router.put('/:photoId', photoController.editDescription)
router.put('/:photoId', upload.single('photo'), photoController.editPhotoAndDescription)

module.exports = router

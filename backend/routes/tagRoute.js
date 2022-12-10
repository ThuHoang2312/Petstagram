const express = require('express')
const router = express.Router()

const tagController = require('../controllers/tagController')

router.post('', tagController.addTag).delete('/:tagId', tagController.deleteTag)

module.exports = router

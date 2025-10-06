
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.getHome);
router.get('/list-pages', controller.listPages);
router.post('/create-page', controller.createPage);
router.delete('/delete-page/:pageName', controller.deletePage);

module.exports = router;

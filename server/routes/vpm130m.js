const express = require('express');
const router = express.Router();
const controller = require('../controller/VPM130M_Controller');

router.post('/processMain', controller.processMain);

module.exports = router;
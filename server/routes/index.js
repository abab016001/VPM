const express = require('express');
const router = express.Router();

const VPM130M_Routes = require('./vpm130m');

router.use('/VMP130M_', VPM130M_Routes);

module.exports = router;
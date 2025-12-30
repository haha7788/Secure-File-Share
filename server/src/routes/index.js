const express = require('express');
const router = express.Router();

const uploadRoutes = require('./upload');
const downloadRoutes = require('./download');
const infoRoutes = require('./info');
const rawRoutes = require('./raw');

router.use('/upload', uploadRoutes);
router.use('/download', downloadRoutes);
router.use('/info', infoRoutes);
router.use('/raw', rawRoutes);

module.exports = router;
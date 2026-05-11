const express = require('express');
const { getNearbyServices, getServiceById, getAllServices, createService } = require('../controllers/serviceController');

const router = express.Router();

router.route('/')
  .get(getAllServices)
  .post(createService);

router.route('/nearby')
  .get(getNearbyServices);

router.route('/:id')
  .get(getServiceById);

module.exports = router;

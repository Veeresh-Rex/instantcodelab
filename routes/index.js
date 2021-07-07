var express = require('express');
var roomModal = require('../Model/roomModel');
var userModal = require('../Model/userModel');
var router = express.Router();
require('dotenv').config();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.clearCookie('jwt');
  res.render('index', { title: 'Express', page: 'Home', menuId: 'home' });
});

router.get('/create', (req, res) => {
  res.render('create', { page: 'Create', menuId: 'home' });
});
function verifyroom(req, res, next) {
  roomModal.findById(req.params.roomId, function (err, roomdata) {
    if (!roomdata) {
      console.log('No room found');
      res.render('404');
    } else {
      req.users = roomdata;
      next();
    }
  });
}

router.get('/admin/:roomId/:admincode', verifyroom, (req, res) => {
  console.log(req.params.admincode);
  roomModal.findById(req.params.roomId, (err, room) => {
    if (req.params.admincode === room.adminCode)
      return res.render('adminpanal', {
        page: 'admin',
        menuId: 'home',
        labname: room.labname,
        createdby: room.createdBy,
        language: room.languageId,
      });
    else {
      res.render('404');
    }
  });
});
function verifyAdmin(req, res, next) {
  roomModal.findById(req.params.roomId, (err, room) => {
    if (room) {
      if (req.params.admincode === room.adminCode) {
        req.labname = room.labname;
        next();
      } else {
        res.render('404');
      }
    } else {
      res.render('404');
    }
  });
}

router.get('/admin/:roomId/:admincode/report', verifyAdmin, (req, res) => {
  res.render('codereport', { labname: req.labname });
});

module.exports = router;

const express = require('express');
const router = express();
const jwt = require('jsonwebtoken');
var roomModal = require('../Model/roomModel');
require('dotenv').config();
// Middlewares
function queryCheck(req, res, next) {
  if (req.cookies.jwt && req.cookies.jwt !== undefined) {
    jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.redirect(`/room/join/${req.params.roomId}`);
      req.user = user;
      next();
    });
  } else {
    return res.redirect(`/room/join/${req.params.roomId}`);
  }
}

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

router.get('/joined/:roomId', queryCheck, verifyroom, (req, res) => {
  if (req.user.id === req.params.roomId)
    res.render('room', {
      title: 'Room',
      username: req.user.username,
      page: 'student',
      menuId: 'home',
      labname: req.users.labname,
      by: req.users.createdBy,
      language: req.users.languageId,
    });
  else res.redirect(`/room/join/${req.params.roomId}`);
});

router.get('/join/:roomId', verifyroom, (req, res) => {
  res.render('joinroom', { page: 'Join', menuId: 'home' });
});

module.exports = router;

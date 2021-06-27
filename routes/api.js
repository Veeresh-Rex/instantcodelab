var express = require('express');
var roomModal = require('../Model/roomModel');
var userModal = require('../Model/userModel');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// join room
router.post('/joinroom', (req, res) => {
  const password = req.body.password;
  const id = req.body.id;
  const username = req.body.username;
  roomModal.findById(id, function (err, room) {
    if (bcrypt.compareSync(password, room.password)) {
      // Add jwt
      jwt.sign(
        {
          id: room._id,
          username: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        },
        function (err, token) {
          if (!err) {
            res.cookie('jwt', token, {
              expires: new Date(Date.now() * 60000),
              httpOnly: true,
            });
            return res.status(200).json({
              status: 200,
              ok: true,
            });
          }
        }
      );
    } else {
      return res.send('Incorrect password').status(401);
    }
  });
});

// Delete any room
router.post('/deleteroom', (req, res) => {
  roomModal.deleteOne({ _id: req.body.id }, (err) => {
    if (!err)
      return res.json({
        status: 400,
        ok: true,
        data: {
          msg: 'delete successfully',
        },
      });
    res.json({
      status: 401,
      ok: true,
      data: {
        msg: 'Deleteing room error',
      },
    });
  });
});
// create room
router.post('/create', (req, res) => {
  let admincode = Math.random().toString(36).slice(2);
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.log(err);
      return res.json({
        status: 401,
        ok: true,
        data: {
          msg: 'Some Error Occured',
        },
      });
    }
    let Data = {
      labname: req.body.labname,
      password: hash,
      createdBy: req.body.by,
      adminCode: admincode,
      languageId: req.body.language,
    };
    let createRoom = new roomModal(Data);

    createRoom
      .save()
      .then((doc) => {
        //console.log(doc);
        return res.send({ admincode: doc.adminCode, id: doc._id }).json();
      })
      .catch((err) => {
        return res.send(err.errors).json();
      });
  });
});

// Code Submit by a user

router.post('/submitcode', (req, res) => {
  console.log(req.body);
  let data = new userModal({
    username: req.body.username,
    roomId: req.body.id,
    code: req.body.code,
  });
  data
    .save()
    .then((doc) => {
      return res.send('Code Submitted').status(200);
    })
    .catch((err) => {
      return res.send('Some Error ').status(400);
    });
});

// Generate Report

router.post('/getcode', (req, res) => {
  console.log(req.body.roomId);
  userModal.find({ roomId: req.body.roomId }, function (err, Data) {
    //console.log(data)
    if (!err)
      return res.json({
        status: 200,

        data: {
          code: Data,
          labname: req.labname,
        },
      });
    else {
      return res.json({
        status: 401,

        data: {
          msg: 'Some Error Occured',
        },
      });
    }
  });
});
module.exports = router;

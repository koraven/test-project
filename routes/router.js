var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');

function createAppUser(username,password){
  var userData = {
    username: username,
    password: password,
  }

  User.create(userData, function (error, user) {
    if (error) {
      console.error(error);
      return next(error);
    } else {
      console.log('User: ' + username + ' has been created.')
    }
  });
}

function init(){
  User.countDocuments().exec(function (error,result) {
    if (error){
      console.error(error);
    }
    else{
      console.log(result);
      if (result === 0){
        createAppUser('admin','admin');
        createAppUser('administrator','administrator');
      }
    }
  });

}
init();
// GET route for reading data
router.get('/', function (req, res, next) {
  console.log('GET')
  return res.sendFile(path.join(__dirname + '/public/index.html'));
});

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

      createAppUser(req.body.username, req.body.password);
      res.redirect('/users');

  } else if (req.body.logusername && req.body.logpassword) {
    User.authenticate(req.body.logusername, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/users');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});
router.get('/users', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.sendFile(path.resolve(__dirname + '/../public/table.html'))
        }
      }
    });
});

router.get('/list', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized!');
          err.status = 400;
          return next(err);
        } else {
          User.find().select('username').exec(function (error, list){
            if (error) {
              console.log(error);
            }
            else{
              return res.send(list);
            }
          });
        }
      }
    });
});

router.delete('/delete/:id', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized!');
          err.status = 400;
          return next(err);
        } else {
          const id = req.params.id;
          User.findByIdAndDelete(id).exec(function (error, user){
            if (error){
              console.error(error);
            }
            else{
              console.log("deleted: " + id);
              return res.send(user);
            }
          })
        }
      }
    }); 
})


// GET for logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    console.log(req.session);
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
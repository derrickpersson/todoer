"use strict";

const express = require('express');
const router = express.Router();
const nlp = require('./classification.js')();
const yelp = require('./yelpHelper.js')();
const amazon = require('./amazonHelper.js')();
const tms = require('./movieHelper.js')();
const moment = require('moment');
const multer = require('multer');
const upload = multer();
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.region = "us-east-1";
AWS.config.accessKeyId = process.env.accessKeyID;
AWS.config.secretAccessKey = process.env.secretAccessKey;

const today = new Date();

const rekognition = new AWS.Rekognition({
  region: "us-east-1"
});

function indexFaces(bitmap, name) {
  rekognition.indexFaces({
    "CollectionId": 'users',
    "DetectionAttributes": ["ALL"],
    "ExternalImageId": name,
    "Image": {
      "Bytes": bitmap
    }
  }, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data); // successful response
    }
  });
}

let FACE_COLLECTION = "users";

function createCollection() {
  // Index a dir of faces
  rekognition.createCollection({
    "CollectionId": FACE_COLLECTION
  }, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data); // successful response
    }
  });
}

module.exports = (datahelper) => {
  router.get("/", (req, res) => {
    res.send(200);
  });

  router.post('/saveimage/:id', upload.single('webcam'), (req, res, next) => {
    //createCollection();
    console.log(req.file);
    console.log("bufferrrrrrrrr", req.file.buffer);
    indexFaces(req.file.buffer, req.params.id);
    return res.status(200).send("uploading to AWS");
  });

  router.post('/compare', upload.single('webcam'), (req, res) => {
    var bitmap = req.file.buffer;
    rekognition.searchFacesByImage({
      "CollectionId": 'users',
      "FaceMatchThreshold": 70,
      "Image": {
        "Bytes": bitmap,
      },
      "MaxFaces": 1
    }, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
          res.send(data.FaceMatches[0].Face);
        } else {
          res.send({
            result: "Not recognized"
          });
        }
      }
    });
  });
  // GET /users/:uid/todos
  // CHANGE UID TO USER NAME LATER
  router.get("/:uid/todos", (req, res) => {
    datahelper.queryTodos(req.session.user_id).
    then((data) => {
      return res.json(data);
    }).
    catch((err) => {
      console.log(err);
      return res.send(500);
    });
  });

  router.get('/:uid/todos/complete', (req, res) => {
    datahelper.getCompleteToDos(req.session.user_id)
      .then((data) => {
        return res.json(data);
      }).
    catch((err) => {
      console.log(err);
      return res.send(500);
    });
  });

  //Get a single todo to render
  router.get('/:uid/todos/:tid', (req, res) => {
    datahelper.getSingleTodo(req.params.tid).
    then((dbData) => {
      //1 if cat = food;
      if (dbData[0].category == "restaurant") {
        console.log("It is a restaurant; searching yelp!");
        yelp.randomSearchByname(req.params.tid).
        then((apiData) => {
          let data = {};
          data.dbData = dbData[0];
          data.apiData = apiData;
          return res.json(data);
        }).
        catch((err) => {
          return res.send(500);
        })
      } else if (dbData[0].category == 'movie') {
        console.log("today", today);
        console.log("format day", moment(today).format('YYYY-MM-DD'));
        console.log("It is a movie; searching tmsapi");
        tms.randomSearchByname(dbData[0].recommendation_request, moment(today).format('YYYY-MM-DD')).
        then((apiData) => {
          let data = {};
          data.dbData = dbData[0];
          data.apiData = apiData;
          return res.json(data);
        }).
        catch((err) => {
          return res.send(500);
        })
      } else if (dbData[0].category === 'book' || dbData[0].category === 'product') {
        console.log("It is a book or product; searching amazon");
        amazon.searchByProduct(dbData[0].recommendation_request)
          .then((apiData) => {
            let data = {};
            data.dbData = dbData[0];
            data.apiData = apiData;
            console.log(data);
            return res.json(data);
          })
      } else if (dbData[0].category == 'uncategorized') {
        let data = {};
        data.dbData = dbData[0];
        data.apiData = null;
        console.log("uncategorized item;")
        return res.json(data);
      }
    }).catch((err) => {
      return res.send(500);
    })
  });

  router.get('/:uid/todos/db/:tid', (req, res) => {
    console.log("req todo id", req.params.tid);
    datahelper.getSingleTodo(req.params.tid).
    then((data) => {
      console.log(data);
      res.json(data[0]);
    }).
    catch((err) => {
      res.send(500);
    })
  });

  // create a new user;
  router.post('/new', (req, res) => {
    datahelper.createUser(req.body.email, req.body.password).
    then(() => {
      // set sesstion
      res.redirect('/');
    })
  });

  //Login post
  router.post('/login', (req, res) => {
    datahelper.loginUser(req.body.email, req.body.password).
    then((data) => {
      console.log("data 0", data[0]);
      if (req.body.password === data[0].password) {
        console.log(data);
        console.log(req.body.password);
        console.log(req.body.email);

        req.session.user_id = data[0].id;
        req.session.email = data[0].email;
        return res.redirect('/');
      }
    }).
    catch((err) => {
      return res.redirect('/login');
    })
  });

  router.post('/face/login', (req, res) => {
    datahelper.loginUser(req.body.email, req.body.password).
    then((data) => {
      console.log("data 0", data[0]);
      console.log(data);
      console.log(req.body.password);
      console.log(req.body.email);
      req.session.user_id = data[0].id;
      req.session.email = data[0].email;
      return res.send(200);
    }).
    catch((err) => {
      return res.send(500);
    })
  });

  router.post('/:uid/logout', (req, res) => {
    req.session.user_id = null;
    return res.redirect('/');
  });

  router.post('/:uid/todos/new', (req, res) => {
    console.log(req.body);
    let sentences = req.body.title.split(',');
    let cat = nlp.classifier(req.body.title);
    console.log(cat);
    let collection = [];
    sentences.forEach((sen) => {
      let todo = nlp.classifier(sen);
      todo.title = sen;
      collection.push(todo);
    })
    console.log(collection);
    if (collection.length === 1) {
      console.log("insert one todo");
      datahelper.createTodo(req.body.title, req.session.user_id, cat.action, cat.target).
      then(() => {
        return res.send(200);
      }).
      catch((err) => {
        return res.send(500);
      });
    } else if (collection.length > 1) {
      datahelper.crateMultipleTodos(collection, req.session.user_id).
      then((data) => {
        console.log("insert multiple back", data);
        return res.send(200);
      }).catch((err) => {
        return res.send(500);
      });
    }
  });

  // update a to do:
  router.post('/:uid/todos/:tid', (req, res) => {
    // update todo by id.
    let request = req.body.recommendation_request;
    console.log("title", req.body.title);
    if (req.body.title != undefined) {
      request = nlp.classifier(req.body.title).target;
    }

    let todo = {
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      due_date: req.body.due_date,
      complete: req.body.complete || false,
      recommendation_request: request,
      category: req.body.category
    };
    console.log(todo);
    datahelper.updateTodo(todo).
    then(() => {
      return res.send(200);
    }).
    catch((err) => {
      console.log(err);
      return res.send(500);
    });
  });

  router.post('/:uid/todos/:tid/delete', (req, res) => {
    datahelper.deleteToDo(req.params.tid)
      .then((data) => {
        return res.send(200)
      }).catch((err) => {
        throw err;
      });
  });

  router.get('/todos/details/:tid', (req, res) => {
    let data = yelp.searchByname(req.params.tid);
    res.json(data);
  })

  return router;
}

"use strict";

const express = require('express');
const router  = express.Router();
const nlp = require('./classification.js')();
const yelp = require('./yelpHelper.js')();
const tms = require('./movieHelper.js')();
const moment = require('moment');


module.exports = (datahelper) => {

  router.get("/", (req, res) => {
     // datahelper
     //   .select("*")
     //   .from("users")
     //   .then((results) => {
     //     res.json(results);
     // });
     res.send(200);
 });
  // GET /users/:uid/todos
  // CHANGE UID TO USER NAME LATER
  router.get("/:uid/todos", (req,res)  => {
    // select todos where user_id == uid;
    // send to ejs template tp render.
    // datahelper.queryTodos('2', (err, data) => {
    //   console.log(data);
    //   res.send(200);
    // });
    datahelper.queryTodos(req.session.user_id).
    then((data) => {
      return res.json(data);
    }).
    catch((err) =>{
      console.log(err);
      return res.send(500);
    });
  });

  router.get('/:uid/todos/complete', (req, res) => {
    datahelper.getCompleteToDos(req.session.user_id)
      .then((data) =>{
        return res.json(data);
      }).
      catch((err) =>{
        console.log(err);
        return res.send(500);
      });
  });

  //Get a single todo to render
  router.get('/:uid/todos/:tid', (req, res) => {
    // get data from yelp
    // yelp.randomSearchByname(req.params.tid).
    // then((apiData) => {
    //   // data from our db;
    //   datahelper.getSingleTodo(req.params.tid).
    //   then((dbData) => {
    //     let data = {};
    //     data.dbData = dbData[0];
    //     data.apiData = apiData;
    //     res.json(data);
    //   })
    // }).
    // catch((err) => {
    //   res.send(500);
    // })
    // search that todo in db.
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
        })
      }
      else if (dbData[0].category == 'movie') {
        console.log("It is a movie; searching tmsapi");
        tms.randomSearchByname(dbData[0].recommendation_request, '2017-12-26').
        then((apiData) => {
          let data = {};
          data.dbData = dbData[0];
          data.apiData = apiData;
          return res.json(data);
        })
      }






      // else if (dbData[0].category == 'book')
      // else if (dbData[0].category == 'product')
      // else if (dbData[0].category == 'uncategorized')
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


  // //get a registration page;
  // router.get('/new', (req, res) => {
  //   res.send("new reg form");
  // }); /// !!! move this route to server.js

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
      console.log("data 0",data[0]);
      if (req.body.password === data[0].password) {
        console.log(data);
        console.log(req.body.password);
        console.log(req.body.email);

        req.session.user_id = data[0].id;
        return res.redirect('/');
      }
    })
    //catch err
  });

 router.post('/:uid/logout', (req, res) => {
   res.session.user_id = null;
   return res.redirect('/');
 });

  router.post('/:uid/todos/new', (req, res) =>{
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
      datahelper.createTodo(req.body.title,req.session.user_id, cat.action, cat.target).
      then(() =>{
        return res.send(200);
      }).
      catch((err) => {
        return res.send(500);
      });
    } else if (collection.length > 1) {
      datahelper.crateMultipleTodos(collection,req.session.user_id).
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
    let todo = {
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      due_date: req.body.due_date,
      complete: req.body.complete || false,
      recommendation_request: req.body.recommendation_request,
      category: req.body.category
    };
    console.log(todo);
    // datahelper.updateTodo(todo, function(err, data){
    //   console.log("Success");
    //   // json data -> send back to who called.
    // })
    // res.send("update a todo is ok")
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

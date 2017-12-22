"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (datahelper) => {

  // router.get("/", (req, res) => {
  //   datahelper
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });
  // GET /users/:uid/todos
  router.get("/:uid/todos", (req,res)  => {
    // select todos where user_id == uid;
    // send to ejs template tp render.
    datahelper.queryTodos('2', (err, data) => {
      console.log(data);
      res.send(200);
    });
  })

  // //get a registration page;
  // router.get('/new', (req, res) => {
  //   res.send("new reg form");
  // }); /// !!! move this route to server.js

  // create a new user;
  router.post('/new', (req, res) => {
    // insert into users db , with email, password
    res.send("create a new user");
  })

  // create a new to DO

  router.post('/:uid/todos/new', (req, res) =>{
    // insert into todos with title;
    datahelper.createTodo(req.body.title, req.param.userid, function(err){
      console.log('Success');
    })
    res.send("create a new todo is ok")
  });

  // update a to do:
  router.post('/:uid/todos/:tid', (req, res) => {
    // update todo by id.
    let todo = {
      title: req.body.title,
      description: req.body.description,
      due_date: req.body.due_date,
      complete: req.body.complete,
      recommendation_request: req.body.recommendation_request
    };
    datahelper.updateTodo(todo, function(err, data){
      console.log("Success");
      // json data -> send back to who called.
    })
    res.send("update a todo is ok")
  })

  router.post('/:uid/todos/:tid/delete', (req, res) => {
    datahelper.deleteToDo(req.param.todoId, function(err){
      if(err){
        throw err;
      }
      console.log('Success');
    })
    res.send("delete todo is ok")
  });
  return router;
}

"use strict";

const express = require('express');
const router  = express.Router();


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
      console.log(data);
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
        console.log(data);
        return res.json(data);
      }).
      catch((err) =>{
        console.log(err);
        return res.send(500);
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

  router.post('/:uid', (req, res) => {
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
  });

 router.post('/:uid/logout', (req, res) => {
   res.session.user_id = null;
   return res.redirect('/');
 });

  router.post('/:uid/todos/new', (req, res) =>{
    console.log(req.body);
    datahelper.createTodo(req.body.title,req.session.user_id).
    then(() =>{
      return res.send(200);
    }).
    catch((err) => {
      return res.send(500);
    })
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
    // datahelper.updateTodo(todo, function(err, data){
    //   console.log("Success");
    //   // json data -> send back to who called.
    // })
    // res.send("update a todo is ok")
    datahelper.updateTodo(req.params.tid).
    then(() => {
      return res.send(200);
    }).
    catch((err) => {
      return res.send(500);
    })
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

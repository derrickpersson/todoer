"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });
  // GET /users/:uid/todos
  router.get("/:uid/todos", (req,res)  => {
    // select todos where user_id == uid;
    // send to ejs template tp render.
    res.send("users :uid todos ok ");
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
    res.send("create a new todo is ok")
  });

  // update a to do:
  router.post('/:uid/todos/:tid', (req, res) => {
    // update todo by id.
    res.send("update a todo is ok")
  })

  router.post('/:uid/todos/:tid/delete', (req, res) => {
    // delete the todo by id
    res.send("delete todo is ok")
  });
  return router;
}

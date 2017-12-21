

module.exports = function makeDataHelpers(db){

  return {

    // Get a list of all the todos for a given user ID
    queryTodos: function (userid, cb){
      db.select('*').from('todos')
        .where('user_id', '=', userid)
        .asCallback(function(error, rows){
          cb(null,rows);
        })
    },

    // Create a new to do when given title
    createTodos: function(title, userId, cb){
      db('todos').insert({
        title: title,
        user_id: userId
      }).asCallback(function(err){
        if(err){
          cb(err);
        }
      })
    },

    // Get all the categories assigned to a to do
    getTodoCategories: function(taskId, cb){
      db.select('categories.name').from('todos')
        .innerjoin('todo_category', 'todos.id', 'todo_category.todo_id')
        .innerjoin('categories', 'todo_category.category_id', 'categories.id')
        .asCallback(function(err, rows){
          if(err){
            cb(err, null);
          }
          cb(null, rows);
        })
    },

    // Update an existing to do
    updateTodo: function(taskObj, cb){
      db('todos').where('id', '=', taskObj.id)
        .update({
          title: taskObj.title,
          description: taskObj.description,
          due_date: taskObj.due_date,
          complete: taskObj.complete,
          recommendation_request: taskObj.recommendation_request,
          // user_id: taskObj.userId
        })
        .asCallback(function(err, rows){
          if(err){
            cb(err, null);
          }
          cb(null, rows);
        })
    },

    // Delete a to do
    deleteToDo: function(taskId, cb){
      db('todos').where('id', '=', taskId)
        .del()
        .asCallback(function(err){
          if(err){
            cb(err);
          }
        })
    }


  };

};
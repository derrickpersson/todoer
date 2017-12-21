

module.exports = function makeDataHelpers(db){

  return {

    // Get a list of all the todos for a given user ID
    queryTodos: function (userId){
      knex.select('*').from('todos')
        .where('user_id', '=', userid)
        .asCallback(function(error, rows){
          return rows;
        })
    },

    // Create a new to do when given title
    createTodos: function(title, userId){
      knex('todos').insert({
        title: title,
        user_id: userId
      }).asCallback(function(err){
        if(err){
          console.log(err);
        }
      })
    },

    // Get all the categories assigned to a to do
    getTodoCategories: function(taskId){
      knex.select('categories.name').from('todos')
        .innerjoin('todo_category', 'todos.id', 'todo_category.todo_id')
        .innerjoin('categories', 'todo_category.category_id', 'categories.id')
        .asCallback(function(err, rows){
          return rows;
        })
    }

    // Update an existing to do
    updateTodo: function(taskObj){
      knex('todos').where('id', '=', taskObj.id)
        .update({
          title: taskObj.title,
          description: taskObj.description,
          due_date: taskObj.due_date,
          complete: taskObj.complete,
          recommendation_request: taskObj.recommendation_request,
          // user_id: taskObj.userId
        })
    },

    // Delete a to do
    deleteToDo: function(taskId){
      knex('todos').where('id', '=', taskId)
        .del();
    }


  }

}
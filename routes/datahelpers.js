

module.exports = function makeDataHelpers(db){
  return {
    // Get a list of all the todos for a given user ID
    queryTodos: function (userid){
      return db.select('*').from('todos')
        .where('user_id', '=', userid)
        .andWhere('complete', '=', false)
    },

    // Create a new to do when given title
    createTodo: function(title, userId,category, destination){
      return db('todos').insert({
        title: title,
        user_id: userId,
        category: category,
        complete: false,
        recommendation_request: destination
      })
    },
    // Get all the categories assigned to a to do
    getTodoCategories: function(taskId){
      return db.select('categories.name').from('todos')
        .innerjoin('todo_category', 'todos.id', 'todo_category.todo_id')
        .innerjoin('categories', 'todo_category.category_id', 'categories.id')
    },
    // Update an existing to do
    updateTodo: function(taskObj){
      return db('todos').where('id', '=', taskObj.id)
        .update({
          title: taskObj.title,
          description: taskObj.description,
          due_date: taskObj.due_date,
          complete: taskObj.complete,
          recommendation_request: taskObj.recommendation_request,
          // user_id: taskObj.userId
        })
    },
    createUser: function(email, password) {
      return db('users').insert({
        email: email,
        password: password
      });
    },

    loginUser: function (email, password) {
      return db.select('password', 'id').
                from('users').
                where('email', email);
    },
    // Delete a to do
    deleteToDo: function(taskId, cb){
      return db('todos').where('id', '=', taskId)
        .del()
    },

    getCompleteToDos: function(userId){
      return db.select('*').from('todos')
        .where('user_id', '=', userId)
        .andWhere('complete', '=', true)
    },

    getSingleTodo: function(taskId){
      return db. select('*').from('todos')
        .where('id', '=', taskId)
    }
  };
};

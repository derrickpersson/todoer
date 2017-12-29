var createMultiple = (todos, userId, dataBase) => {
    return dataBase('todos').insert({
      title: todos[0].title,
      user_id: userId,
      category: todos[0].action,
      complete: false,
      recommendation_request: todos[0].target
    }).
    then(() => {
      if (todos.length == 1) return Promise.resolve({result: "good"});
      let temp = [];
      todos.forEach((item, index) => {
        if (index !== 0) {
          temp.push(item);
        }
      });
      console.log("temp length",temp.length);
      if (todos.length > 0) {
        return createMultiple(temp, userId, dataBase);
      }
    });
}

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
    // crateMultipleTodos:
    crateMultipleTodos: (todos, userId) => {
      return new Promise ((resolve, reject) => {
        createMultiple(todos,userId, db).
        then((data) => {
          resolve(data);
        }).
        catch((err) => {
          reject(err);
        });
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
          category: taskObj.category
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
      return db.select('password', 'id', 'email').
                from('users').
                where('email', email);
    },
    // Delete a to do
    deleteToDo: function(taskId){
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

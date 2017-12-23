$(() => {

  function createTodo(todo){
    return `<li class="list-group-item" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" href="#" role="button">Details</a>
            </li>
            `;
  };

  function createExpandedTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <small class="pull-right">${todo.due_date}</small>
              <p class="mb-1">${todo.description}</p>
              <a class="btn btn-primary btn-xs" href="#" role="button">Edit</a>
              <a class="btn btn-danger btn-xs" href="#" role="button">Delete</a>
              <span class="label label-warning pull-right">${todo.category}</span>
            </li>
            `;
  };


  function createEditableTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.id}">
              <form>
                <span class="todo-check"><input type="checkbox" class="todo-check"></span>
                <input value="${todo.title}">
                <small class="pull-right"><input type="date" value="${todo.due_date}"></small>
                <p class="mb-1"><textarea class="form-control" rows=3>${todo.description}</textarea></p>
                <button class="btn btn-primary btn-xs" href="#" value="submit">Save</button>
                <button class="btn btn-danger btn-xs" href="#" value="cancel">Cancel</button>
                <span class="pull-right">
                <select>
                  <option value="Restaurant"> Restaurant</option>
                  <option value="Movie"> Movie</option>
                  <option value="Product">Product</option>
                  <option value="Book">Book </option>
                </select>
                </span>
              </form>
          </li>
          `;
  };

  function createCompletedTodo(todo){
    return `<li class="list-group-item disabled" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check" checked></span>${todo.title}
              <a class="btn btn-primary btn-xs pull-right" href="#" role="button">Details</a>
            </li>
            `;
  }

  function renderTodos(todos){
    $('#todos-container').empty().html(todos.map(createTodo).reverse());
  }

  function renderCompleteTodos(todos){
    $('#complete-todos').empty().html(todos.map(createCompletedTodo).reverse());
  }

  var user_id = $('#email').data('email');

console.log(user_id);

  function loadTodos(userId){
    $.ajax({
      url: `/users/${userId}/todos`,
      method: 'GET',
      datatype: 'json'
    }).done(function(results){
      renderTodos(results);
    })
  }

  loadTodos(user_id);



  $('#new-todo').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url: `/users/${user_id}/todos/new`,
      method: "POST",
      data: $('#new-todo').serialize()
    }).done(function () {
      $(event.target).trigger('reset');
      loadTodos(user_id);
    })



    //loadTodos(userEmail);
    //
  })


  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

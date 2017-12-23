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

  function loadCompleteTodos(userId){
    $.ajax({
      url: `/users/${userId}/todos/complete`,
      method: 'GET',
      datatype: 'json'
    }).done(function(results){
      renderCompleteTodos(results);
    })
  }

  loadCompleteTodos(user_id);

  $('#new-todo').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url: `/users/${user_id}/todos/new`,
      method: "POST",
      data: $('#new-todo').serialize()
    }).done(function () {
      $(event.target).trigger('reset');
      loadTodos(user_id);
    });
  })

// Complete a todo
  $('#todos-container').on('click', 'input' ,function(event){
    const todo_id = $(this).parent().parent().data().todo_id;
    const todo_li = $(this).parent().parent();
    if($(this).is(':checked')){
      $.ajax({
        url: `/users/${user_id}/todos/${todo_id}`,
        method: "POST",
        data: {
          id: todo_id,
          complete: true
        }
      }).done(function(){
        loadTodos(user_id);
        loadCompleteTodos(user_id);
      })
    }
  })

// Un-complete a todo
    $('#complete-todos').on('click', 'input' ,function(event){
    const todo_id = $(this).parent().parent().data().todo_id;
    const todo_li = $(this).parent().parent();
    if(!$(this).is(':checked')){
      $.ajax({
        url: `/users/${user_id}/todos/${todo_id}`,
        method: "POST",
        data: {
          id: todo_id,
          complete: false
        }
      }).done(function(){
        loadTodos(user_id);
        loadCompleteTodos(user_id);
      })
    }
  })


// Show details of a todo
$('#todos-container').on('click', '.btn-primary' ,function(event){
  event.preventDefault();
  const todo_id = $(this).parent().data().todo_id;
  const todo_li = $(this).parent().parent();
  $.ajax({
    method:"GET",
    url: `/users/${user_id}/todos/${todo_id}`,
    datatype: 'json'
  }).done(function(data){
    todo_li.replaceWith(createExpandedTodo(data));
    // Replace the single li with the new li with details.
  })
});

  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

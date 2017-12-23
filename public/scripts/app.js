$(() => {

  function createTodo(todo){
    return `<li class="list-group-item" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" href="#" role="button">Details</a>
            </li>
            `;
  };

  function createExpandedTodo(){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo_id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo_title}
              <small class="pull-right">${todo_due_date}</small>
              <p class="mb-1">${todo_description}</p>
              <a class="btn btn-primary btn-xs" href="#" role="button">Edit</a>
              <a class="btn btn-danger btn-xs" href="#" role="button">Delete</a>
              <span class="label label-warning pull-right">${todo_category}</span>
            </li>
            `;
  };


  function createEditableTodo(){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo_id}">
              <form>
                <span class="todo-check"><input type="checkbox" class="todo-check"></span>
                <input value="${todo_title}">
                <small class="pull-right"><input type="date" value="${todo_due_date}"></small>
                <p class="mb-1"><textarea class="form-control" rows=3>${todo_description}</textarea></p>
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

  function createCompletedTodo(){
    return `<li class="list-group-item disabled" data-todo_id="${todo_id}">
              <span class="todo-check"><input type="checkbox" class="todo-check" checked></span>${todo_title}
              <a class="btn btn-primary btn-xs pull-right" href="#" role="button">Details</a>
            </li>
            `;
  }

  function renderTodos(todos){
    $('#todos-container').empty().html(todos.map(createTodo(todo).reverse()));
  }

  var userEmail = $('#email').data().event;


  function loadTodos(userId){
    $.ajax({
      url: `/${userId}/todos`,
      method: 'GET',
      datatype: 'json'
    }).done(function(results){
      renderTodos(results);
    })
  }

  $('#new-todo').on('submit', function(event){
    event.preventDefault();
    loadTodos(userEmail);
    // $(this).trigger('reset');
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

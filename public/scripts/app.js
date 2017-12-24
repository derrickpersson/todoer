$(() => {
  function createTodo(todo){
    return `<li class="list-group-item" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" id="show-details" href="#" role="button">Details</a>
            </li>
            `;
  };


  function blankIfNull(item){
    if(item === null){
      return "";
    }
      return item;
  };

  function createExpandedTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" id="hide-details" href="#" role="button">Hide</a>
              <p class="mb-1">${blankIfNull(todo.description)}</p>
              <a class="btn btn-primary btn-xs" href="#" id="edit" role="button">Edit</a>
              <a class="btn btn-danger btn-xs" href="#" id="delete" role="button">Delete</a>
              <small class="pull-right">${blankIfNull(todo.due_date)}</small>
            </li>
            `;
  };


  function createEditableTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.id}">
              <form id="todo-edit">
                <span class="todo-check"><input name="complete" type="checkbox" class="todo-check"></span>
                <input id="title" name="title" value="${todo.title}">
                <select id="category" name="category">
                  <option value="Restaurant"> Restaurant</option>
                  <option value="Movie"> Movie</option>
                  <option value="Product">Product</option>
                  <option value="Book">Book </option>
                </select>
                <p class="mb-1"><textarea id="description" name="description" class="form-control" rows=3>${blankIfNull(todo.description)}</textarea></p>
                <button class="btn btn-primary btn-xs" href="#" id="save" value="submit">Save</button>
                <button class="btn btn-danger btn-xs" href="#" id="cancel" value="cancel">Cancel</button>
                <small class="pull-right"><input id="due_date" name="due_date" type="date" value="${blankIfNull(todo.due_date)}"></small>
              </form>
          </li>
          `;
  };

  function createCompletedTodo(todo){
    return `<li class="list-group-item disabled" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check" checked></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" href="#" role="button">Details</a>
            </li>
            `;
  };


  function renderTodos(todos){
    $('#todos-container').empty().html(todos.map(createTodo).reverse());
  };

  function renderCompleteTodos(todos){
    $('#complete-todos').empty().html(todos.map(createCompletedTodo).reverse());
  };

  var user_id = $('#email').data('email');

  function loadTodos(userId){
    $.ajax({
      url: `/users/${userId}/todos`,
      method: 'GET',
      datatype: 'json'
    }).done(function(results){
      renderTodos(results);
    })
  };

  loadTodos(user_id);

  function loadCompleteTodos(userId){
    $.ajax({
      url: `/users/${userId}/todos/complete`,
      method: 'GET',
      datatype: 'json'
    }).done(function(results){
      renderCompleteTodos(results);
    })
  };

  loadCompleteTodos(user_id);

  $('#new-todo').on('submit', function(event){
    event.preventDefault();
    // console.log($('#new-todo').serialize());
    let newTodo = $('#new-todo input').val();
    // console.log(newTodo);
    // let cat = classifier(newTodo);
    // console.log('clean',cat);

    let sendData = {
      title: newTodo
    };

    $.ajax({
      url: `/users/${user_id}/todos/new`,
      method: "POST",
      //data: $('#new-todo').serialize()
        data: sendData
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
      });
    }
  });


  // Show details of a todo
  $('#todos-container').on('click', '#show-details' ,function(event){
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    $.ajax({
      method:"GET",
      url: `/users/${user_id}/todos/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createExpandedTodo(data[0]));
    })
  });

  // Hide details of a todo
  $('#todos-container').on('click', '#hide-details' ,function(event){
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    $.ajax({
      method:"GET",
      url: `/users/${user_id}/todos/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createTodo(data[0]));
    })
  });

  // Show details of a todo
  $('#todos-container').on('click', '#delete' ,function(event){
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    $.ajax({
      method:"POST",
      url: `/users/${user_id}/todos/${todo_id}/delete`,
    }).done(function(data){
      todo_li.remove();
      console.log("Successfully deleted");
    })
  });

  // Get editable from
  $('#todos-container').on('click', '#edit' ,function(event){
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    $.ajax({
      method:"GET",
      url: `/users/${user_id}/todos/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createEditableTodo(data[0]));
    })
  });

  // Update todo with new info
  $('#todos-container').on('submit', '#todo-edit', function(event){
    console.log('test');
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    let sendData = {
      id: todo_id,
      title: $('#title').val() || null,
      due_date: $('#due_date').val() || null,
      description: $('#description').val() || null,
      category: $('#category').val() || null
    };
    console.log(sendData);
    $.ajax({
      method: "POST",
      url: `/users/${user_id}/todos/${todo_id}`,
      data: sendData
    }).then( (data) => {
      $.ajax({
        method:"GET",
        url: `/users/${user_id}/todos/${todo_id}`,
        datatype: 'json'
      }).done(function(data){
        // Replace the single li with the new li with details.
        todo_li.replaceWith(createExpandedTodo(data[0]));
      })
    })
  });

});

$(() => {
  function blankIfNull(item){
    if(item === null){
      return "";
    }
      return item;
  };

  function dateChecker(date){
    if(date === 'Invalid date'){
      return "";
    }
    return date;
  }

  function createTodo(todo){
    return `<li class="list-group-item" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" id="show-details" href="#" role="button">Details</a>
            </li>
            `;
  };

  function createExpandedTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.title}
              <span class="label label-info">${todo.category}</span>
              <a class="btn btn-primary btn-xs pull-right" id="hide-details" href="#" role="button">Hide</a>
              <p class="mb-1">${blankIfNull(todo.description)}</p>
              <a class="btn btn-primary btn-xs" href="#" id="edit" role="button">Edit</a>
              <a class="btn btn-danger btn-xs" href="#" id="delete" role="button">Delete</a>
              <small class="pull-right">Due Date:  ${dateChecker(moment(blankIfNull(todo.due_date)).format('MM / DD / YYYY'))}</small>
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
                <small class="pull-right">Due Date:  <input id="due_date" name="due_date" type="date" value="${moment(blankIfNull(todo.due_date)).format('YYYY-MM-DD')}"></small>
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

  function createTableLayout(){
    return `<div class="row">
              <div class="col-md-6">
                <h2> Movies: </h2>
                <ul class="list-group" id="Movie">
                </ul>
              </div>
              <div class="col-md-6">
                <h2> Books: </h2>
                <ul class="list-group" id="Book">
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <h2> Products: </h2>
                <ul class="list-group" id="Product">
                </ul>
              </div>
              <div class="col-md-6">
                <h2> Restaurants: </h2>
                <ul class="list-group" id="Restaurant">
                </ul>
              </div>
            </div>
           `
  }

  function createListLayout(){
    return `<ul class="list-group" id="todos-container">
            </ul>
           `
  }



  function renderTodos(todos){
    $('#todos-container').empty().html(todos.map(createTodo).reverse());
  };

  function renderCategoryTodos(todos, category){
    // let categoryTodos = todos.filter(function(todo){
    //   todo.category === "Movie"});

    let manualFilter = function(todos){
      let results = [];
      for(let i = 0; i < todos.length; i++){
        if(todos[i].category === category){
          results.push(todos[i]);
        }
      }
      return results;
    }
    let selector = "#" + category;
    let mappedTodos = manualFilter(todos).map(createTodo);
    $(selector).empty().html(mappedTodos);
  };

  function renderCompleteTodos(todos){
    $('#complete-todos').empty().html(todos.map(createCompletedTodo).reverse());
  };

  var user_id = $('#userId').data('userId');
  let view_state = "List";

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

  function loadCategoryTodos(userId, category){
    $.ajax({
      url: `/users/${userId}/todos`,
      method: 'GET',
      datatype: 'json'
    }).done(function(results){
      renderCategoryTodos(results, category);
    })
  };

  function loadAllCategories(userId){
    loadCategoryTodos(userId, "Movie");
    loadCategoryTodos(userId, "Book");
    loadCategoryTodos(userId, "Product");
    loadCategoryTodos(userId, "Restaurant");
  }

  loadTodos(user_id);

  // function renderViewState(userId){
  //   if(view_state === "List"){
  //     loadCompleteTodos(user_id);
  //     loadTodos(user_id);
  //   }else{
  //     loadAllCategories(userId);
  //     loadCompleteTodos(user_id);
  //   }
  // }

  $('#list-view').on('click', function(event){
    $(this).addClass('active');
    $(this).parent().find('#table-view').removeClass('active');
    $('#Movie').parent().parent().parent().empty().html(createListLayout());
    loadTodos(user_id);
    loadCompleteTodos(user_id);
    view_state = "List";
  })

  $('#table-view').on('click', function(event){
    $(this).addClass('active');
    $(this).parent().find('#list-view').removeClass('active');
    $('#todos-container').parent().empty().html(createTableLayout());
    loadAllCategories(user_id);
    view_state = "Table";
  })

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
      loadAllCategories(user_id);
    });
  })

  // Complete a todo
  $('#todos-container-container').on('click', 'input' ,function(event){
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
        loadAllCategories(user_id);
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
        loadAllCategories(user_id);
      });
    }
  });


  // Show details of a todo
  $('#todos-container-container').on('click', '#show-details' ,function(event){
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
  $('#todos-container-container').on('click', '#hide-details' ,function(event){
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
  $('#todos-container-container').on('click', '#delete' ,function(event){
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
  $('#todos-container-container').on('click', '#edit' ,function(event){
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
  $('#todos-container-container').on('submit', '#todo-edit', function(event){
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    let sendData = {
      id: todo_id,
      title: $('#title').val() || null,
      description: $('#description').val() || null,
      category: $('#category').val() || null
    };

    // Only add the date if it isn't null
    if(dateChecker(moment($('#due_date').val()).format('YYYY-MM-DD'))){
      sendData.due_date = moment($('#due_date').val()).format('YYYY-MM-DD');
    };

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

// Cancel editing the todo
  $('#todos-container-container').on('click', '#cancel', function(event){
    event.preventDefault();
    const todo_id = $(this).parent().parent().data().todo_id;
    const todo_li = $(this).parent().parent();
    $.ajax({
      method:"GET",
      url: `/users/${user_id}/todos/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createExpandedTodo(data[0]));
    });
  });


});

// Bugs note:
// Fix username display name
//    Fix user_id into sessions


// TODO:
// Add in 3 different sections to display in details section.
// Add in classifiers for all 4 categories
//  Classifier optimization
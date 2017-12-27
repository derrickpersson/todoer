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

  function displayYelpRating(rating){
    var path = "Images/yelp_stars/web_and_ios/regular/regular_"
    if(Number.isInteger(rating)){
      return `<img src="${path}${rating}.png" alt="${rating} / 5"/>`
    }else{
      return `<img src="${path}${Math.floor(rating)}_half.png" alt="${rating} / 5" />`
    }
  }


  function displayYelpInfo(todo){
    return `<div class="panel panel-default">
             <div class="panel-heading">${todo.apiData.name}</div>
              <div class="panel-body">
                <p class="font-weight-light">Rating: ${displayYelpRating(todo.apiData.rating)}</p>
                <p class="font-weight-light">Address: ${todo.apiData.location.address1}</p>
                <p class="font-weight-light">Phone: ${todo.apiData.display_phone}</p>
              </div>
            </div>`;
  }

  function displayMovieInfo(todo){
    return `<div class="panel panel-default">
              <div class="panel-heading">${todo.apiData.title}</div>
                <div class="panel-body">
                  <p class="font-weight-light">Description: ${todo.apiData.shortDescription}</p>
                  <p class="font-weight-light">Cast: ${todo.apiData.topCast}</p>
                </div>
              </div>
            </div>
           `
  }

function displayBookInfo(todo){
  return `<div class="panel panel-default">
            <div class="panel-heading">${todo.apiData.ItemAttributes.Title}</div>
              <div class="panel-body">
                <p class="font-weight-light">Author: ${todo.apiData.ItemAttributes.Author}</p>
                <p class="font-weight-light"><a href="${todo.apiData.DetailPageURL}"> More Details </a></p>
              </div>
            </div>
          </div>
         `;
  }

function displayProductInfo(todo){
  return `<div class="panel panel-default">
            <div class="panel-heading">${todo.apiData.ItemAttributes.Title}</div>
              <div class="panel-body">
                <p class="font-weight-light"><a href="${todo.apiData.DetailPageURL}"> More Details </a></p>
              </div>
            </div>
          </div>
         `;
  }

  function displayCategoryInfo(todo, category){
    if(category === 'restaurant'){
      return displayYelpInfo(todo);
    }else if(category === 'movie'){
      return displayMovieInfo(todo);
    }else if(category === 'product'){
      return displayProductInfo(todo);
    }else if(category === 'book'){
      return displayBookInfo(todo);
    }
  }

  function createExpandedTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.dbData.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.dbData.title}
              <span class="label label-info">${todo.dbData.category}</span>
              <a class="btn btn-primary btn-xs pull-right" id="hide-details" href="#" role="button">Hide</a>
              <p>${displayCategoryInfo(todo, todo.dbData.category)}</p>
              <a class="btn btn-primary btn-xs" href="#" id="edit" role="button">Edit</a>
              <a class="btn btn-danger btn-xs" href="#" id="delete" role="button">Delete</a>
              <small class="pull-right">Due Date:  ${dateChecker(moment(blankIfNull(todo.dbData.due_date)).format('MM / DD / YYYY'))}</small>
            </li>
            `;
  };

  function createNotFoundTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.dbData.id}">
            <span class="todo-check"><input type="checkbox" class="todo-check"></span>${todo.dbData.title}
            <span class="label label-info">${todo.dbData.category}</span>
            <a class="btn btn-primary btn-xs pull-right" id="hide-details" href="#" role="button">Hide</a>
            <a class="btn btn-primary btn-xs" href="#" id="edit" role="button">Edit</a>
            <a class="btn btn-danger btn-xs" href="#" id="delete" role="button">Delete</a>
            <small class="pull-right">Due Date:  ${dateChecker(moment(blankIfNull(todo.dbData.due_date)).format('MM / DD / YYYY'))}</small>
          </li>
          `;
  };

// function foodDetails(apiData) {
//   return `
//     <li class="list-group-item">Name: ${apiData.name}</li>
//     <li class="list-group-item">Rating: ${apiData.rating}</li>
//     <li class="list-group-item">Address: ${apiData.location.address1}</li>
//     <li class="list-group-item">Phone: ${apiData.display_phone}</li>
//   `;
// }



  function createEditableTodo(todo){
    return `<li class="list-group-item list-group-item list-group-item-action flex-column align-items-start" data-todo_id="${todo.id}">
              <form id="todo-edit">
                <span class="todo-check"><input name="complete" type="checkbox" class="todo-check"></span>
                <input id="title" name="title" value="${todo.title}">
                <select id="category" name="category">
                  <option value="restaurant"> Restaurant</option>
                  <option value="movie"> Movie</option>
                  <option value="product">Product</option>
                  <option value="book">Book </option>
                </select>
                <!-- <p class="mb-1"><textarea id="description" name="description" class="form-control" rows=3>${blankIfNull(todo.description)}</textarea></p> -->
                <button class="btn btn-primary btn-xs" href="#" id="save" value="submit">Save</button>
                <button class="btn btn-danger btn-xs" href="#" id="cancel" value="cancel">Cancel</button>
                <small class="pull-right">Due Date:  <input id="due_date" name="due_date" type="date" value="${moment(blankIfNull(todo.due_date)).format('YYYY-MM-DD')}"></small>
              </form>
          </li>
          `;
  };

  function createCompletedTodo(todo){
    return `<li class="list-group-item disabled" data-todo_id="${todo.dbData.id}">
              <span class="todo-check"><input type="checkbox" class="todo-check" checked></span>${todo.dbData.title}
              <span class="label label-info">${todo.dbData.category}</span>
              <a class="btn btn-primary btn-xs pull-right" href="#" role="button">Details</a>
            </li>
            `;
  };

  function createTableLayout(){
    return `<div class="row">
              <div class="col-md-6">
                <h2> Movies: </h2>
                <ul class="list-group" id="movie">
                </ul>
              </div>
              <div class="col-md-6">
                <h2> Books: </h2>
                <ul class="list-group" id="book">
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <h2> Products: </h2>
                <ul class="list-group" id="product">
                </ul>
              </div>
              <div class="col-md-6">
                <h2> Restaurants: </h2>
                <ul class="list-group" id="restaurant">
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

function bar() {
   return `<img id="lodaing" src="./Images/loading.gif">`;
};

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

  var user_id = $('#userId').data().userid;
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
    loadCategoryTodos(userId, "movie");
    loadCategoryTodos(userId, "book");
    loadCategoryTodos(userId, "product");
    loadCategoryTodos(userId, "restaurant");
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
    $('#movie').parent().parent().parent().empty().html(createListLayout());
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
    todo_li.replaceWith(bar());
    $.ajax({
      method:"GET",
      url: `/users/${user_id}/todos/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      console.log(data);
      if (data.apiData !== null) {
        $('#lodaing').replaceWith(createExpandedTodo(data));
      }
      //
      else if (data.apiData === null) {
      //  data.apiData = data.dbData;
      $('#lodaing').replaceWith(createNotFoundTodo(data));
      }
    })
  });

  // Hide details of a todo
  $('#todos-container-container').on('click', '#hide-details' ,function(event){
    event.preventDefault();
    const todo_id = $(this).parent().data().todo_id;
    const todo_li = $(this).parent();
    $.ajax({
      method:"GET",
      url: `/users/${user_id}/todos/db/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createTodo(data));
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
      url: `/users/${user_id}/todos/db/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createEditableTodo(data));
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
        url: `/users/${user_id}/todos/db/${todo_id}`,
        datatype: 'json'
      }).done(function(data){
        // Replace the single li with the new li with details.//

        //todo_li.replaceWith(createExpandedTodo(data));
        todo_li.replaceWith(createTodo(data));

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
      url: `/users/${user_id}/todos/db/${todo_id}`,
      datatype: 'json'
    }).done(function(data){
      // Replace the single li with the new li with details.
      todo_li.replaceWith(createTodo(data));
    });
  });


});

// Bugs note:
// Fix username display name
//    Fix user_id into sessions
// When you change the category away from what it is - it hangs.
//    You are then unable to change the category back because you can't view details
// Need to thoroughly test the categorization / API portion of the function.

// TODO:
// Add in 3 different sections to display in details section.
//    Add in movie display section
//    Add in products display section
// Add in classifiers for all 4 categories
//  Classifier optimization

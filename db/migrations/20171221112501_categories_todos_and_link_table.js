
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('categories', function(table){
      table.increments('id');
      table.string('name');
      table.string('description');
    }),
     knex.schema.createTable('todos', function(table){
      table.increments('id');
      table.string('title');
      table.string('description');
      table.string('recommendation_request');
      table.date('due_date');
      table.boolean('complete');
      table.integer('user_id').references('users.id');
    })
  ])
  // .then(
  //    knex.schema.createTable('todo_category', function(table){
  //     table.integer('todo_id').references('todos.id');
  //     table.integer('category_id').references('categories.id');
  //   }));

};

exports.down = function(knex, Promise) {
  // return knex.schema.dropTable('categories');
  // return knex.schema.dropTable('todo_category').then(Promise.all([knex.schema.dropTable('categories'), knex.schema.dropTable('todos')]));
  return Promise.all([knex.schema.dropTable('categories'), knex.schema.dropTable('todos')]);
};


exports.up = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('todo_category'), knex.schema.dropTable('categories'),
    knex.schema.table('todos', function(table){
      table.string('category');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('categories', function(table){
      table.increments('id');
      table.string('name');
      table.string('description');
    }),
     knex.schema.table('todos', function(table){
      table.dropColumn('category');
      table.dropTimestamps();
    }),
     knex.schema.createTable('todo_category', function(table){
      table.integer('todo_id').references('todos.id');
      table.integer('category_id').references('categories.id');
     })
  ])
};

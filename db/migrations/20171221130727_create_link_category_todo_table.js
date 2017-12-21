
exports.up = function(knex, Promise) {
  return knex.schema.createTable('todo_category', function(table){
    table.integer('todo_id').references('todos.id');
    table.integer('category_id').references('categories.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('todo_category');
};

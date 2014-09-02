import '../components/todo-storage-service/todo-storage-service';
import '../components/todo-escape-directive/todo-escape-directive';
import '../components/todo-focus-directive/todo-focus-directive';

import TodoController from './todo-controller';

export default angular.module('app.todo', [
    'app.todo-storage-service',
    'app.todo-escape-directive',
    'app.todo-focus-directive'
  ])
  .controller('TodoController', TodoController);

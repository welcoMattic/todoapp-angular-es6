import '../components/todo-storage-service/todo-storage-service';
import '../components/escape-directive/escape-directive';
import '../components/focus-directive/focus-directive';

import TodoController from './todo-controller';

export default angular.module('app.todo', [
    'app.todo-storage-service',
    'app.escape-directive',
    'app.focus-directive'
  ])
  .controller('TodoController', TodoController);

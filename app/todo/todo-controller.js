class TodoController {
  constructor($routeParams, $scope, TodoStorageService) {
    this.$scope = $scope;

    $scope.todos = TodoStorageService.get();

    $scope.newTodo = '';
    $scope.editedTodo = null;

    $scope.$watch('todos', (newValue, oldValue) => {
      $scope.remainingCount = $scope.todos.filter((todo) => !todo.completed).length;
      $scope.completedCount = $scope.todos.length - $scope.remainingCount;
      $scope.allChecked = !$scope.remainingCount;

      if (newValue !== oldValue) {
        TodoStorageService.put($scope.todos);
      }
    }, true);

    $scope.$on('$routeChangeSuccess', () => {
      let status = this.$scope.status = $routeParams.status || '';

      if (status === 'active') {
        this.$scope.statusFilter = { completed: false };
      } else if (status === 'completed') {
        this.$scope.statusFilter = { completed: true };
      } else {
        this.$scope.statusFilter = null;
      }
    });
  }

  addTodo() {
    let newTodo = this.$scope.newTodo.trim();

    if (!newTodo.length) return;

    this.$scope.todos.unshift({ title: newTodo, completed: false });

    this.$scope.newTodo = '';
  }

  editTodo(todo) {
    this.$scope.editedTodo = todo;
    this.$scope.originalTodo = Object.assign({}, todo);
  }

  doneEditing(todo) {
    this.$scope.editedTodo = null;
    todo.title = todo.title.trim();

    if (!todo.title) {
      this.removeTodo(todo);
    }
  }

  revertEditing(todo) {
    this.$scope.todos[this.$scope.todos.indexOf(todo)] = this.$scope.originalTodo;
    this.doneEditing(this.$scope.originalTodo);
  }

  removeTodo(todo) {
    this.$scope.todos.splice(this.$scope.todos.indexOf(todo), 1);
  }

  clearCompletedTodos() {
    this.$scope.todos = this.$scope.todos.filter((todo) => !todo.completed);
  }

  markAll(completed) {
    for (let todo of this.$scope.todos) {
      todo.completed = !completed;
    }
  }
}

export default ['$routeParams', '$scope', 'TodoStorageService', TodoController];

class TodoController {
  constructor($routeParams, $scope, TodoStorageService) {
    this.todos = TodoStorageService.get();

    this.newTodo = '';
    this.editedTodo = null;

    $scope.$watch(() => this.todos, (newValue, oldValue) => {
      this.remainingCount = this.todos.filter((todo) => !todo.completed).length;
      this.completedCount = this.todos.length - this.remainingCount;
      this.allChecked = !this.remainingCount;

      if (newValue !== oldValue) {
        TodoStorageService.put(this.todos);
      }
    }, true);

    $scope.$on('$routeChangeSuccess', () => {
      let status = this.status = $routeParams.status || '';

      if (status === 'active') {
        this.statusFilter = { completed: false };
      } else if (status === 'completed') {
        this.statusFilter = { completed: true };
      } else {
        this.statusFilter = null;
      }
    });
  }

  addTodo() {
    let newTodo = this.newTodo.trim();

    if (!newTodo.length) return;

    this.todos.unshift({ title: newTodo, completed: false });

    this.newTodo = '';
  }

  editTodo(todo) {
    this.editedTodo = todo;
    this.originalTodo = Object.assign({}, todo);
  }

  doneEditing(todo) {
    this.editedTodo = null;
    todo.title = todo.title.trim();

    if (!todo.title) {
      this.removeTodo(todo);
    }
  }

  revertEditing(todo) {
    this.todos[this.todos.indexOf(todo)] = this.originalTodo;
    this.doneEditing(this.originalTodo);
  }

  removeTodo(todo) {
    this.todos.splice(this.todos.indexOf(todo), 1);
  }

  clearCompletedTodos() {
    this.todos = this.todos.filter((todo) => !todo.completed);
  }

  markAll(completed) {
    for (let todo of this.todos) {
      todo.completed = !completed;
    }
  }
}

export default ['$routeParams', '$scope', 'TodoStorageService', TodoController];

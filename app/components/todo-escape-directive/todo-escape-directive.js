const ESCAPE_KEY_CODE = 27;

class EscapeDirective {
  constructor() {
    this.restrict = 'A';
  }

  link(scope, element, attrs) {
    element.on('keydown', (event) => {
      if (event.keyCode === ESCAPE_KEY_CODE) {
        scope.$apply(attrs.todoEscape);
      }
    });
  }
}

export default angular.module('app.todo-escape-directive', [])
  .directive('todoEscape', () => new EscapeDirective());

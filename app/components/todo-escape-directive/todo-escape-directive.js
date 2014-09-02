const ESCAPE_KEY_CODE = 27;

class EscapeDirective {
  link(scope, element, attrs) {
    element.on('keydown', (event) => {
      if (event.keyCode === ESCAPE_KEY_CODE) {
        scope.$apply(attrs.escape);
      }
    });
  }
}

export default angular.module('app.todo-escape-directive', [])
  .directive('todo-escape', ($injector) => $injector.instantiate(EscapeDirective));

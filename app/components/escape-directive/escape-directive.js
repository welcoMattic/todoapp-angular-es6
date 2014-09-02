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

export default angular.module('app.escape-directive', [])
  .directive('escape', ($injector) => $injector.instantiate(EscapeDirective));

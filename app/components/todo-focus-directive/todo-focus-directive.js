class FocusDirective {
  constructor($timeout) {
    this.$timeout = $timeout;
    this.restrict = 'A';
  }

  link(scope, element, attrs) {
    let rawElement = element[0];

    scope.$watch(attrs.focus, (focused) => {
      if (focused) this.$timeout(() => rawElement.focus(), 0);
    });
  }
}

export default angular.module('app.todo-focus-directive', [])
  .directive('todo-focus', ($injector) => $injector.instantiate(['$timeout', FocusDirective]));

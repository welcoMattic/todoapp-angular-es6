class FocusDirective {
  constructor($timeout) {
    this.$timeout = $timeout;
    this.restrict = 'A';
    this.link = this.link.bind(this);
  }

  link(scope, element, attrs) {
    let rawElement = element[0];

    scope.$watch(attrs.todoFocus, (focused) => {
      if (focused) {
        this.$timeout(() => rawElement.focus(), 0);
      }
    });
  }
}

export default angular.module('app.todo-focus-directive', [])
  .directive('todoFocus', ($injector) => $injector.instantiate(['$timeout', FocusDirective]));

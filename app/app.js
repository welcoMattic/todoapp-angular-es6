import './todo/todo';

angular.module('app', ['ngRoute', 'app.todo'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'TodoController',
        controllerAs: 'controller',
        templateUrl: 'todo/todo.html'
      })
      .when('/:status', {
        controller: 'TodoController',
        controllerAs: 'controller',
        templateUrl: 'todo/todo.html'
      })
      .otherwise({ redirectTo: '/' });
  });

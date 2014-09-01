import './todo/todo';

const x = {};
const y = {};

const w = { x, y };

angular.module('app', ['ngRoute', 'app.todo'])
  .config(function ($routeProvider) {
    const x = {};
    const y = {};

    {
      const x = {};
      const y = {};

      const w = { x, y };
    }

    const w = { x, y };

    $routeProvider
      .when('/', {
        controller: 'TodoController',
        controllerAs: 'controller',
        templateUrl: 'todo/todo.html'
      })
      .otherwise({ redirectTo: '/' });
  });

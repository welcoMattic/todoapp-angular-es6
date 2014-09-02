const STORAGE_ID = 'todoapp-angular-es6';

class TodoStorageService {
  get() {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }

  put(todos) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }
}

export default angular.module('app.todo-storage-service', [])
  .service('TodoStorageService', TodoStorageService);

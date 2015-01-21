app.config([
  '$routeProvider',
  function($routeProvider){
  $routeProvider.otherwise('/shopping-cart');
}]);
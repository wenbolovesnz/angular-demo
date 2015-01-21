app.config([
  '$routeProvider',
  function($routeProvider){
  $routeProvider.when('/shopping-cart', {
    template : '<shopping-cart></shopping-cart>'
  });
}]);


app.directive('shoppingCart', function(){
  return {
    restrict : 'E',
    replace : true,
    templateUrl : 'shopping-cart.html'
  }
});
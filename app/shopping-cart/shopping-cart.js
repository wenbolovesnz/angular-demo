app.config([
  '$routeProvider',
  function($routeProvider){
  $routeProvider.when('/shopping-cart', {
    template : '<shopping-cart></shopping-cart>'
  });
}]);


app.directive('shoppingCart', function(){
  function getProduct(){
    return { name: 'Eternal Teeshirt', exclPrice: 260.86956, taxRate: 0.15 };
  };

  return {
    restrict : 'E',
    replace : true,
    templateUrl : 'shopping-cart.html',
    controller : ['$scope', 'math', function($scope, math){
      $scope.products = [];

      $scope.taxed = function(price, rate){
        return math
          .chain(rate)
          .add(1)
          .multiply(price)
          .round(2)
          .done();
      }

      $scope.summary = function(){
        var subTotal = math.chain(0);
        var tax = math.chain(0);
        $scope.products.forEach(function(product){
          subTotal = subTotal.add(product.exclPrice).round(2);
          tax = tax.add(
            math
            .chain(product.exclPrice)
            .multiply(product.taxRate)
            .round(2)
            .done()
          ).round(2);
        });

        $scope.subTotal = subTotal.done();
        $scope.tax = tax.done();
        $scope.total = math
          .chain($scope.subTotal)
          .add($scope.tax)
          .done();
      };

      $scope.addProducts = function(){
        $scope.products.push(getProduct())
      };

      $scope.clearAll = function(){
        $scope.products = [];
      };

      $scope.$watch('products', $scope.summary, true);

      $scope.summary();
    }]
  }
});
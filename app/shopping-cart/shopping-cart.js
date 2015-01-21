app.config([
  '$routeProvider',
  function ($routeProvider){
  $routeProvider.when('/shopping-cart', {
    template : '<shopping-cart></shopping-cart>'
  });
}]);

app.directive('shoppingCart', [ 
  'math', 'productService',
  function (math, productService){

    return {
      restrict : 'E',
      replace : true,
      templateUrl : 'shopping-cart.html',
      controller : ['$scope', function ($scope){
        $scope.summary = function(){
          var subTotal = math.chain(0);
          var total = math.chain(0);
          $scope.products.forEach(function(product){
            productService.sumProduct(product);
            subTotal = subTotal.add(product.subTotal);
            total = total.add(product.total);
          });

          $scope.subTotal = subTotal.done();
          $scope.total = total.round(2).done();
          $scope.tax = math.chain($scope.total).subtract($scope.subTotal).round(2).done();
        };

        $scope.addProducts = function(){
          $scope.products.push(productService.getProduct())
        };

        $scope.removeProduct = function(product){
          $scope.products.splice(
            $scope.products.indexOf(product)
          ,1);
        }

        $scope.reset = function(){
          $scope.products = [];
          $scope.discount = 0;
          $scope.inclusive = true;
        }

        $scope.$watch('products', $scope.summary, true);

        $scope.reset();
        $scope.summary();
      }]
    }
  }
]);
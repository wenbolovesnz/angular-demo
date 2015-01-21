app.service('productService', [
  'math',
  function (math){
    function sumProduct(product){
      product.total = math
        .chain(product.inclPrice)
        .multiply(product.quantity)
        .round(2)
        .done();

      //calculate subTotal
      product.subTotal = math
        .chain(product.exclPriceRound)
        .multiply(product.quantity)
        .round(2)
        .done();
    }

    function inclPrice(price, rate){
      return math
        .chain(rate)
        .add(1)
        .multiply(price)
        .round(2)
        .done();
    }

    this.getProduct = function(){
      //fetching from server.
      var product = { name: 'Eternal Teeshirt', exclPrice: 260.86956, taxRate: 0.15 };

      //calculate tax
      product.exclPriceRound = math
        .chain(product.exclPrice)
        .round(2)
        .done();
      product.inclPrice = inclPrice(product.exclPriceRound, product.taxRate);

      //default quantity
      product.quantity = 1;

      //calculate total
      sumProduct(product);
      return product;
    };

    this.sumProduct = sumProduct;
  }
]);
    
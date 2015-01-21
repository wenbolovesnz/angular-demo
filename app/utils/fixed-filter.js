app.filter('fixed', function(){
  return function(number, limit){
    limit = limit || 2;
    return parseFloat(number).toFixed(limit);
  };
});
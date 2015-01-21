"use strict";

var app = angular.module('app', [
  'ngAnimate',
  'ngTouch',
  'ngRoute',
  'app.templates'
]);


angular.element(document).ready(function(){
  angular.bootstrap(document, ['app']);
});
  
angular.module('authService', [])

// factory for handling tokens
// inject $window to store token client-side
.factory('AuthToken', function($window) {

  // create authToken factory object
  var authTokenFactory = {};

  // get the token out of local storage
  authTokenFactory.getToken = function() {
    return $window.localStorage.getItem('token');
  };

  // function to set the token or clear the token
  // if a token is passed, set the token
  // if there is no token, clear it from lcoal storage
  authTokenFactory.setToken = function(token) {
    if (token)
      $window.localStorage.setItem('token', token);
    else
      $window.localStorage.removeItem('token');
  };

  return authTokenFactory;

})

// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
.factory('Auth', function($http, $q, AuthToken) {

  // create auth factory object
  var authFactory = {};

  // handle login

  // handle logout

  // check uf yser is logged in

  // get the user info

  //return auth factory object
  return authFactory;

})

// application configuration to integrate token into requests
.factory('AuthInterceptor', function($q, AuthToken) {

  // create AuthInterceptor factory object
  var authInterceptorFactory = {};

  // attach the token to every request

  // redirect if a token deosn't authenticate

  return authInterceptorFactory;

});

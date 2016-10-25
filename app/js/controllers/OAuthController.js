angular.module('juiceShop').controller('OAuthController', [
  '$window',
  '$location',
  '$cookieStore',
  '$base64',
  'UserService',
  function ($window, $location, $cookieStore, $base64, userService) {
    'use strict'

    userService.oauthLogin(parseResponseParameters().access_token).success(function (profile) {
      userService.save({email: profile.email, password: $base64.encode(profile.email)}).success(function () {
        login(profile)
      }).error(function (error) { // eslint-disable-line handle-callback-err
        login(profile)
      })
    }).error(function (error) {
      invalidateSession(error)
      $location.path('/login')
    })

    function login (profile) {
      userService.login({ email: profile.email, password: $base64.encode(profile.email) }).success(function (authentication) {
        $cookieStore.put('token', authentication.token)
        $window.sessionStorage.bid = authentication.bid
        $location.path('/')
      }).error(function (error) {
        invalidateSession(error)
        $location.path('/login')
      })
    }

    function invalidateSession (error) {
      console.log(error)
      $cookieStore.remove('token')
      delete $window.sessionStorage.bid
    }

    function parseResponseParameters () {
      var hash = $location.path().substr(1)
      var splitted = hash.split('&')
      var params = {}
      for (var i = 0; i < splitted.length; i++) {
        var param = splitted[ i ].split('=')
        var key = param[ 0 ]
        var value = param[ 1 ]
        params[ key ] = value
      }
      return params
    }
  }])
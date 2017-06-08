angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {
 
 var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  // set loading to true first time while we retrieve songs from server.
  showLoading();
 

  Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      hideLoading();
      $scope.currentSong.loaded = true;
    });


   

  

     $scope.sendFeedback = function (bool) {
      

       if (bool) User.addSongToFavorites($scope.currentSong);

    // set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    $timeout(function() {
      // $timeout to allow animation to complete before changing to next song
      // set the current song to one of our three songs
      Recommendations.nextSong();
      //var randomSong = Math.round(Math.random() * ($scope.songs.length - 1));

      // update current song in scope
      $scope.currentSong = Recommendations.queue[0];
       $scope.currentSong.loaded = false;

    }, 250);
     Recommendations.playCurrentSong().then(function() {
    $scope.currentSong.loaded = true;

  });
   }

  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }

    return '';
  }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User, $window) {
  // get the list of our favorites from the user service
   $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }

  $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }

  $scope.favorites = User.favorites;
  $scope.username = User.username;


})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations, $window) {
  // stop audio when going to favorites page
  
  $scope.favCount = User.favoriteCount;

$scope.logout = function() {
    User.destroySession();

    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = 'index.html';
  }

  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

    $scope.leavingFavorites = function() {
    Recommendations.init();
  
  }

   

})

.controller('SplashCtrl', function($scope, $state, User) {
  // attempt to signup/login via User.auth
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function(){
      // session is now set, so lets redirect to discover page
      $state.go('tab.discover');

    }, function() {
      // error handling here
      alert('Hmm... try another username.');

    });
  }
});
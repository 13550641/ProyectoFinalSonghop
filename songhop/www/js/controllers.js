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
.controller('FavoritesCtrl', function($scope, User) {
  // get the list of our favorites from the user service
   $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }
  $scope.favorites = User.favorites;

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations) {
  // stop audio when going to favorites page
  
  $scope.enteringFavorites = function() {
    Recommendations.haltAudio();

    $scope.leavingFavorites = function() {
    Recommendations.init();
  }
  }

});
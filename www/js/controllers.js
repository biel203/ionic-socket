angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope) {
  $scope.onlineList = [];
  $scope.atRoom = false;
  $scope.currentRoom = false;
  $scope.encryptKey = '@teste%123@';

  $rootScope.socket.on('new-room-info', function (data) {
    if (!window.room) {
      window.room = {};
    }
    window.room[data.roomId] = {encryptKey: data.encryptKey};
  });

  $scope.onSendmessage = function (text) {
    $rootScope.socket.emit('test-emit', text);
  };

  $rootScope.socket.on('new-join-member', function (onlineList) {
    $scope.$apply(function () {
      $scope.onlineList = onlineList;
    })
  });

  $rootScope.socket.on('current-room', function (roomId) {
    $scope.currentRoom = roomId;
  });

  $rootScope.socket.on('receive-private-message', function(msg) {
    var key = window.room[$scope.currentRoom].encryptKey;
    msg = CryptoJS.AES.decrypt(msg, key);
    msg = msg.toString(CryptoJS.enc.Utf8);
    alert(msg)
    $scope.$apply(function () {

    });

  });

  $scope.joinRoom = function (id) {
    $rootScope.socket.emit('private-join', {receiverId: id, encryptKey: $scope.encryptKey});

    $scope.atRoom = true;
  };

  $scope.onSendMessage = function (text) {
    var bytes = CryptoJS.AES.encrypt(text, $scope.encryptKey);
    $rootScope.socket.emit('send-private-message', bytes.toString());
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

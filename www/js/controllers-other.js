angular.module('starter.controllers-other', [])


.controller('AccountCtrl', function($scope, Listener, Variables, FB_URL) {

    //
    //
    $scope.Metric = Variables.Metric;
    $scope.listener = Listener;
    $scope.formData = {};
    for (var key in Listener.config) {
      if (Listener.config.hasOwnProperty(key)) {
        $scope.formData[key] = Listener.config[key].split(', ')[0];
      }
    }
    //$scope.formData = angular.copy(Listener.config);
    var ref = new Firebase(FB_URL);

    $scope.apply = function() {
      if (window.location.href.indexOf('localhost') > -1) {
        alert('게스트는 바꿀 수 없어요 T^T');
        return;
      }

      ref.child('rooms').child(Listener.room).child('config')
        .set($scope.formData, function() {
          console.debug('successfully updated $scope.formData:', $scope.formData);
          alert('저장완료');
          //Listener.init();
        });
    };

    $scope.changeMetric = function() {
        Variables.changeMetric();
    };

    $scope.openLink = function(link) {
        console.log("opening link", link)
        if(link != undefined && link != ""){
            window.open(link, '_blank', 'location=yes, enableViewPortScale=yes');
        };
    };
})




// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
//
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
.controller('BluetoothCtrl', function(
  $scope, Bluetooth, Listener, FB_URL, $firebaseObject) {

    $scope.bluetooth = Bluetooth;

    Bluetooth.list().then(function(devices) {
      $scope.devices = devices;
    });

    $scope.connect = function(id) {
      Bluetooth.connect(id).then(function() {
        $scope.connectedId = id;
      })
    }

})

.controller('HistoryCtrl', function(
    $scope, $state, History, $ionicPopup, Utils, $ionicListDelegate, $ionicModal,
    Share, Timer, Variables, Listener, FB_URL, $firebaseObject) {

    var ref = new Firebase(FB_URL);
    var roomsRef = ref.child('rooms');
    var roomsObj = $firebaseObject(roomsRef);
    roomsObj.$bindTo($scope, 'rooms');
    $scope.listener = Listener;

    $scope.formData = {};
    $scope.createRoom = function() {
      roomsRef.child($scope.formData.newRoom).child('messages').push({
        msg: '새로운 채널',
        time: new Date().getTime()
      });
      $scope.formData = {};
    };

    $scope.selectRoom = function(room) {
      Listener.room = room;
    };


    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    $scope.data = {};

    $scope.openLink = function(link) {
        console.log("opening link", link)
        if(link != undefined && link != ""){
            window.open(link, '_blank', 'location=yes, enableViewPortScale=yes');
        };
    };

    $ionicModal.fromTemplateUrl('share-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(sharemodal) {
        $scope.sharemodal = sharemodal;
    });
    $scope.openShareModal = function(shareType, index) {

        var currentIndex        = $scope.HistTimers.length-index-1;
        var currentHistTimer    = $scope.HistTimers[currentIndex];

        console.log(shareType)

        switch (shareType) {
            case "element":
                //
                $scope.data["defaultShareText"] = Utils.generateShareText(
                                                "element",
                                                $scope.TransModes[currentHistTimer.transModeIndex].movementVerb,
                                                currentHistTimer.totalTime,
                                                currentHistTimer["totalTimeTravelled"].value,
                                                currentHistTimer["totalTimeTravelled"].metric_large)
                break
            case "total":
                //
                $scope.data["defaultShareText"] = Utils.generateShareText(
                                                "total",
                                                null,
                                                null,
                                                $scope.histTimerTotal.value,
                                                $scope.histTimerTotal.metric_large)
                break
        }
        $scope.sharemodal.show();
    };
    $scope.closeShareModal = function() {
        $scope.sharemodal.hide();
    };
    $scope.shareTimer = function(medium) {

        switch (medium) {
            case "facebook":
                //
                Share.inviteFacebook(null, $scope.data["defaultShareText"]);
                break
            case "twitter":
                //
                Share.inviteTwitter(null, $scope.data["defaultShareText"]);
                break
            case "whatsapp":
                //
                Share.inviteWhatsapp(null, $scope.data["defaultShareText"]);
                break
            case "email":
                //
                Share.inviteEmail(null, $scope.data["defaultShareText"]);
                break
            default:
                //
                //
                Share.inviteGeneral(null, $scope.data["defaultShareText"]);
                break
        }

    };

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------


    $scope.$on("$ionicView.enter", function (event, data) {
        refreshView();
    });

    function refreshView() {

        $scope.HistTimers       = History.getHistTimers();
        $scope.histTimerTotal   = Utils.normalizeTimeTravelled(History.getTotalHistTimers());
        $scope.TransModes       = Variables.TransModes;

    };


    //Utils.normalizeTimeString(totalTimeObj.totalTimeFuture);


    $scope.goBack = function() {
        $state.go("dash");
    };

    $scope.clearHistTimer = function() {
        // prompt

        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete all saved timers',
         cancelType: "button-light cornered",
         okType: "button-energized cornered"
       });
       confirmPopup.then(function(res) {
         if(res) {
           History.clearHistTimer();
            refreshView();
         } else {
           console.log('You are not sure');
         }
       });

    };

    $scope.deleteHistTimer = function(TID) {

        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete saved timer',
         cancelType: "button-light cornered",
         okType: "button-energized cornered"
       });
       confirmPopup.then(function(res) {
         if(res) {
           History.deleteHistTimer(TID);
            refreshView();
         } else {
           console.log('You are not sure');
         }
       });


    };

    $scope.editNotesTimer = function(index) {

        //
        // reverse index
        var currentIndex = $scope.HistTimers.length-index-1;

        // An elaborate, custom popup
        var TID = $scope.HistTimers[currentIndex].TID;

        $scope.data = {wifi: $scope.HistTimers[currentIndex].notes};

        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.wifi" class="popup-input">',
            title: 'Add notes to your session (optional)',
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type: "button-light"
              },
              {
                text: '<b>Save</b>',
                type: 'button-positive cornered',
                onTap: function(e) {
                  if (!$scope.data.wifi) {
                    //don't allow the user to close unless he enters wifi password
                    return "";
                  } else {
                    return $scope.data.wifi;
                  }
                }
              }
            ]
        });

        myPopup.then(function(optionalNotes) {
            console.log('Tapped!', optionalNotes);
            // success
            if(optionalNotes != undefined) {
                History.editNotesTimer(TID, optionalNotes);
                refreshView();
            };

        });

    };


    $scope.closeOptionButtons = function() {
        $ionicListDelegate.closeOptionButtons();
    };
})


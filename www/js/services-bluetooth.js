app.factory('Bluetooth', function ($q) {

  var o = {
    devices: [],
    connectedId: ''
  };

  o.list = function() {
    var deferred = $q.defer();
    console.log("Looking for Bluetooth Devices...");

    if (bluetoothSerial) {
      bluetoothSerial.list(function(devices) {
        console.log('Bluetooth.list - success');
        o.devices = devices;
        for (i = 0; i < devices.length; i++) {
          var obj = devices[i];
          console.log('Device', i, ':', JSON.stringify(obj, null, 4));
        }
        deferred.resolve(devices);
      }, function(error) {
        console.log('Bluetooth.list - error');
        deferred.reject(error);
      });
    } else {
      console.log('Bluetooth.list - unavailable');
    }

    return deferred.promise;
  };

  o.connect = function(id) {
    var deferred = $q.defer();

    if (bluetoothSerial) {
      bluetoothSerial.connectInsecure(id, function() {
        console.log('Bluetooth.connect - connected to id:', id);
        o.connectedId = id;
        deferred.resolve();
      }, function() {
        console.log('Bluetooth.connect - failed');
        deferred.reject();
      });
    } else {
      console.log('Bluetooth.connect - unavailable');
    }

    return deferred.promise;
  };

  o.write = function(msg) {
    if (bluetoothSerial) {
      bluetoothSerial.write(msg);
      console.log('Bluetooth.write - sent:', msg);
    } else {
      console.log('Bluetooth.write - unavailable');
    }
  };

  return o;
});

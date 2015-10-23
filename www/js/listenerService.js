(function (annyang) {
  'use strict';

  angular.module('starter').factory('Listener', function($rootScope, Bluetooth, FB_URL) {
    var o = {
      commands: {},
      results: [],
      on: false,
      room: '끼허브',
      langs: [
        {},
        { name: '한글', code: 'ko' },
        { name: '영어', code: 'en-US' },
        { name: '일본어', code: 'ja' },
        { name: '스페인어', code: 'es-US' },
        { name: '포르투갈어', code: 'pt-BR' },
        { name: '중국어', code: 'zh-CN' }
      ],
      defaultConfig: {
        lang: 'en-US',
        trigger: 'bike',
        go: 'go',
        stop: 'stop',
        left: 'left',
        right: 'right'
      },
      config: {}
    };

    var ref = new Firebase(FB_URL);

    // Initialize with a custom phrase. Defaults to 'bike'
    o.init = function(customTrigger) {
      o.clearResults();
      var configRef = ref.child('rooms').child(o.room).child('config');
      //if (customTrigger === undefined) {
      //  customTrigger = o.config.trigger;
      //}
      configRef.once('value', function(snapshot) {
        o.config = snapshot.val();
        if (!o.config) { o.config = o.defaultConfig; }
        o.setLanguage(o.config.lang);
        o.setTrigger(o.config.trigger, o.processResult);
        for (var key in o.config) {
          if (o.config.hasOwnProperty(key)) {
            if (o.config[key] === '안서') {
              o.config[key] = '안서, 안써, 안사요, 안소, 은서, 안산역, 안서요';
            } else if (o.config[key] === '왼쪽') {
              o.config[key] = '왼쪽, 외조, 왠 쪽, 왜 줘';
            } else if (o.config[key] === '안가') {
              o.config[key] = '안가, 망각, 안각, 안경';
            } else if (o.config[key] === '가자') {
              o.config[key] = '가자, 하자';
            } else if (o.config[key] === 'right') {
              o.config[key] = 'right, ride';
            }
          }
        }
        o.start();
        //o.addResult('what\'s up?');
        console.log('annyang initiated');
      });
    };

    // Remove all existing commands and add a new command.
    o.setTrigger = function(trigger, callback) {
      o.removeCommands();
      o.addCommand(trigger + ' *term', callback);
    };

    //o.addCommands = function(commands) {
    //  annyang.addCommands(commands);
    //};

    // If no input, remove all. Otherwise, remove the specified command
    // either a string of a list of strings
    o.removeCommands = function(commandsToRemove) {
      annyang.removeCommands(commandsToRemove);
    };

    o.addCommand = function (phrase, callback) {
      var command = {};

      // Wrap annyang command in scope apply
      command[phrase] = function (args) {
        $rootScope.$apply(callback(args));
      };

      // Extend our commands list
      angular.extend(o.commands, command);

      // Add the commands to annyang
      annyang.addCommands(o.commands);
      console.debug('added command "' + phrase + '"', o.commands);
    };

    o.toggle = function() {
      console.log('Annyang - toggle');
      if (o.on) {
        o.stop();
      } else {
        o.start();
      }
    };

    o.start = function () {
      //annyang.addCommands(o.commands);
      //annyang.debug(true);
      console.log('Annyang - start');
      annyang.start();
      o.on = true;
    };

    o.stop = function() {
      console.log('Annyang - stop');
      annyang.abort();
      o.on = false;
    };

    o.setLanguage = function(language) {
      annyang.setLanguage(language);
    };

    o.processResult = function(result) {
      var icon = '';

      if (o.config.left.split(', ').indexOf(result) > -1) {
        console.log('Listener.assessResult - left');
        icon = 'ion-arrow-left-c';
        Bluetooth.write('a');
      } else if (o.config.right.split(', ').indexOf(result) > -1) {
        console.log('Listener.assessResult - right');
        icon = 'ion-arrow-right-c';
        Bluetooth.write('b');
      } else if (o.config.stop.split(', ').indexOf(result) > -1) {
        console.log('Listener.assessResult - stop');
        icon = 'ion-android-hand';
        Bluetooth.write('c');
      } else if (o.config.go.split(', ').indexOf(result) > -1) {
        icon = 'ion-android-navigate';
        console.log('Listener.assessResult - go');
        Bluetooth.write('d');
      }

      o.addResult(result, icon);
    };

    o.addResult = function(result, icon) {
      if (!icon) {
        icon = '';
      }

      var temp = {
        msg: result,
        time: new Date().getTime(),
        icon: icon
      };

      o.results.unshift(temp);
      ref.child('rooms').child(o.room).child('messages').push(temp);

      console.debug(o.results[0].icon, o.results[0].msg, o.results[0].time);
    };

    o.clearResults = function() {
      o.results.length = 0;
    };

    //o.pause = function() {
    //  console.log('Annyang - pause');
    //  annyang.pause();
    //  o.on = false;
    //};

    //o.resume = function() {
    //  console.log('Annyang - pause');
    //  annyang.resume();
    //  o.on = true;
    //};


    return o;
  });

}(window.annyang));

(function (annyang) {
  'use strict';

  angular.module('starter').factory('Listener', function($rootScope, Bluetooth, FB_URL) {
    var o = {
      commands: {},
      results: [],
      on: false,
      room: '한국어',
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
        trigger: 'I am ',
        happy: 'happy',
        angry: 'angry',
        sad: 'sad',
        joyful: 'joyful'
      },
      config: {}
    };

    var ref = new Firebase(FB_URL);

    // Initialize with a custom phrase. Defaults to 'bike'
    o.init = function(customTrigger) {
      annyang.debug();
      //o.stop();
      o.clearResults();
      var configRef = ref.child('rooms').child(o.room).child('config');
      //if (customTrigger === undefined) {
      //  customTrigger = o.config.trigger;
      //}
      configRef.once('value', function(snapshot) {
        o.config = snapshot.val();
        if (!o.config) { o.config = o.defaultConfig; }
        console.log('Listener.init - o.config.lang:', o.config.lang);
        o.setLanguage(o.config.lang);
        //o.setLanguage('zh-cmn');
        o.setTrigger(o.config.trigger, o.processResult);
        for (var key in o.config) {
          console.log(key);
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
            } else if (o.config[key] === '멈춰') {
              o.config[key] = '멈춰, 멈춰라, 멈춰요'
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
      console.log(trigger);
      o.removeCommands();
      o.addCommand(trigger + '*term', callback);
      //o.addCommand('你好*', function() {
      //  alert('I got you.');
        //o.init();
        //o.stop();
        //setTimeout(function() {
        //  o.start();
        //}, 1000)
      //});

      //o.addCommand('안녕 ()', function() {
      //  console.log('안녕');
      //});
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
      console.log('Listener.processResult - result:', result);
      result = result.trim();
      var icon = '';
      console.log(o.config.happy.split(', '));

      if (o.config.happy.split(', ').indexOf(result) > -1) {
        console.log('Listener.assessResult - happy');
        icon = 'happy';
        Bluetooth.write('a');
      } else if (o.config.angry.split(', ').indexOf(result) > -1) {
        console.log('Listener.assessResult - angry');
        icon = 'angry';
        Bluetooth.write('b');
      } else if (o.config.sad.split(', ').indexOf(result) > -1) {
        console.log('Listener.assessResult - sad');
        icon = 'sad';
        Bluetooth.write('c');
      } else if (o.config.joyful.split(', ').indexOf(result) > -1) {
        icon = 'joyful';
        console.log('Listener.assessResult - joyful');
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

(function (annyang) {
  'use strict';

  angular.module('starter').factory('Listener', function($rootScope) {
    var o = {
      commands: {},
      results: [],
      on: false
    };

    // Initialize with a custom phrase. Defaults to 'bike'
    o.init = function(customPhrase) {
      o.clearResults();
      if (customPhrase === undefined) {
        customPhrase = 'bike';
      }
      o.setMyCommand(customPhrase, o.processResult);
      o.start();
      o.results = [
        { msg: 'go away from me you bastard. here is a longer string.', time: '1'},
        { msg: 'left', time: '2'},
        { msg: 'right', time: '3'}
      ];
      console.log('annyang initiated');
    };

    // Remove all existing commands and add a new command.
    o.setMyCommand = function(customPhrase, callback) {
      o.removeCommands();
      o.addCommand(customPhrase + ' *term', callback);
    };

    o.addCommands = function(commands) {
      annyang.addCommands(commands);
    };

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

      switch(result) {
        case '좌로':
        case 'left':
          console.log('Listener.assessResult - left');
          icon = 'ion-arrow-left-c';
          break;
        case '우로':
        case 'right':
          console.log('Listener.assessResult - right');
          icon = 'ion-arrow-right-c';
          break;
        case '멈춰':
        case 'stop':
          console.log('Listener.assessResult - stop');
          icon = 'ion-android-hand';
          break;
        case '가자':
        case 'go':
          icon = 'ion-android-navigate';
          console.log('Listener.assessResult - go');
        default:
          break;
      }
      o.addResult(result, icon);
    };

    o.addResult = function(result, icon) {
      //console.debug(result);

      o.results.unshift({
        msg: result,
        time: new Date(),
        icon: icon
      });

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

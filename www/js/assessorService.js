/**
 * Created by gconlab09 on 15. 10. 22..
 */
app.factory('Assessor', function(Listener) {
  var o = {};

  // Initialize with a custom phrase. Defaults to 'bike'
  o.init = function(customPhrase) {
    //o.clearResults();
    if (customPhrase === undefined) {
      customPhrase = 'bike';
    }
    Annyang.setMyCommand(customPhrase, o.addResult);
    Annyang.start();
    console.log('Listener initiated with customPhrase:', customPhrase);
  };



  return o;
});
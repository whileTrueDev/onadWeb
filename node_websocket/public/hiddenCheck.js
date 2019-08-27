exports.modules=$(function(socket){
  
  var socket = socket;
  
  function getHiddenProp(){
  var prefixes = ['webkit','moz','ms','o'];
  
  // test for native support
  if ('hidden' in document) return 'hidden';
  
  //find prefixes
  for (var i = 0; i < prefixes.length; i++){
      if ((prefixes[i] + 'Hidden') in document) 
          return prefixes[i] + 'Hidden';
  }

  // otherwise it's not supported
  return null;
} 

  var visProp = getHiddenProp();
  if (visProp) {
    var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
    document.addEventListener(evtname, changeEventListener , false);
  }else{
    console.log("Page Visibility API doesnt support !");
  }

  function changeEventListener(){
  if(!document[visProp]){
    socket.emit('pageActive', function(){
      console.log('page active')
    })
  }else{
    socket.emit('pageInactive', function(){
      console.log('pageInactive')
    })
  }
  }

  document.addEventListener("DOMContentLoaded", function(){
  document.querySelector("#page").innerHTML = "Page is visible -" + new Date() + "<br>";
  }, false);
  }
)
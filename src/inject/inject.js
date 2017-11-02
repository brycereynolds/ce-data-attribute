function log(msg){
  const style = 'font-size: 13px; background: #bada55; color: #333; padding: 5px 5px 5px 0;';
  console.log(`%c ${msg}`, style);
}

function startup(){
  let dataKeys = document.querySelectorAll('[data-nflx-key]:not([data-nflx-debug-has-found])');

  document.body.classList.add('nflx-debug-mode');

    
  let clipboard = document.getElementById('hidden-clipboard');

  if(!clipboard){
    clipboard = document.createElement('textarea');
    clipboard.setAttribute('id', 'hidden-clipboard');
    document.body.appendChild(clipboard);
  }

  Array.from(dataKeys).forEach(el => {
    if(!el.dataset.nflxDebugHasFound){
        el.addEventListener('click', e => {
        if(e.altKey) {
          e.stopPropagation();
          e.preventDefault();

          log(`${el.dataset.nflxKeyLabel} => ${el.dataset.nflxKey}`);
          clipboard.value = el.dataset.nflxKey;
          clipboard.select();
          document.execCommand('copy');

          return false;
        }
      });
    }
    el.dataset.nflxDebugHasFound = true;
  });
}

chrome.runtime.sendMessage({msg: "status"}, function(response) {
  if(!response){
    log('Error: Internal extension error NO_MSG_RESPONSE');
    return;
  }

  if (response.status === 'DISABLE'){
    log('Debug ID Grabber Disabled');
    return;
  }

  log('Debug ID Grabber Waiting...');

  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      startup();
      log('Debug ID Grabber Ready');

      document.addEventListener('click', startup);
    }
  }, 10);
});

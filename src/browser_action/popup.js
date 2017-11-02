var setLayout = function(){
  var options = document.createElement('div');

  var enable = document.createElement('button');
  enable.appendChild(document.createTextNode('Enable ID Grabber'));

  var disable = document.createElement('button');
  disable.appendChild(document.createTextNode('Disable ID Grabber'));

  document.body.appendChild(options);

  if(!localStorage.status){
    localStorage['status'] = 'DISABLE';
  }
  
  toggle('INITIAL');
  enable.onclick = function(){toggle('ENABLE')};
  disable.onclick = function(){toggle('DISABLE')};
  
  function toggle(n){
    switch(n){
      case 'ENABLE':
        options.removeChild(enable);
        options.appendChild(disable);
        localStorage.status = 'ENABLE';
        return refresh();
        break;
      case 'DISABLE':
        options.removeChild(disable);
        options.appendChild(enable);
        localStorage.status = 'DISABLE';
        return refresh();
        break;
      case 'INITIAL':
        options.appendChild((localStorage.status === 'ENABLE') ? disable : enable);
        chrome.browserAction.setIcon({
          path: (localStorage.status === 'ENABLE')
            ? "icons/icon19.png"
            : "icons/icon19_disabled.png"
        });
        return;
    }
  }

  function refresh(){
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
    });
  }
  
};

document.addEventListener('DOMContentLoaded', setLayout, false);
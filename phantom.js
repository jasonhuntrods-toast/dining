var page = require('webpage').create();
var system = require('system');
var url = system.args[1];
var selector = system.args[2];

page.open(url, function(status) {
  if (status !== 'success') {
    console.log('Failed to load the address');
  } else {
    page.render('.tmp/public/seasons.png');
  }
  phantom.exit();
});

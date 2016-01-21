var twitterAPI = require('node-twitter-api');
var async = require('async');
var nightmare = require('nightmare');

module.exports =  {
  
	breakfast: function() {  
	    async.parallel([
	    	SchedulingService.snapshot("udcc", ".menu-cell"),
	    	SchedulingService.snapshot("seasons", ".menu-cell"),
	    	SchedulingService.snapshot("conversations", ".menu-cell")
	    ], function(err, results) {
	    	if(err) console.log(err);
	    });
	},
  
	lunch: function() {  
	    async.parallel([
	    	SchedulingService.snapshot("udcc", ".menu-cell"),
	    	SchedulingService.snapshot("seasons", ".menu-cell"),
	    	SchedulingService.snapshot("conversations", ".menu-cell"),
	    ], function(err, results) {
	    	if(err) console.log(err);
	    });
	},
  
	dinner: function() {  
    	    async.parallel([
	    	SchedulingService.snapshot("udcc", ".menu-cell"),
	    	SchedulingService.snapshot("seasons", ".menu-cell"),
	    	SchedulingService.snapshot("conversations", ".menu-cell"),
	    	SchedulingService.snapshot("storms", ".menu-cell")
	    ], function(err, results) {
	    	if(err) console.log(err);
	    });
	},
  
	snapshot: function(location, selector) {
  	
  	    var nightmare = Nightmare({ show: true });
  	    
	    nightmare.action('screenshotSelector', function (path, selector, start, end, done) {
	    	debug('.screenshotSelector()');
		if (arguments.length > 3) done = start;
		var self = this;
		this.evaluate_now(function (selector, start, end) {
		    var element = $(document).find(selector);
		    var exists = element.length;
		    if(exists > 0) {
			    if(!end) end = exists;
			    if(!start) start = 0;
			    var left, right, top, bottom = 0;
			    for(var i = start; i < end; i++) {
			      	if(left > element[i].getBoundingClientRect().left) left = element[i].getBoundingClientRect().left;
			      	if(right < element[i].getBoundingClientRect().right) right = element[i].getBoundingClientRect().right;
			      	if(top > element[i].getBoundingClientRect().top) top = element[i].getBoundingClientRect().top;
			      	if(bottom < element[i].getBoundingClientRect().bottom) bottom = element[i].getBoundingClientRect().bottom;
			    }
			    window.scrollTo(Math.round(left), Math.round(top));
			    return {
			        x: Math.round(left),
			        y: Math.round(top),
			        width: Math.round(right - left),
			        height: Math.round(bottom - top)
			    };
		    }
		}, function (a, clip) {
		    if (!clip) {
		    	throw new Error('invalid selector "' + selector + '"');
		    }
		    self.child.once('screenshot', function (img) {
		    	var buf = new Buffer(img.data);
		    	debug('.screenshotSelector() captured with length %s', buf.length);
		    	path ? fs.writeFile(path, buf, done) : done(null, buf);
		    });
		    self.child.emit('screenshot', path, clip);
		}, selector);
		});
		
		var date = new Date().toISOString().slice(0,10);
		var run = yield nightmare().goto('http://dining.iastate.edu/menus/' + location + '/' + date)
		.inject('js', 'node_modules/jquery/dist/jquery.js')
	  	.screenshotSelector('../../.tmp/public/' + location + '.png', 'selector', 0, 5)
	  	.end();
	},
  
	tweet: function() {
    		var twitter = new twitterAPI({
		    consumerKey: sails.config.oauth.CK,
		    consumerSecret: sails.config.oauth.CKS,
		    callback: 'http://104.131.2.65/twitter'
		});
		async.parallel([
			twitter.uploadMedia("../../.tmp/public/udcc.png", sails.config.oauth.AT, sails.config.oauth.ATS),
			twitter.uploadMedia("../../.tmp/public/seasons.png", sails.config.oauth.AT, sails.config.oauth.ATS),
			twitter.uploadMedia("../../.tmp/public/conversations.png", sails.config.oauth.AT, sails.config.oauth.ATS),
			twitter.uploadMedia("../../.tmp/public/storms.png", sails.config.oauth.AT, sails.config.oauth.ATS)
    		], function(err, results) {
	    		if(err) console.log(err);
	    		twitter.statuses("update", {media_ids: results},
	    			sails.config.oauth.AT,
	    			sails.config.oauth.ATS,
	    		function(err, data, response) {
		        	if (error) console.log(err);
		            	return true;
		        	}
	      		);
    	});
    
	}
  
};

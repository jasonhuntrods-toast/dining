/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var twitterAPI = require('node-twitter-api');

module.exports = {
	
	connect: function(req, res) {
		
	var twitter = new twitterAPI({
	    consumerKey: sails.config.oauth.CK,
	    consumerSecret: sails.config.oauth.CKS,
	    callback: 'http://104.131.2.65/twitter'
	});
	if(req.param('oauth_verifier')) {
		twitter.getAccessToken(process.env.RT, process.env.RTS, req.param('oauth_verifier'), function(error, accessToken, accessTokenSecret, results) {
			if (error) {
				console.log(error);
			} else {
				console.log(accessToken);
				console.log(accessTokenSecret);
			}
		});
	} else {
		twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
			if(error) {
				console.log('Error getting OAuth request token : ' + error);
			} else {
				process.env.RT = requestToken;
				process.env.RTS = requestTokenSecret;
				var url = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;
				res.redirect(url);
			}
		});
	}
	
	}
	
};


const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
const oauth = require('oauth');
const _twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const _twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const twitterCallbackUrl = process.env.TWITTER_CALLBACK_URL;

const consumer = new oauth.OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	_twitterConsumerKey,
	_twitterConsumerSecret,
	"1.0A",
	twitterCallbackUrl,
	"HMAC-SHA1"
);

router.get('/connect', (req, res) => {
	consumer.getOAuthRequestToken(function (error, oauthToken,   oauthTokenSecret, results) {
		if (error) {
			res.send(error, 500);
		} else {
			req.session.oauthRequestToken = oauthToken;
			req.session.oauthRequestTokenSecret = oauthTokenSecret;
			const redirect = { 
				redirectUrl: `https://twitter.com/oauth/authorize?oauth_token=${req.session.oauthRequestToken}`
			}
			res.send(redirect);
		}
	});
});

router.get('/getPosts', (req, res) => {
	const client = new Twitter({
		consumer_key: _twitterConsumerKey,
		consumer_secret: _twitterConsumerSecret,
		access_token_key: req.query.oauthAccessToken,
		access_token_secret: req.query.oauthAccessTokenSecret
	});

	const params = {};

	client.get('statuses/home_timeline', params, function(error, tweets, response) {
		if (!error) {
			console.log(tweets);
			res.send({
				success: true,
				posts: tweets
			});
		} else {
			res.status(500);
			res.send({
				success: false
			});
		}

	});
	
});

router.get('/getAccessTokens', (req, res) => {
	consumer.getOAuthAccessToken(
		req.query.oauth_token,
		req.session.oauthRequestTokenSecret,
		req.query.oauth_verifier,
		(error, oauthAccessToken, oauthAccessTokenSecret, results) => {
			if (error) {
				res.send(error, 500);
			}
			else {
				req.session.oauthAccessToken = oauthAccessToken;
				req.session.oauthAccessTokenSecret = oauthAccessTokenSecret
				return res.send({
					success: true,
					oauthAccessToken,
					oauthAccessTokenSecret
				});
			}
		}
	);
});

module.exports = router;
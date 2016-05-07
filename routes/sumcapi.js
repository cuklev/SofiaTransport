var request = require('request');

module.exports = {
	timingHandler: function(req, res) {
		var url = 'http://drone.sumc.bg/api/v1/timing';

		var options = {
		  method: 'post',
		  body: req.body,
		  json: true,
		  url: url
		};

		console.log(options);

		// Maybe implement caching

		request(options, function (err, res1, body) {
		  if(err) {
			console.log('Error:', err);
			return;
		  }

		  res.send(body);
		});
	}
};

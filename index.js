var Browser = require('zombie')

var Serender = {};

// print logs to try to understand what's happening
var logger = function (text) {
  if (Serender.logs) {
    console.log(text);
  }
};

Serender.configure = function (data) {
  // port where our express application is running
  Serender.port = data.port;
  // time until we should expire the saved view
  // TODO expire the view after this value has reached its limit
  Serender.expires = data.expires;

  Serender.logs = data.logs || false;
  Browser.localhost('localhost', Serender.port)
}



Serender.cache = function(req, res, next) {

  logger(req.originalUrl)
  var start = new Date().getTime();
  if (req.header && req.headers.serender) {
    logger('second time processing this, we will ignore it now')
    return next();
  }

  logger('saving for the first time this route')


  var browser = new Browser()
  browser.headers = req.headers;
  browser.headers['serender'] = true;

  browser.visit(req.originalUrl, function() {
    res.set(browser.response.headers.toObject());
    var end = new Date().getTime();
    var time = end - start;
    logger('Execution time: ' + time);
    res.send('<!doctype html>' + browser.document.documentElement.outerHTML);
  });

}

module.exports = Serender;


var UrlSearchParams = require('url-search-params');
var searchParams = new UrlSearchParams(window.location.search);

module.exports = searchParams;
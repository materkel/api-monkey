'use strict';

// API Monkey Middleware
module.exports = () => {
  return function(req, res, next){
    /**
     * Set all monkey headers on the request object
     * for easy access and use in follow up request
     */
    const monkeyHeaders = {};
    Object.keys(req.headers).forEach(header => {
      if (header.split('_')[0] === 'monkey') {
        monkeyHeaders[header] = req.get(header);
      }
    });
    req.monkeyHeaders = monkeyHeaders;

    /*
     * Check if a header is directed at the current
     * handled route and initiate delay / error
     * accordingly
     */
    const path = req.path.split('/').join('_');
    const id = `monkey_${req.method}${path}`;
    const header = req.get(id);

    if (header) {
      let [ delay, error ] = header.split('/');
      error = (error === 'true') ? new Error(`500`) : null;
      delay = (delay !== 'none') ? delay : 0;
      return setTimeout(next, delay, error);
    }
    next()
  };
}

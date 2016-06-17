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
    const path = req.path.split('/').filter(x => x !== '');
    const id = ['monkey', req.method].concat(path);
    let header = null;

    for (let monkeyHeader in monkeyHeaders) {
      const headerTokens = monkeyHeader.split('_');
      let match = true;
      for (let i = 0; i < headerTokens.length; i++) {
        if (id[i]) {
          if (headerTokens[i] === '*') {
            // If the monkey header ends with a "*", make sure the
            // current route ends too, else don't match
            if ((i === headerTokens.length - 1) && (id[++i] !== undefined)) {
              match = false;
              break;
            }
            continue;
          }
          if (headerTokens[i] === '**') {
            break;
          }
          if (id[i].toLowerCase() === headerTokens[i].toLowerCase()) {
            continue;
          }
        }
        match = false;
        break;
      }
      if (match === true) {
        header = monkeyHeaders[monkeyHeader];
        break;
      }
    }

    if (header) {
      let [ delay, error ] = header.split('/');
      // set error code
      switch (error) {
        case 'true':
          error = 500;
          break;
        case 'none':
          error = null;
          break;
        default:
          // set custom error if specified
          error = parseInt(error);
      }
      delay = (delay !== 'none') ? delay : 0;

      if (error !== null) {
        return setTimeout(() => res.status(error).end(), delay);
      }
      return setTimeout(next, delay);
    }
    next();
  };
}

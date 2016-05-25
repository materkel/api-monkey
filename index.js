'use strict';

// API Monkey Middleware
module.exports = () => {
  return function(req, res, next){
    const path = req.path.split('/').join('_');
    const id = `Monkey_${req.method}${path}`;
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

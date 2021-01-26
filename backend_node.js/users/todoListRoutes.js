'use strict';

module.exports = function(app) {
  var userHandlers = require('./user.service');

  app.route('/auth/forgot_password')
    .post(userHandlers.forgot_password);
    
  app.route('/auth/reset_password')
    .post(userHandlers.reset_password);
};

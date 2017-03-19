var _ = require('lodash');

var ClientManager = function() {
    this._clients = [];
};

ClientManager.prototype.register = function(connection, user) {
    //TODO: check if client already exists? Can we use the same socket?
    //TODO: hier könnten wir in unterschiedliche Applikationen unterteilen, damit nicht immer alle user alles bekommen
    this._clients.push({connection: connection, user: user});
};

ClientManager.prototype.unregister = function(connection) {
    this._clients = _.filter(this._clients, function(c) {
        return c.connection !== connection;
    });
};

ClientManager.prototype.getClientUsernames = function() {
    return _.map(this._clients, function(c) {
        return c.user.username;
    });
};

module.exports = ClientManager;
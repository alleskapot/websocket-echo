var SocketEvent = function(connection, data) {
    this.connection = connection;
    this.type = data.event;
    this.data = data.data;
};

module.exports = SocketEvent;
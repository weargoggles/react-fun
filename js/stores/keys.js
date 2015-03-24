var Dispatcher = require('flux').Dispatcher;
var events = require('events');
var Immutable = require('immutable');

var CHANGE_EVENT = 'CHANGE';

var keys = Immutable.List();

var KeyStore = assign({}, events.EventEmitter.prototype, {
    getKeys: function () {
        return keys;
    },
    keyPressed: function (keyCode) {
        keys = keys.push(keyCode);
    },
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    dispatcherIndex: Dispatcher.register(function (payload) {
        var action = payload.action;
        return true;
    })

});

module.exports = KeyStore;



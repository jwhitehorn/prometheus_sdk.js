var request = require('request');
var async   = require('async');

var Prometheus;
Prometheus = (function() {
  function Prometheus(baseUrl, id) {
    this.id = id;
    this.baseUrl = baseUrl;
  }

  Prometheus.load = function(baseUrl, id, callback) {
    return callback(null, new Prometheus(baseUrl, id));
  };

  Prometheus.create = function(baseUrl, inputs, callback) {
    var parameters, url;
    url = baseUrl + "/create";
    parameters = {
      input_nodes: inputs
    };
    return request({
      url: url,
      qs: parameters
    }, function(err, response, body) {
      var obj;
      if (err != null) {
        return callback(err);
      }
      obj = JSON.parse(response.body);
      return callback(null, new Prometheus(baseUrl, obj.id));
    });
  };

  Prometheus.prototype.learn = function(inputs, output, callback) {
    var parameters, url;
    url = this.baseUrl + "/learn";
    parameters = {
      id: this.id,
      inputs: JSON.stringify(inputs),
      output: output
    };
    return request({
      url: url,
      qs: parameters
    }, function(err, response, body) {
      return callback(err);
    });
  };

  Prometheus.prototype.query = function(inputs, callback) {
    var parameters, url;
    url = this.baseUrl + "/query";
    parameters = {
      id: this.id,
      inputs: JSON.stringify(inputs)
    };
    return request({
      url: url,
      qs: parameters
    }, function(err, response, body) {
      return callback(err, JSON.parse(response.body).output);
    });
  };

  Prometheus.prototype.info = function(callback){
    var url = this.baseUrl + "/info";
    var parameters = { id: this.id };
    request({url: url, qs: parameters}, function(err, response, body){
      callback(err, JSON.parse(response.body));
    });
  };

  return Prometheus;

})();

module.exports = Prometheus;

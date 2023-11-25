var elasticsearch = require('elasticsearch');
var path = require('path');
var config = require(path.join(__dirname, '..', '..', 'config', 'appConfig'));
var check = require(path.join(__dirname, '..', '..', '..', 'util', 'checkTypes'));

var elasticClient = null;

var connectElastic = function() {
    var connectionInfo = {};

    if (config.env == "dev") {
        connectionInfo = {
            host: [config.eshost, config.eshost1],
            log: 'info',
            requestTimeout: 3600000 //60 mins
        };
    } else {
        connectionInfo = {
            hosts: config.esremotehost,
            connectionClass: require('http-aws-es'),
            amazonES: {
                region: config.awsRegion,
                accessKey: config.esAccessKey,
                secretKey: config.esSecretKey
            },
            log: 'info',
            requestTimeout: 3600000 //60 mins
        };
    }

    elasticClient = new elasticsearch.Client(connectionInfo);

    if (!elasticClient)
        throw new Error('ES client is not connected');

    console.log('Elasticsearch client is connected.');
}

exports.connectElastic = connectElastic;

exports.getElastic = function() {
    //Retry, so next data instance call will be successful 
    if (check.isUndefinedOrNullOrEmpty(elasticClient))
        connectElastic();

    return elasticClient;
}
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var kafka_node_1 = require("kafka-node");
//TODO: error handling lol
//TODO: comments lol
//TODO: unified class interface for kafka, rabbitmq, and redis
/**
 * TODO:
 * - ConsumerStream
 * - ProducerStream
 * - Bi-directional communication
 * - Add topic (maybe auto-add missing topics)
 * - Full Consumer functionality
 * - Full Producer functionality
 * - Refactoring
 * - Abstraction of options to be interchangeable with rabbitmq/redis
 */
/**
 * An abstraction to the kafka-node library.
 * @param topics Kafka topics
 * @param host Kafka host
 * @param options Kafka client options
 * @param callback Callback to be called when the producer has connected to kafka.
 */
var CHKafka = /** @class */ (function () {
    function CHKafka(topics, host, callback, options) {
        this.topics = topics;
        this.options = options !== null && options !== void 0 ? options : {};
        console.log(topics);
        this.client = new kafka_node_1.KafkaClient(__assign(__assign({}, options), { kafkaHost: host }));
        this.producer = new kafka_node_1.Producer(this.client, options);
        this.consumers = {};
        // Invoke the provided callback when the producer is ready or if there is an error.
        if (callback) {
            this.producer.on('ready', callback);
            this.producer.on('error', callback);
        }
    }
    /**
     * Sends a message to a provided topic.
     * @param topic The topic to send a message to.
     * @param message The message to send to a topic.
     * @param callback The callback to invoke when the message has been sent or errors out.
     */
    CHKafka.prototype.send = function (topic, message, callback) {
        this.producer.send([
            {
                topic: topic,
                messages: message,
            },
        ], callback !== null && callback !== void 0 ? callback : (function () { }));
    };
    /**
     * Creates a listener for provided topics.
     * @param topics The topics to create listeners for.
     * @param options Options for the consumer.
     */
    CHKafka.prototype.listener = function (topics, options) {
        // Just so we still have access to "this" in the map and forEach methods.
        var that = this;
        // Format the provided topic strings to the accepted topic type for Consumer().
        var formattedTopics = topics.map(function (topic) {
            // Is the topic valid?
            // TODO: fix this
            if (!that.topics[topic] && that.topics[topic] !== null)
                throw new Error("There is no registered topic \"".concat(topic, "\""));
            // Cool it is, let's format.
            return __assign({ topic: topic }, that.topics[topic]);
        });
        // Create new Consumers for each topic.
        formattedTopics.forEach(function (topic) {
            that.consumers[topic.topic] = new kafka_node_1.Consumer(that.client, [topic], options !== null && options !== void 0 ? options : {});
        });
    };
    /**
     * Subscribes a function to a topic's message event.
     * @param topic The topic you want to listen to
     * @param callback The function to invoke when a message is received
     */
    CHKafka.prototype.onMessage = function (topic, callback) {
        if (!topic)
            throw new Error('No topic specified.');
        if (!this.consumers[topic])
            throw new Error("No listener found for topic \"".concat(topic, "\""));
        this.consumers[topic].on('message', function (msg) { return callback(msg, null); });
        this.consumers[topic].on('error', function (err) { return callback(null, err); });
    };
    return CHKafka;
}());
exports.default = CHKafka;

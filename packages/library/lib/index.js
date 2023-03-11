"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("./brokers/kafka/main");
var CodenameHermes = {
    kafka: main_1.default,
    rabbitmq: 'Not implemented.',
    redit: 'Not implemented.',
};
exports.default = CodenameHermes;

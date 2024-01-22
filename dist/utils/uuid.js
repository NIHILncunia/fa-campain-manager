"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomUUID = void 0;
var uuid_1 = require("uuid");
var randomUUID = function () {
    return (0, uuid_1.v4)();
};
exports.randomUUID = randomUUID;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActivationCode = void 0;
const generateActivationCode = async () => {
    const secretCode = Math.floor(100000 + Math.random() * 900000).toString();
    return secretCode;
};
exports.generateActivationCode = generateActivationCode;

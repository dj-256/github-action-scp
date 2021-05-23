"use strict";
exports.__esModule = true;
exports.keyboardFunction = void 0;
var keyboardFunction = function (password) { return function (name, instructions, instructionsLang, prompts, finish) {
    if (prompts.length > 0 &&
        prompts[0].prompt.toLowerCase().includes('password')) {
        finish([password]);
    }
}; };
exports.keyboardFunction = keyboardFunction;

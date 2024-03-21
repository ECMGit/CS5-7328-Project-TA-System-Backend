"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateRandomBoolean = exports.generateRandomString = void 0;
const generateRandomString = () => {
    return Math.random()
        .toString(36)
        .substring(2);
};
exports.generateRandomString = generateRandomString;
const generateRandomBoolean = () => {
    const bools = [true, false];
    return bools[Math.floor(Math.random() * 2)];
};
exports.generateRandomBoolean = generateRandomBoolean;
const generateRandomNumber = (max, min) => {
    if (max === undefined
        && min === undefined) {
        /*
             * Most of the time this scenario of
             * no function arguments passed
             * is used for resource id generation.
             *
             * This code is meant to reserve a
             * large range of numbers from 0 to max
             * for any bulk insert operations, which
             * rely on the target table's auto-incrementing
             * ID sequence for ID generation.
             */
        max = 200000;
        min = 10000000;
    }
    if (max === undefined) {
        max = 200000;
    }
    if (min === undefined) {
        min = 0;
    }
    /*
       * use current time as a random seed
       * if we use jets.useFakeTimers()
       * the Date() always remains the same
       */
    const rand = Math.random() * 10000;
    const seed = new Date().getTime() - rand;
    // generate a random number between 0 and 1
    const x = Math.sin(seed) * 10000;
    // convert it to a random number between 0 and max
    const random = x - Math.floor(x);
    // convert it to a random number between min and max
    return Math.floor(random * (max - min)) + min;
};
exports.generateRandomNumber = generateRandomNumber;

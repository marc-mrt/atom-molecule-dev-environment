"use babel";
// @flow

export const apiPresets = {
  any: {
    expression: ["allof", ["match", "*"]],
  },
  js: {
    expression: ["allof", ["match", "*.js"]],
  },
};

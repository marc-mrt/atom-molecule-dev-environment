"use babel";
// @flow

import "babel-polyfill";
import { runController } from "../Model/Controller";
const planStr = process.env.PLAN;
if (planStr == null) {
  console.error("Plan has to be sent through env varible PLAN as JSON");
} else {
  const controller = runController({
    plan: JSON.parse(planStr),
    streams: {
      inStream: process.stdin,
      outStream: process.stdout,
    },
    actions: {
      kill: () => {
        process.exit(1);
      },
    },
  });
}

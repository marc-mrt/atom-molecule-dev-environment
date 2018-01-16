"use babel";
// @flow

import DevToolsInfo from "./DevToolsInfo";
import { addDevTool } from "../Actions/AddDevTool";
import { List } from "immutable";

describe("DevToolsInfo", () => {
  describe("ADD_DEVTOOL", () => {
    it("should add a tool", () => {
      let action = addDevTool({
        id: "toolid",
        name: "shell",
        iconUri: "atom://myplugin/image.png",
        uri: "file:///file",
      });
      let state = List();
      let subject = DevToolsInfo(state, action);

      expect(subject).toEqual(
        List([
          {
            id: "toolid",
            name: "shell",
            iconUri: "atom://myplugin/image.png",
            uri: "file:///file",
          },
        ]),
      );
    });
  });
});

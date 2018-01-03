"use babel";
// @flow

import DevToolsInfos from "./DevToolsInfos";
import { addDevTool } from "../Actions/AddDevTool";
import { List } from "immutable";

describe("DevToolsInfos", () => {
  describe("ADD_DEVTOOL", () => {
    it("should add a tool", () => {
      let action = addDevTool({
        id: "toolid",
        name: "shell",
        iconUri: "atom://myplugin/image.png",
        uri: "file:///file",
      });
      let state = List();
      let subject = DevToolsInfos(state, action);

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

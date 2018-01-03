"use babel";
// @flow

import { selectDevtools } from "./DevToolsInfos";
import type { DevTool } from "../Types/types.js.flow";
import { List } from "immutable";

describe("DevToolsInfos Selectors", () => {
  describe("select every devtool", () => {
    it("should return the devtools", () => {
      let state: List<DevTool> = List([
        {
          iconUri: "atom://myplugin1/icon.png",
          name: "tool1",
          id: "1",
        },
        {
          iconUri: "atom://myplugin2/icon.png",
          name: "tool2",
          id: "2",
        },
        {
          iconUri: "atom://myplugin3/icon.png",
          name: "tool3",
          id: "3",
        },
      ]);
      let subject = selectDevtools(state);

      expect(subject).toEqual(state);
    });
  });
});

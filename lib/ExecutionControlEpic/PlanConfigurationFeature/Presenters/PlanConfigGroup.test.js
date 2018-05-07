import "raf/polyfill";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";
import { PlanConfigGroup } from "./PlanConfigGroup";
import PlanConfigPart from "./PlanConfigPart";

Enzyme.configure({ adapter: new Adapter() });

describe("PlanConfigGroup", () => {
  it("should display a PlanConfigPart for every key of schemas", () => {
    let subject = shallow(
      <PlanConfigGroup
        schemas={{
          image: { type: "string" },
          scale: { type: "number" },
        }}
        value={{ image: "ubuntu", scale: 3 }}
      />,
    );

    expect(subject.find(PlanConfigPart).length).toBe(2);
    expect(subject).toMatchSnapshot();
  });
});

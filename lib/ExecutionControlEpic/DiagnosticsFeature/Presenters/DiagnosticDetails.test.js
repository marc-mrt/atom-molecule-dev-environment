import React from "react";
import { mount } from "enzyme";
import DiagnosticDetails from "./DiagnosticDetails";

describe("DiagnosticDetails", () => {
  it("should display details as the default Component", () => {
    let subject = mount(
      <DiagnosticDetails
        diagnostic={{
          path: "/test/path.to.js",
          message: "Error while reading this",
        }}
      />,
    );

    expect(
      subject
        .find("span")
        .at(1)
        .text(),
    ).toBe("path.to.js");
  });

  it("should display details as given Component", () => {
    let subject = mount(
      <DiagnosticDetails
        diagnostic={{ message: "Error while reading this" }}
        view={() => <span>Error while reading this</span>}
      />,
    );

    expect(
      subject
        .find("span")
        .at(0)
        .text(),
    ).toBe("Error while reading this");
  });
});

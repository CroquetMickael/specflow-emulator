import { defineSteps } from "specflow-emulator";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { App } from "../../App";

export const stepDefinitions = defineSteps(
  [{ tag: "shared" }, {tag: "toto"}],
  ({ Given, Then, When }) => {
    Given("I render my app", () => () => {
      render(<App />);
    });

    Then(/^I see : "(.*)"$/, () => async (text) => {
        await screen.findByText(text);
      });

  }
);

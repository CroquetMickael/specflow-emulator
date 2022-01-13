import { defineSteps } from "specflow-emulator";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { App } from "../../App";

export const stepDefinitions = defineSteps(
  [{ feature: "Simple Counter Button", tag: "feature" }],
  ({ Given, Then, When }) => {
    Given("I render my app", () => () => {
      render(<App />);
    });

    When(/^I click on button: "(.*)"$/, () => async (buttonText) => {
      const button =  await screen.findByRole("button", {
        name: RegExp(buttonText)
      });
      fireEvent.click(button)
    });

    Then(/^I see : "(.*)"$/, () => async (text) => {
      await screen.findByText(text);
    });
  }
);

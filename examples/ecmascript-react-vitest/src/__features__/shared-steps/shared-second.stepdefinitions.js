import { defineSteps } from "specflow-emulator";
import { screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

export const stepDefinitions = defineSteps(
  [{ feature: "Shared Render App clickable" }],
  ({ When }) => {
    When(/^I click on button: "(.*)"$/, () => async (buttonText) => {
      const button = await screen.findByRole("button", {
        name: RegExp(buttonText),
      });
      fireEvent.click(button);
    });
  }
);

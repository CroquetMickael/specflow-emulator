import { defineSteps } from "specflow-emulator";
import { PasswordValidator } from "../../password-validator";

export const stepDefinitions = defineSteps(
  [{ feature: "Logging in", tag: "feature" }],
  ({ Given, Then, When }) => {
    Given(
      "I have previously created a password",
      (scenarioContext) => () => {
        let passwordValidator = new PasswordValidator();
        scenarioContext.accessGranted = false;

        passwordValidator.setPassword("1234");
        scenarioContext.passwordValidator = passwordValidator;
      }
    );

    When("I enter my password correctly", (scenarioContext) => () => {
      scenarioContext.accessGranted =
        scenarioContext.passwordValidator.validatePassword("1234");
    });

    Then("I should be granted access", (scenarioContext) => () => {
      expect(scenarioContext.accessGranted).toBe(true);
    });
  }
);

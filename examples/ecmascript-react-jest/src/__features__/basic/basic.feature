
@feature
Feature: Simple Counter Button

    Scenario: Render App
        Given I render my app
        Then I see : "Hello CRA + React!"

    Scenario: Render App and click counter
        Given I render my app
        When I click on button: "count is:"
        Then I see : "Hello CRA + React!"
        And I see : "count is: 1"
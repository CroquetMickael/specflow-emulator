@toto
Feature: Shared Render App clickable

  Scenario: Render App and click counter
        Given I render my app
        When I click on button: "count is:"
        Then I see : "Hello CRA + React!"
        And I see : "count is: 1"


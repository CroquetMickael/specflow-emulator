
@feature
Feature: Simple Calculator

    Scenario: Simple addition
        Given number "2"
        And number "1"
        When I add them
        Then the result should be "3"

    Scenario: Simple multiplication
        Given number "5"
        And number "2"
        When I multiple them
        Then the result should be "10"
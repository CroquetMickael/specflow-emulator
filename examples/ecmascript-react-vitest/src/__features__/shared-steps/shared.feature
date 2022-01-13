@shared
Feature: Shared Render App

    Scenario: Render App
        Given I render my app
        Then I see : "Hello Vite + React!"
Feature: Does the home page work?
    We want the home page to show the correct hello world message, and fail otherwise

    Background: A Home Page
        Given I start at the home page

    Scenario: Home page setup check succeeds
        Given hello world text is visible
        Given hello world text is correct

    Scenario: Message form works
        Given message is correct

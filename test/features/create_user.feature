Feature: Creating a User
  As a user
  I want to create a new user account
  So that I can access the system and personalize my experience

  Scenario: Successful user creation
    Given a user with the following details:
      | email               | password |
      | john@example.com    | pass1234 |
    When I create the user account
    Then the user should be created successfully
    And the user should have a unique ID

 Scenario: User creation with invalid email
    Given a user with the following details:
      | email               | password |
      | invalid-email       | pass1234 |
    When I create the user account
    Then the system should return an error message "Invalid email"
Feature: Saving User Preferences
  As a user
  I want to save my preferences
  So that I can personalize my experience

  Scenario: Successful save of user preferences
    Given a user with ID "user-id"
    When I save the following preferences:
      | terms          | languages               | showProfile | showLanguages |
      | true           | ["English", "Spanish"]  | true        | false         |
    Then the preferences should be saved successfully

import { Given, When, Then } from 'cucumber';
import axios, { AxiosResponse } from 'axios';

interface PreferencesDto {
  terms: boolean;
  languages: string[];
  showProfile: boolean;
  showLanguages: boolean;
}

Given('a user with ID {string}', function (userID: string) {
  this.userID = userID;
});

When('I save the following preferences:', async function (table: any) {
  const preferences: any = table.rowsHash();
  const preferencesDto: PreferencesDto = {
    terms: JSON.parse(preferences.terms),
    languages: JSON.parse(preferences.languages),
    showProfile: JSON.parse(preferences.showProfile),
    showLanguages: JSON.parse(preferences.showLanguages),
  };

  try {
    const response: AxiosResponse = await axios.post(`http://localhost:3000/users/${this.userID}/preferences`, preferencesDto);
    this.response = response;
  } catch (error) {
    this.error = error;
  }
});

Then('the preferences should be saved successfully', function () {
  expect(this.error).toBeUndefined();
  expect(this.response.status).toBe(200);
});

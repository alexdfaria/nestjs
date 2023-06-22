import { Given, When, Then } from 'cucumber';
import axios, { AxiosResponse } from 'axios';

Given('a user with the following details:', function (userDetails: any) {
  this.userDetails = {
    email: userDetails.email,
    password: userDetails.password,
  };
});

When('I create the user account', async function () {
  try {
    const response: AxiosResponse = await axios.post('http://localhost:3000/users', this.userDetails);
    this.response = response;
  } catch (error) {
    this.error = error;
  }
});

Then('the user should be created successfully', function () {
  expect(this.error).toBeUndefined();
  expect(this.response.status).toBe(200);
});

Then('the user should have a unique ID', function () {
  const { userID } = this.response.data;
  expect(userID).toBeDefined();
});

Then('the system should return an error message {string}', function (errorMessage: string) {
  expect(this.error).toBeDefined();
  expect(this.error.response.data.message).toBe(errorMessage);
});

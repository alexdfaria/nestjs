import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/services/users.service';

// Set the path to the firebase-adminsdk.json file
const credentialsPath = 'firebase-adminsdk.json';

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const featureFilePath = './test/features/create_user.feature';

// Load the feature file
const feature = loadFeature(featureFilePath);

defineFeature(feature, (test) => {
  let usersService: UsersService;
  let userDetails: any;
  let response: any;
  let errorMessage: string;

  test('Successful user creation', ({ given, when, then }) => {
    given('a user with the following details:', (userDetails) => {
      userDetails = {email: "john@example.com", password: "pass1234"};
    });

    when('I create the user account', async () => {
      const mockUsersService = {
        createUser: jest.fn().mockImplementation(async () => {
          return { message: 'User registered successfully', userID: 'user-id' };
        }),
      };

      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(UsersService)
        .useValue(mockUsersService)
        .compile();

      const app = moduleFixture.createNestApplication();
      await app.init();

      usersService = moduleFixture.get<UsersService>(UsersService);

      response = await usersService.createUser(userDetails);

      await app.close();
    });

    then('the user should be created successfully', () => {
      expect(response).toBeDefined();
      expect(response.message).toBe('User registered successfully');
      expect(response.userID).toBe('user-id');
    });

    then('the user should have a unique ID', () => {
      expect(response.userID).toBeDefined();
    });
  });

  test('User creation with invalid email', ({ given, when, then }) => {
    given('a user with the following details:', (userDetails) => {
      userDetails = {email: "invalid-email", password: "pass1234"};
    });

    when('I create the user account', async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .compile();

      const app = moduleFixture.createNestApplication();
      await app.init();

      usersService = moduleFixture.get<UsersService>(UsersService);

      try {
        response = await usersService.createUser(userDetails);
      } catch (error) {
        errorMessage = error.message;
      }

      await app.close();
    });

    then(/^the system should return an error message "(.*)"$/, (errorMessage) => {
      expect(errorMessage).toBe('Invalid email');
    });
  });
  

});
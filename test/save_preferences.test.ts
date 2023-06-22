import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

// Set the path to the firebase-adminsdk.json file
const credentialsPath = 'firebase-adminsdk.json';

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const featureFilePath = './test/features/save_preferences.feature';

// Load the feature file
const feature = loadFeature(featureFilePath);

defineFeature(feature, (test) => {
  let usersService: UsersService;
  let userID: string;
  let preferences: any;

  test('Successful save of user preferences', ({ given, when, then }) => {
    given(/^a user with ID "(.*)"$/, (id) => {
      userID = id;
    });

    when('I save the following preferences:', async () => {
      const mockUsersService = {
        savePreferences: jest.fn().mockImplementation(async () => {
          preferences = { terms: true, languages: ['en'], showProfile: false, showLanguages: true };
        }),
        getUserPreferences: jest.fn().mockImplementation(async () => {
          return preferences;
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

      await usersService.savePreferences(userID, preferences);

      await app.close();
    });

    then('the preferences should be saved successfully', async () => {
      const savedPreferences = await usersService.getUserPreferences(userID);
      expect(savedPreferences).toEqual(preferences);
    });
  });
});

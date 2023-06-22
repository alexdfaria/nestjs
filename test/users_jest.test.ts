import { UsersService } from '../src/users/users.service';
import { FirestoreService } from '../src/firestore/firestore.service';
import { CreateUserDto, LoginUserDto } from '../src/dto/user.dto';
import { PreferencesDto } from 'src/dto/preferences.dto';
import * as bcrypt from 'bcrypt';

// Set the path to the firebase-adminsdk.json file
const credentialsPath = 'firebase-adminsdk.json';

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

describe('UsersService', () => {
    let usersService: UsersService;
    let firestoreService: FirestoreService;

    beforeEach(() => {
        firestoreService = new FirestoreService();
        usersService = new UsersService(firestoreService);
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password',
            };

            const result = await usersService.createUser(createUserDto);

            expect(result).toBeDefined(); // Add your assertions for the expected result
        });

        it('should throw an error if the user already exists', async () => {
            const createUserDto: CreateUserDto = {
                email: 'existing@example.com',
                password: 'password',
            };

            jest.spyOn(usersService, 'userExists').mockResolvedValue(true);

            await expect(usersService.createUser(createUserDto)).rejects.toThrowError(
                'User already exists'
            );
        });


        it('should throw an error if the email is invalid', async () => {
            const createUserDto: CreateUserDto = {
                email: 'invalidemail',
                password: 'password',
            };

            await expect(usersService.createUser(createUserDto)).rejects.toThrowError('Invalid email');
        });

    });

    describe('login', () => {
        it('should return user data on successful login', async () => {
            // Arrange
            const loginUserDto: LoginUserDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            // Mock the getUserByEmail method
            const getUserByEmailMock = jest.spyOn(usersService, 'getUserByEmail');
            getUserByEmailMock.mockResolvedValue({
                userID: 'user123',
                email: loginUserDto.email,
                password: await bcrypt.hash(loginUserDto.password, 10),
            });

            // Act
            const result = await usersService.login(loginUserDto);

            // Assert
            expect(result).toBeDefined();
            expect(result.token).toBeDefined();
        });

        it('should throw an error for invalid login', async () => {
            // Arrange
            const loginUserDto: LoginUserDto = {
                email: 'test@example.com',
                password: 'invalidPassword',
            };

            // Mock the getUserByEmail method
            const getUserByEmailMock = jest.spyOn(usersService, 'getUserByEmail');
            getUserByEmailMock.mockResolvedValue({
                userID: 'user123',
                email: loginUserDto.email,
                password: await bcrypt.hash('correctPassword', 10),
            });

            // Act and Assert
            await expect(usersService.login(loginUserDto)).rejects.toThrowError('Invalid credentials');
        });

    });

    describe('savePreferences', () => {
        it('should save user preferences successfully', async () => {
            // Arrange
            const userID = 'user-id';
            const preferencesDto: PreferencesDto = {
                terms: true,
                languages: ['English', 'Spanish'],
                showProfile: true,
                showLanguages: false,
            };

            // Create a mock instance of FirestoreService
            const firestoreServiceMock = {
                db: {
                    collection: jest.fn().mockReturnThis(),
                    doc: jest.fn().mockReturnThis(),
                    update: jest.fn().mockResolvedValue(Promise.resolve()),
                    where: jest.fn(() => ({
                        get: jest.fn().mockResolvedValue({
                            empty: false,
                            docs: [
                                {
                                  data: jest.fn().mockReturnValue({
                                    preferences: preferencesDto,
                                  }),
                                },
                              ],
                        }),
                      })),
                },
            };

            const usersService = new UsersService(firestoreServiceMock as any);

            // Act
            await usersService.savePreferences(userID, preferencesDto);

            // Assert
            expect(firestoreServiceMock.db.collection).toHaveBeenCalledWith('users');
            expect(firestoreServiceMock.db.doc).toHaveBeenCalledWith(userID);
            expect(firestoreServiceMock.db.update).toHaveBeenCalledWith({
                preferences: {
                    terms: true,
                    languages: ['English', 'Spanish'],
                    showProfile: true,
                    showLanguages: false,
                },
            });
        });

        it('should throw an error if userID is empty', async () => {
            // Arrange
            const userID = '';
            const preferencesDto: PreferencesDto = {
                terms: true,
                languages: ['English', 'Spanish'],
                showProfile: true,
                showLanguages: false,
            };

            // Act and Assert
            await expect(usersService.savePreferences(userID, preferencesDto)).rejects.toThrowError(
                'Invalid userID'
            );
        });
    });
});

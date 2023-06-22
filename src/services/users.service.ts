import { BadRequestException, Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { PreferencesDto } from '../dto/preferences.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private readonly firestoreService: FirestoreService) { }

  // Create user with email and password
  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Generate a unique userID using UUID
    const userID = uuidv4();

    // Check if the user already exists in Firestore or have invalid email
    if (await this.userExists(userID)) {
      throw new Error('User already exists');
    } else if (!await this.isEmail(email)) {
      throw new Error('Invalid email');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user document in Firestore using the generated userID
    await this.firestoreService.db.collection('users').doc(userID).set({
      userID,
      email,
      password: hashedPassword,
      preferences: null,
    });

    return { message: 'User registered successfully', userID };
  }

  // Login and return token
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Get the user data from Firestore
    const userData = await this.getUserByEmail(email);
    const userID = userData.userID;

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token with the user ID
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { token };
  }

  // Save user preferences
  async savePreferences(userID: string, preferencesDto: PreferencesDto): Promise<{ userID: string, preferences: PreferencesDto }> {

    // Construct the preferences object to update in Firestore
    const preferencesToUpdate = {
      terms: preferencesDto.terms,
      languages: preferencesDto.languages,
      showProfile: preferencesDto.showProfile,
      showLanguages: preferencesDto.showLanguages,
    };

    if (userID !== '') {
      await this.updateUserPreferences(userID, preferencesToUpdate);
      return { userID, preferences: preferencesDto };
    } else {
      throw new Error('Invalid userID');
    }

  }

  async userExists(userID: string): Promise<boolean> {
    const userQuerySnapshot = await this.firestoreService.db
      .collection('users')
      .where('userID', '==', userID)
      .get();

    return !userQuerySnapshot.empty;
  }

  async isEmail(email: string): Promise<boolean> {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return expression.test(email);
  }

  async getUserByEmail(email: string): Promise<any> {
    const userQuerySnapshot = await this.firestoreService.db
      .collection('users')
      .where('email', '==', email)
      .get();

    if (userQuerySnapshot.empty) {
      throw new Error('Invalid credentials');
    }

    const userData = userQuerySnapshot.docs[0].data();
    return userData;
  }

  // Get user preferences
  async getUserPreferences(userID: string): Promise<any> {
    const querySnapshot = await this.firestoreService.db
      .collection('users')
      .where('userID', '==', userID)
      .get();

    if (querySnapshot.empty) {
      // Handle the case when no documents match the query
      return null; // Or any other appropriate value
    } else {
      const document = querySnapshot.docs[0].data();
      return document.preferences;
    }
  }

  // Update user preferences
  async updateUserPreferences(userID: string, preferencesToUpdate: any): Promise<void> {
    const document = await this.getUserPreferences(userID);

    if (document === null) {
      throw new Error(`User document with ID ${userID} not found.`);
    }

    await this.firestoreService.db
      .collection('users')
      .doc(userID)
      .update({
        preferences: preferencesToUpdate,
      });
  }


}



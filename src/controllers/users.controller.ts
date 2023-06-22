import { Controller, Body, Post, Get, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { PreferencesDto } from '../dto/preferences.dto';

@Controller('v1/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('preferences')
  @UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard to the endpoint
  async savePreferences(
    @Req() request : { user: { userID: string } },
    @Body() preferencesDto: PreferencesDto
    ): Promise<void> {
    try {
      const { userID } = request.user; // Get the userID of the authenticated user
      await this.usersService.savePreferences(userID, preferencesDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid input');
      }
      throw error;
    }
  }

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  async getUserPreferences(@Req() req: any): Promise<any> {
    const userID = req.user.userID;
    const preferences = await this.usersService.getUserPreferences(userID);
    return { preferences };
  }

}

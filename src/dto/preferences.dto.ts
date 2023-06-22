import { IsNotEmpty, IsBoolean, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class PreferencesDto {
  @IsNotEmpty()
  @IsBoolean()
  terms: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages: string[];

  @IsNotEmpty()
  @IsBoolean()
  showProfile: boolean;

  @IsNotEmpty()
  @IsBoolean()
  showLanguages: boolean;
}
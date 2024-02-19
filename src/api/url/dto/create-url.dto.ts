import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  longUrl: string;

  @IsOptional()
  @IsString()
  shortUrl?: string;
}

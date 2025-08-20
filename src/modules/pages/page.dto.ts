import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PageDto {
  @IsString()
  @IsNotEmpty()
  page: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;
}

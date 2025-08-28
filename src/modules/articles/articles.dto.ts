import { IsDateTimeString } from '@middleware/global.middleware';
import {
  IsString,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
  Validate,
  IsOptional,
  IsNumberString,
  Matches,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export class GetAllArticlesDto {
  @IsOptional()
  @IsNumberString({}, { message: 'page должно быть числом' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'limit должно быть числом' })
  limit?: string;
}

@ValidatorConstraint({ name: 'noH1Tag', async: false })
class NoH1TagConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return !/<\/?h1[\s>]/i.test(value); // true = валидация прошла
  }

  defaultMessage() {
    return 'Тег <h1> запрещен в content';
  }
}

export class CreateArticleDto {
  @IsString({ message: 'domain должен быть строкой' })
  @IsNotEmpty({ message: 'domain обязателен' })
  domain: string;

  @IsString({ message: 'Slug должен быть строкой' })
  @IsNotEmpty({ message: 'Slug обязателен' })
  @Length(3, 40, { message: 'Slug должен быть от 3 до 40 символов' })
  @Matches(/^[a-zA-Z_-]+$/, {
    message: 'Slug может содержать только английские буквы, "-" и "_"',
  })
  slug: string;

  @IsString({ message: 'title должен быть строкой' })
  @IsNotEmpty({ message: 'title обязателен' })
  @MaxLength(80, { message: 'Заголовок не может быть длиннее 80 символов' })
  title: string;

  @IsString({ message: 'description должен быть строкой' })
  @IsNotEmpty({ message: 'description обязателен' })
  @MinLength(150, { message: 'description должен быть не короче 150 символов' })
  description: string;

  @IsString({ message: 'content должен быть строкой' })
  @IsNotEmpty({ message: 'content обязателен' })
  @Validate(NoH1TagConstraint)
  content: string;

  @IsString({ message: 'meta_title должен быть строкой' })
  @IsNotEmpty({ message: 'meta_title обязателен' })
  @Length(30, 70, { message: 'meta_title должен быть от 30 до 70 символов' })
  meta_title: string;

  @IsString({ message: 'meta_description должен быть строкой' })
  @IsNotEmpty({ message: 'meta_description обязателен' })
  @Length(150, 180, {
    message: 'meta_description должен быть от 150 до 180 символов',
  })
  meta_description: string;

  @IsString({ message: 'keywords должен быть строкой' })
  @IsNotEmpty({ message: 'keywords обязателен' })
  keywords: string;

  @IsDateTimeString({
    message: 'Дата должна быть в формате YYYY-MM-DD HH:mm:ss',
  })
  @IsOptional()
  available_from: string;
}

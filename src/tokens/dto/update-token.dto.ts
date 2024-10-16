import { PartialType } from '@nestjs/mapped-types';
import { TokenDto } from './create-token.dto';

export class UpdateTokenDto extends PartialType(TokenDto) {}

import {
  Get,
  Post,
  // Patch,
  // Delete,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('verify/code/:code')
  findVerifyCode(@Param('code') code: string) {
    return this.userService.findVerifyCode(code);
  }

  @Post('verify/code')
  create(
    @Body()
    createVerifyCodeDto: {
      identifier: string;
      code: string;
      url: string;
    },
  ) {
    console.log('createVerifyCodeDto:', createVerifyCodeDto);
    return this.userService.create(createVerifyCodeDto);
    // return createVerifyCodeDto;
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Delete('verify/code/:code')
  // removeVerifyCode(@Param('code') code: string) {
  //   return this.userService.removeVerifyCode(code);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
}

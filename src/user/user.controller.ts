import {
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  */

  @Get('verify/code/:code')
  findVerifyCode(@Param('code') code: string) {
    return this.userService.findVerifyCode(code);
  }

  @Get('account/google/:userId')
  checkGoogleAccountLinked(@Param('userId') userId: string) {
    // console.log(1, 'userId ----->', userId);
    return this.userService.hasGoogleAccountLinked(userId);
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

  @Put('update-name')
  setName(@Body() body: { name: string; userId: string }) {
    return this.userService.updateName(body.userId, body.name);
  }

  @Delete('verify/code/:code')
  removeVerifyCode(@Param('code') code: string) {
    return this.userService.deleteVerifyCode(code);
  }

  @Delete('account/google/:userId')
  unlinkGoogleAccount(@Param('userId') userId: string) {
    return this.userService.deleteGoogleAccount(userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
}

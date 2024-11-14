import {
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { CreateVerifyCodeDto } from './dto/create-verify-code.dto';
import { UpdateNameDto } from './dto/update-name.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('role/:userId')
  getUserRole(@Param('userId') userId: string) {
    return this.userService.getUserRole(userId);
  }

  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Get('account/google/:userId')
  checkGoogleAccountLinked(@Param('userId') userId: string) {
    return this.userService.hasGoogleAccountLinked(userId);
  }

  @Post('auth/signup')
  signUp(@Body() body: SignUpDto) {
    return this.userService.signUp(body.email, body.password);
  }

  @Post('auth/signin')
  signIn(@Body() body: SignInDto) {
    return this.userService.signIn(body.email, body.password);
  }

  @Post('verify/code')
  createVerifyCode(@Body() createVerifyCodeDto: CreateVerifyCodeDto) {
    console.log('createVerifyCodeDto - signup-verify:', createVerifyCodeDto);
    return this.userService.createVerifyCode(createVerifyCodeDto);
  }

  @Put('verify/credentials')
  updateCredentials(@Body() body: UpdateCredentialsDto) {
    return this.userService.updateCredentials(body);
  }

  @Put('update-name')
  setName(@Body() body: UpdateNameDto) {
    return this.userService.updateName(body.userId, body.name);
  }

  @Delete('token/remove-expired')
  deleteExpiredTokens() {
    return this.userService.deleteExpiredTokens();
  }

  @Delete('verify/token/:token')
  deleteVerifyCode(@Param('token') token: string) {
    return this.userService.deleteVerifyCode(token);
  }

  @Delete('account/google/:userId')
  unlinkGoogleAccount(@Param('userId') userId: string) {
    return this.userService.deleteGoogleAccount(userId);
  }

  @Delete('delete/:userId')
  deleteUser(@Param('userId') userId: string) {
    console.log('userId:', userId);
    return this.userService.deleteUserById(userId);
  }
}

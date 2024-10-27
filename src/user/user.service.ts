import {
  Injectable,
  BadRequestException as BadReq,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async getUserRole(userId: string): Promise<{ role: 'USER' | 'ADMIN' }> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { role: user.role };
  }

  async findVerifyCode(code: string) {
    return await this.db.verificationCode.findUnique({ where: { code } });

    /*
    const res = await this.db.verificationCode.findUnique({ where: { code } });
    if (res) {
      this.removeVerifyCode(res.code);
      return res;
    }
    */
  }

  async hasGoogleAccountLinked(userId: string): Promise<boolean> {
    // console.log(2, 'userId ----->', userId);

    try {
      const result = await this.db.account.findFirst({
        where: {
          provider: 'google',
          userId: userId,
        },
      });

      // console.log(3, 'result:', result !== null);
      return result !== null;
    } catch (err) {
      throw new BadReq(err.message);
    }

    // const hasGoogleLinked =
    //   await this.userService.hasGoogleAccountLinked(userId);
    // if (!hasGoogleLinked) {
    //   throw new UnauthorizedException('No Google account linked');
    // }
    // return { hasGoogleLinked };
  }

  async create(createVerifyCodeDto: {
    identifier: string;
    code: string;
    url: string;
  }) {
    const nowPlus24Hours = new Date();
    nowPlus24Hours.setHours(nowPlus24Hours.getHours() + 24); // Add 24 hours
    const nowUTCPlus24Hours = nowPlus24Hours.toISOString();

    try {
      return await this.db.verificationCode.create({
        data: {
          identifier: createVerifyCodeDto.identifier,
          code: createVerifyCodeDto.code,
          url: createVerifyCodeDto.url,
          expires: nowUTCPlus24Hours,
        },
      });
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async updateName(userId: string, name: string): Promise<boolean> {
    try {
      await this.db.user.update({
        where: { id: userId },
        data: { name: name.trim() },
      });
      return true;
    } catch (err) {
      throw new BadRequestException('Failed to set user name:', err.message);
    }
  }

  async deleteVerifyCode(code: string) {
    return await this.db.verificationCode.delete({ where: { code } });
  }

  async deleteGoogleAccount(userId: string): Promise<boolean> {
    try {
      const deletedAccount = await this.db.account.deleteMany({
        where: {
          provider: 'google',
          userId: userId,
        },
      });

      if (deletedAccount.count === 0) {
        throw new NotFoundException('Google account not found');
      }

      return true;
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  /*
  findAll() {
    return `This action returns all user`;
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  */
}

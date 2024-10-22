import { Injectable, BadRequestException as BadReq } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

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

  async removeVerifyCode(code: string) {
    return await this.db.verificationCode.delete({ where: { code } });
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

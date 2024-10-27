import {
  Injectable,
  BadRequestException as BadReq,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';

type UpdateNameRes = Promise<{ updated: boolean }>;
type AccountStatusRes = Promise<{ status: boolean }>;
type DeleteTokensRes = Promise<{ deletedCount: number }>;
type UnlinkAccountRes = Promise<{ unlinked: boolean }>;

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

  async hasGoogleAccountLinked(userId: string): AccountStatusRes {
    try {
      const hasGoogleLinked = await this.db.account.findFirst({
        where: {
          provider: 'google',
          userId: userId,
        },
      });
      return { status: hasGoogleLinked !== null };
    } catch (err) {
      throw new UnauthorizedException('No Google account linked:', err);
    }
  }

  async create(createVerifyCodeDto: {
    identifier: string;
    code: string;
    url: string;
  }) {
    const expire = new Date();
    const plusHours = 24;
    expire.setHours(expire.getHours() + plusHours);
    const CustomUTC = expire.toISOString();

    try {
      return await this.db.verificationCode.create({
        data: {
          identifier: createVerifyCodeDto.identifier,
          code: createVerifyCodeDto.code,
          url: createVerifyCodeDto.url,
          expires: CustomUTC,
        },
      });
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async updateName(userId: string, name: string): UpdateNameRes {
    try {
      await this.db.user.update({
        where: { id: userId },
        data: { name: name.trim() },
      });
      return { updated: true };
    } catch (err) {
      throw new BadRequestException('Failed to set user name:', err.message);
    }
  }

  async clearExpiredTokens(): DeleteTokensRes {
    const expire = new Date();
    const plusHours = 24;
    expire.setHours(expire.getHours() + plusHours);
    const CustomUTC = expire.toISOString();

    try {
      const res = await this.db.verificationToken.deleteMany({
        where: { expires: { lt: CustomUTC } },
      });
      return { deletedCount: res.count };
    } catch (err) {
      throw new BadRequestException(
        'Failed to clear expired tokens',
        err.message,
      );
    }
  }

  async deleteVerifyCode(code: string) {
    return await this.db.verificationCode.delete({ where: { code } });
  }

  async deleteGoogleAccount(userId: string): UnlinkAccountRes {
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

      return { unlinked: true };
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

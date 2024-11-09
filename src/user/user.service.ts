import {
  Injectable,
  BadRequestException as BadReq,
  NotFoundException as NotFound,
  UnauthorizedException as Unauth,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateCredentialsResDto } from './dto/update-credentials-res.dto';
import { CreateVerifyCodeResDto } from './dto/create-verify-code-res.dto';
import { DeleteVerifyCodeResDto } from './dto/delete-verify-code-res.dto';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { CreateVerifyCodeDto } from './dto/create-verify-code.dto';
import { AccountStatusResDto } from './dto/account-status-res.dto';
import { UnlinkAccountResDto } from './dto/unlink-account-res.dto';
import { DeleteTokensResDto } from './dto/delete-tokens-res.dto';
import { UpdateNameResDto } from './dto/update-name-res.dto';
import { UserRoleResDto } from './dto/user-role-res.dto';
import { SignUpResDto } from './dto/sign-up-res.dto';
import { SignInResDto } from './dto/sign-in-res.dto';
import { UserResDto } from './dto/user-res.dto';
import { DatabaseService } from '../database/database.service';

type TrimString = (address: string, start: number, end: number) => string;

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    @Inject('TRIM_STRING') private readonly trimString: TrimString,
  ) {}

  async getUserByEmail(email: string): Promise<UserResDto> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) return null;
    const trimmedPassword = this.trimString(user.password, 5, 5);
    return {
      email: user.email,
      verified: user.emailVerified,
      password: trimmedPassword,
    };
  }

  async getUserRole(userId: string): Promise<UserRoleResDto> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFound('User not found');
    return { role: user.role };
  }

  async findVerifyCodeByEmail(identifier: string) {
    return await this.db.verificationCode.findFirst({ where: { identifier } });
  }

  async hasGoogleAccountLinked(userId: string): Promise<AccountStatusResDto> {
    try {
      const hasGoogleLinked = await this.db.account.findFirst({
        where: {
          provider: 'google',
          userId: userId,
        },
      });
      return { status: hasGoogleLinked !== null };
    } catch (err) {
      throw new Unauth('No Google account linked:', err);
    }
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<SignUpResDto | BadReq> {
    try {
      const existingUser = await this.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        const password = `password: ${existingUser.password}`;
        const verified = `verified: ${existingUser.emailVerified}`;
        const msg = `Identifier already exists. | ${password} | ${verified}`;
        return new BadReq(msg);
      }

      const initUserName = email.split('@')[0];
      const user = await this.db.user.create({
        data: { email, password, name: initUserName },
      });

      return { id: user.id, email: user.email };
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async signIn(email: string, password: string): Promise<SignInResDto> {
    try {
      const user = await this.db.user.findUnique({
        where: { email, password: { not: null } },
      });

      if (!user) {
        return null;
      } else if (user && (await bcrypt.compare(password, user.password))) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      } else {
        throw new Unauth('Invalid credentials');
      }
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async createVerifyCode(
    createVerifyCodeDto: CreateVerifyCodeDto,
  ): Promise<CreateVerifyCodeResDto> {
    const expire = new Date();
    const plusHours = 24;
    expire.setHours(expire.getHours() + plusHours);
    const CustomUTC = expire.toISOString();

    try {
      const res = await this.findVerifyCodeByEmail(
        createVerifyCodeDto.identifier,
      );

      if (res) await this.deleteVerifyCode(res.code);
      return await this.db.verificationCode.create({
        data: {
          identifier: createVerifyCodeDto.identifier,
          code: createVerifyCodeDto.token,
          url: '/',
          expires: CustomUTC,
        },
      });
    } catch (err) {
      throw new BadReq(err.message);
    }
  }

  async updateCredentials({
    email,
    password,
    code,
  }: UpdateCredentialsDto): Promise<UpdateCredentialsResDto> {
    try {
      const verifyCode = await this.findVerifyCodeByEmail(email);

      if (verifyCode.code === code) {
        const currentDate = new Date();
        const isUpdated = await this.db.user.update({
          where: { email },
          data: { password, emailVerified: currentDate.toISOString() },
        });

        if (isUpdated) {
          await this.deleteVerifyCode(code);
          return { updated: true };
        } else return { updated: false };
      } else return { updated: false };
    } catch (err) {
      throw new BadReq('Failed to set user name:', err.message);
    }
  }

  async updateName(userId: string, name: string): Promise<UpdateNameResDto> {
    try {
      console.log('userId | name:', userId, name);
      const res = await this.db.user.update({
        where: { id: userId },
        data: { name: name.trim() },
      });
      console.log('res:', res);
      return { updated: true };
    } catch (err) {
      throw new BadReq('Failed to set user name:', err.message);
    }
  }

  async deleteExpiredTokens(): Promise<DeleteTokensResDto> {
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
      throw new BadReq('Failed to clear expired tokens', err.message);
    }
  }

  async deleteVerifyCode(code: string): Promise<DeleteVerifyCodeResDto> {
    return await this.db.verificationCode.delete({ where: { code } });
  }

  async deleteGoogleAccount(userId: string): Promise<UnlinkAccountResDto> {
    try {
      const deletedAccount = await this.db.account.deleteMany({
        where: {
          provider: 'google',
          userId: userId,
        },
      });

      if (deletedAccount.count === 0) {
        throw new NotFound('Google account not found');
      }

      return { unlinked: true };
    } catch (err) {
      throw new BadReq(err.message);
    }
  }
}

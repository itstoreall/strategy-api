import {
  Injectable,
  BadRequestException as BadReq,
  NotFoundException as NotFound,
  UnauthorizedException as Unauth,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateCredentialsResDto } from './dto/update-credentials-res.dto';
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
// import { SessionsService } from '../sessions/sessions.service';
import { MailerService } from '../mailer/mailer.service';
// import { AuthRoleEnum } from '../enum';

type TrimString = (address: string, start: number, end: number) => string;
type GenerateVerifyCode = () => string;

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mailer: MailerService,
    // private readonly sessionsService: SessionsService,
    @Inject('TRIM_STRING') private readonly trimString: TrimString,
    @Inject('GENERATE_VERIFY_CODE')
    private readonly generateVerifyCode: GenerateVerifyCode,
  ) {}

  async getAllUsers(userId: string) {
    /*
    const session = await this.sessionsService.findByUserId(userId);
    if (!session) {
      throw new BadReq('ERROR: no session!');
    }
    const isEqual = await bcrypt.compare(session.sessionToken, sessionToken);
    if (!isEqual) {
      throw new BadReq('ERROR: sessionTokens are not equal!');
    }
    */

    const userEmail = (
      await this.db.user.findUnique({
        where: { id: userId },
      })
    ).email;

    if (!process.env.ACCESS_CREDENTIALS.split('_|_').includes(userEmail)) {
      throw new BadReq('userId is not correct!');
    }

    const users = await this.db.user.findMany({
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          select: {
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    /*
    const isAdmin = users.find((user) => user.role === AuthRoleEnum.Admin);
    if (!isAdmin) {
      throw new BadReq('ERROR: the user is not an Admin!');
    }
    */
    return users;
  }

  /*
  id: string;
  email: string;
  emailVerified: Date;
  image: string | null;
  name: string;
  password: string;
  role: AuthRoleEnum;
  createdAt: Date;
  updatedAt: Date;
  */

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
  ): Promise<boolean> {
    const expire = new Date();
    const plusHours = 24;
    expire.setHours(expire.getHours() + plusHours);
    const CustomUTC = expire.toISOString();

    try {
      const res = await this.findVerifyCodeByEmail(
        createVerifyCodeDto.identifier,
      );

      const verifyCode = this.generateVerifyCode();

      if (res) await this.deleteVerifyCode(verifyCode);

      const sentRes = await this.mailer.createVerifyCode({
        identifier: createVerifyCodeDto.identifier,
        code: verifyCode,
      });

      if (!sentRes.accepted.includes(createVerifyCodeDto.identifier))
        return null;

      const createdData = await this.db.verificationCode.create({
        data: {
          identifier: createVerifyCodeDto.identifier,
          code: verifyCode,
          url: '/',
          expires: CustomUTC,
        },
      });

      if (createdData) {
        return true;
      } else return false;
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
      const updatedUser = await this.db.user.update({
        where: { id: userId },
        data: { name: name.trim() },
      });
      return { updated: updatedUser.name === name };
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

  async deleteUserById(userId: string): Promise<{ deleted: boolean }> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) return { deleted: false };

    // Delete associates:
    await this.db.account.deleteMany({ where: { userId } });
    await this.db.session.deleteMany({ where: { userId } });
    await this.db.verificationCode.deleteMany({
      where: { identifier: user.email },
    });

    const res = await this.db.user.delete({ where: { id: userId } });
    return { deleted: res ? true : false };
  }
}

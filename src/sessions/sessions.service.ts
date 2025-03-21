import {
  Injectable,
  NotFoundException as NotFound,
  BadRequestException as BadReq,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { AuthRoleEnum } from 'src/enum';

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async getAllSessions(userId: string, sessionToken: string) {
    const session = await this.findByUserId(userId);
    if (!session) {
      throw new BadReq('ERROR: no session!');
    }

    const isEqual = await bcrypt.compare(session.sessionToken, sessionToken);
    if (isEqual) {
      const admin = await this.db.user.findFirst({
        where: { role: AuthRoleEnum.Admin },
      });
      if (!admin) throw new BadReq('ERROR: user is not an Admin!');
      try {
        return await this.db.session.findMany({
          select: { userId: true, updatedAt: true },
        });
      } catch (err) {
        throw new NotFound(err.message);
      }
    }
  }

  async findByUserId(userId: string) {
    try {
      const session = await this.db.session.findFirst({
        where: { userId },
      });

      if (!session) {
        throw new NotFound(`Session not found for userId: ${userId}`);
      }

      return session;
    } catch (err) {
      throw new NotFound(err.message);
    }
  }

  async findByToken(sessionToken: string) {
    try {
      const session = await this.db.session.findFirst({
        where: { sessionToken },
      });

      if (!session) {
        throw new NotFound(
          `Session not found for sessionToken: ${sessionToken}`,
        );
      }

      return session;
    } catch (err) {
      throw new NotFound(err.message);
    }
  }
}

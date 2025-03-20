// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class SessionsService {
//   findOne(userId: string) {
//     return `This action returns a #${userId} session`;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service'; // Ensure this path matches your project structure.

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async getAllSessions() {
    try {
      return await this.db.session.findMany();
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async findByUserId(userId: string) {
    try {
      const session = await this.db.session.findFirst({
        where: { userId },
      });

      if (!session) {
        throw new NotFoundException(`Session not found for userId: ${userId}`);
      }

      return session;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async findByToken(sessionToken: string) {
    try {
      const session = await this.db.session.findFirst({
        where: { sessionToken },
      });

      if (!session) {
        throw new NotFoundException(
          `Session not found for sessionToken: ${sessionToken}`,
        );
      }

      return session;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { AppError } from '../utils/errors.js';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

let jwks: ReturnType<typeof jose.createRemoteJWKSet>;

function getJWKS() {
  if (!jwks) {
    const jwksUrl = new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
    jwks = jose.createRemoteJWKSet(jwksUrl);
  }
  return jwks;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing authorization header');
    }

    const token = header.slice(7);

    const { payload } = await jose.jwtVerify(token, getJWKS(), {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
    });

    const sub = payload.sub;
    const email = payload.email as string;
    const userMetadata = payload.user_metadata as { name?: string } | undefined;

    if (!sub || !email) {
      throw AppError.unauthorized('Invalid token claims');
    }

    // Look up user in app DB by Supabase user ID
    let [user] = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, sub))
      .limit(1);

    // Auto-create app user on first request
    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          id: sub,
          email,
          name: userMetadata?.name || email,
        })
        .returning({ id: users.id, email: users.email, name: users.name });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Auth error:', error);
      next(AppError.unauthorized('Invalid or expired token'));
    }
  }
}

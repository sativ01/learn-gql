import { EntityManager, MongoDriver } from '@mikro-orm/mongodb'
import {Request, Response} from 'express'

export type AppContext = {
  em: EntityManager<MongoDriver>;
  req: Request;
  res: Response
};

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export {}

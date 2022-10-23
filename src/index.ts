import express from 'express'
import { MikroORM, QueryOrder } from '@mikro-orm/core'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

import session from 'express-session'
import connectRedis from 'connect-redis'
import {createClient} from 'redis'

import mikroOrmConfig from './mikro-orm.config'
import { Author } from './entities/Author'
import { AuthorResolver } from './resolvers/authors'
import { UserResolver } from './resolvers/users'
import { PostResolver } from './resolvers/posts'
import { AppContext } from './types'

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  const em = orm.em.fork()
  const app = express()

  app.listen(4000, () => {
    console.log('server started on port 4000')
  })


  const RedisStore = connectRedis(session)
  const redisClient = createClient({legacyMode: true})
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient as any,
        disableTouch: true,
      }),
      saveUninitialized: false,
      secret: 'sldkjfvlksjdnfvljsndflnvls',
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        // secure: __prod__
        secure: false,
        sameSite: 'lax'
      }
    })
  )

  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver, AuthorResolver],
      validate: false,
    }),
    context: ({req, res}): AppContext => ({
      em: em as any,
      req,
      res
    }),
  })

  await apollo.start()
  apollo.applyMiddleware({ app })

  const authorRepository = em.getRepository(Author)

  const authors = await authorRepository.findAll({
    populate: ['posts'],
    orderBy: { name: QueryOrder.DESC },
    limit: 20,
  })
  console.log(authors)
}
main().catch((err) => console.log(err))

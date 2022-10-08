import { MikroORM, QueryOrder } from '@mikro-orm/core'
import { Author } from './entities/Author'
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
// import { Post } from "./entities/Post";
import mikroOrmConfig from './mikro-orm.config'
import { HelloResolver } from './resolvers/hello'
import { AuthorResolver } from './resolvers/authors'


const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  // await orm.getMigrator().up();

  const em = orm.em.fork()
  const app = express()
  const apollo = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, AuthorResolver],
      validate: false,
    }),
    context: {
      em
    }
  })


  app.listen(4000, () => {
    console.log('server started on port 3999')
  })

  await apollo.start()
  apollo.applyMiddleware({app})

  const authorRepository = em.getRepository(Author)
  // const postRepository = em.getRepository(Post);
  // const authorObj = new Author('John', 'john@email.com')
  // const author = authorRepository.create(authorObj)
  // await authorRepository.persist(author).flush()

  const authors = await authorRepository.findAll({
    populate: ['posts'],
    orderBy: { name: QueryOrder.DESC },
    limit: 20,
  })
  console.log(authors)
}
main().catch((err) => console.log(err))

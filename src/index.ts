import { MikroORM, QueryOrder } from "@mikro-orm/core";
import { Author } from "./entities/Author";
// import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  // await orm.getMigrator().up();

  const em = orm.em.fork();
  const authorRepository = em.getRepository(Author);
  // const postRepository = em.getRepository(Post);

  const authorObj = new Author("John", "john@email.com");
  const author = authorRepository.create(authorObj);
  await authorRepository.persist(author).flush();

  const authors = await authorRepository.findAll({
    populate: ["posts"],
    orderBy: { name: QueryOrder.DESC },
    limit: 20,
  });
  console.log(authors);
};
main().catch((err) => console.log(err));

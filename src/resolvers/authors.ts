
import { QueryOrder } from '@mikro-orm/core'
import { Author } from '../entities/Author'
import {AppContext} from '../types'
import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql'

@Resolver()
export class AuthorResolver {
  @Query(() => Author)
	author(
	  @Ctx() {em}: AppContext,
	  @Arg('id', () => String) id: string,
	): Promise<Author | null> {
	  const authorRepository = em.getRepository(Author)
		return  authorRepository.findOne({id})
	}

  @Mutation(() => Author)
  async createAuthor(
	  @Ctx() {em}: AppContext,
	  @Arg('name', () => String) name: string,
	  @Arg('email', () => String) email: string,
  ): Promise<Author> {
	  const authorRepository = em.getRepository(Author)
	  const authorObj = new Author(name, email)
	  const author = authorRepository.create(authorObj)
	  await authorRepository.persist(author).flush()
	  return author
  }

  @Query(() => [Author])
  authors(
	  @Ctx() {em}: AppContext
  ): Promise<Author[]> {
	  const authorRepository = em.getRepository(Author)
  	return  authorRepository.findAll({
  		populate: ['posts'],
  		orderBy: { name: QueryOrder.DESC },
  		limit: 20,
  	})
  }

}

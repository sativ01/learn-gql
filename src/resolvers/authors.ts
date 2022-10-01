
import { QueryOrder } from '@mikro-orm/core'
import { Author } from '../entities/Author'
import {AppContext} from '../types'
import {Arg, Ctx, Query, Resolver} from 'type-graphql'

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

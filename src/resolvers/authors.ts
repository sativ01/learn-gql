
import { QueryOrder } from '@mikro-orm/core'
import { Author } from '../entities/Author'
import {AppContext} from '../types'
import {Ctx, Query, Resolver} from 'type-graphql'

@Resolver()
export class AuthorResolver {
  @Query(() => [Author])
	authors(
	  @Ctx() {em}: AppContext
	) {
	  const authorRepository = em.getRepository(Author)
		return  authorRepository.findAll({
			populate: ['posts'],
			orderBy: { name: QueryOrder.DESC },
			limit: 20,
		})
	}

}

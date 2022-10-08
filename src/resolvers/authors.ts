
import { QueryOrder } from '@mikro-orm/core'
import { Author } from '../entities/Author'
import {AppContext} from '../types'
import { Arg, Args, Ctx, Field, Mutation, Query, Resolver, ArgsType} from 'type-graphql'
import { MaxLength } from 'class-validator'


@ArgsType()
class NewAuthorArgs {
  @Field(() => String)
  	name: string

  @Field(() => String)
  	email: string
}

@ArgsType()
class UpdateAuthorArgs {
  @Field()
  	id: string

  @Field({nullable: true})
  @MaxLength(30)
  	name?: string

  @Field({nullable: true})
  @MaxLength(30)
  	email?: string
}

@Resolver()
export class AuthorResolver {
  @Query(() => Author, {nullable: true})
  author(
	  @Ctx() {em}: AppContext,
	  @Arg('id', () => String) id: string,
  ): Promise<Author | null> {
	  const authorRepository = em.getRepository(Author)
    return authorRepository.findOne({id})
  }

  @Mutation(() => Author)
  async createAuthor(
	  @Ctx() {em}: AppContext,
	  @Args() {name, email}: NewAuthorArgs,
  ): Promise<Author> {
	  const authorRepository = em.getRepository(Author)
	  const authorObj = new Author(name, email)
	  const author = authorRepository.create(authorObj)
	  await authorRepository.persist(author).flush()
	  return author
  }

  @Mutation(() => Author, {nullable: true})
  async updateAuthor(
	  @Ctx() {em}: AppContext,
	  @Args() {id, name, email}: UpdateAuthorArgs,
  ): Promise<Author | null> {
	  const authorRepository = em.getRepository(Author)
  	const author = await authorRepository.findOne({id})
  	if(author){
		  if(name){
		    author.name = name
		  }
		  if(email){
		    author.email = email
		  }
		  await authorRepository.persistAndFlush(author)
		  return author
  	}
  	return null
  }

  @Mutation(() => Author, {nullable: true})
  async deleteAuthor(
      @Ctx() {em}: AppContext,
      @Arg('id', () => String) id: string,
  ): Promise<Author | null> {
	  const authorRepository = em.getRepository(Author)
  	const author = await authorRepository.findOne({id})
  	if(author){
		  authorRepository.remove(author)
		  return author
  	}
  	return null
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

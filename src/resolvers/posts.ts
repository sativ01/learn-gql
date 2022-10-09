import { QueryOrder } from '@mikro-orm/core'
import { Post } from '../entities/Post'
import { Author } from '../entities/Author'
import { AppContext } from '../types'
import {
  Arg,
  Args,
  Ctx,
  Field,
  Mutation,
  Query,
  Resolver,
  ArgsType,
} from 'type-graphql'
import { MaxLength } from 'class-validator'

@ArgsType()
class NewPostArgs {
  @Field(() => String)
    authorId: string

  @Field(() => String)
    title: string

  @Field(() => String)
    content: string
}

@ArgsType()
class UpdatePostArgs {
  @Field()
    id: string

  @Field({ nullable: true })
  @MaxLength(30)
    title?: string

  @Field({ nullable: true })
  @MaxLength(30)
    content?: string
}

@Resolver()
export class PostResolver {
  @Query(() => Post, { nullable: true })
  author(
    @Ctx() { em }: AppContext,
    @Arg('id', () => String) id: string
  ): Promise<Post | null> {
    const authorRepository = em.getRepository(Post)
    return authorRepository.findOne({ id })
  }

  @Mutation(() => Post)
  async createPost(
    @Ctx() { em }: AppContext,
    @Args() { authorId, title, content }: NewPostArgs
  ): Promise<Post | null> {
    const authorRepository = em.getRepository(Author)
    const author = await authorRepository.findOne({ id: authorId })
    if (author) {
      const postRepository = em.getRepository(Post)
      const postObj = new Post(author, title, content)
      const post = postRepository.create(postObj)
      await postRepository.persist(author).flush()
      return post
    }
    return null
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Ctx() { em }: AppContext,
    @Args() { id, title, content }: UpdatePostArgs
  ): Promise<Post | null> {
    const postRepository = em.getRepository(Post)
    const post = await postRepository.findOne({ id })
    if (post) {
      if (title) {
        post.title = title
      }
      if (content) {
        post.content = content
      }
      await postRepository.persistAndFlush(post)
      return post
    }
    return null
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(
    @Ctx() { em }: AppContext,
    @Arg('id', () => String) id: string
  ): Promise<Post | null> {
    const postRepository = em.getRepository(Post)
    const post = await postRepository.findOne({ id })
    if (post) {
      postRepository.remove(post)
      return post
    }
    return null
  }

  @Query(() => [Post])
  posts(@Ctx() { em }: AppContext): Promise<Post[]> {
    const postRepository = em.getRepository(Post)
    return postRepository.findAll({
      orderBy: { author: QueryOrder.DESC },
      limit: 20,
    })
  }
}

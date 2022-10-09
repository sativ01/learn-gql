import argon from 'argon2'
import { User } from '../entities/User'
import { AppContext } from '../types'
import { Args, ArgsType, Ctx, Field, Mutation, Resolver } from 'type-graphql'

@ArgsType()
export class UserRergisterArgs {
  @Field()
    userName: string

  @Field()
    password: string

  @Field()
    email: string
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean, { nullable: true })
  async register(
    @Ctx() { em }: AppContext,
    @Args() { userName, password, email }: UserRergisterArgs
  ): Promise<User> {
    const userRepository = em.getRepository(User)
    const hasUserName = await userRepository.findOne({ userName })
    if (hasUserName) {
      throw new Error('User with this name already exists')
    }
    const hasEmail = await userRepository.findOne({ email })
    if (hasEmail) {
      throw new Error('User with this email already exists')
    }

    try {
      const passwordHash = await argon.hash(password)
      const newUser = new User(email, userName, passwordHash)
      const user = userRepository.create(newUser)
      await userRepository.persist(user).flush()
      return newUser
    } catch (err) {
      throw new Error(err)
    }
  }
}

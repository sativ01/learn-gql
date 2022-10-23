import argon from 'argon2'
import { User } from '../entities/User'
import { AppContext } from '../types'
import { Args, ArgsType, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { QueryOrder } from '@mikro-orm/core'

@ObjectType()
class FieldError {
  @Field()
    field: string

  @Field()
    message: string
}

@ObjectType()
class UserResponse{
  @Field(() => User, { nullable: true })
    user?: User

  @Field(() => [FieldError])
    errors: FieldError[]
}

@ArgsType()
export class UserLoginArgs {
  @Field()
    userName: string

  @Field()
    password: string

  @Field({nullable: true})
    email?: string
}

@ArgsType()
export class UserRergisterArgs extends UserLoginArgs {
  @Field()
    email: string
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Ctx() { em }: AppContext,
    @Args() { userName, password, email }: UserRergisterArgs
  ): Promise<UserResponse> {
    let user = undefined
    const errors: FieldError[] = []
    let error: FieldError | null = null

    const userRepository = em.getRepository(User)
    const hasUserName = await userRepository.findOne({ userName })

    if (hasUserName) {
      error = {field: 'userName', message: 'User with this name already exists'}
      errors.push(error)
      return {user, errors}
    }

    const hasEmail = await userRepository.findOne({ email })
    if (hasEmail) {
      error = {field: 'userName', message: 'User with this email already exists'}
      errors.push(error)
      return {user, errors}
    }

    try {
      const passwordHash = await argon.hash(password)
      const newUser = new User(email, userName, passwordHash)
      user = userRepository.create(newUser)
      await userRepository.persist(user).flush()
    } catch (err) {
      error = {field: 'userName', message: err.message}
    }

    return {
      user,
      errors
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Ctx() { em }: AppContext,
    @Args() { userName, password, email }: UserLoginArgs
  ): Promise<UserResponse> {
    const userRepository = em.getRepository(User)
    let user: User | undefined |null = await userRepository.findOne({ userName }) ?? await userRepository.findOne({ email })
    let error: FieldError
    const errors: FieldError[] = []
    if (user) {
      try {
        const isValidPassword = await argon.verify(user.passwordHash,password)
        if(!isValidPassword){
          throw new Error('Incorrect password')
        }
      } catch (err) {
        error = {field: 'password', message: err.message} 
        errors.push(error)
      }
    } else {
      error = {field: 'username', message: 'User with such credentials was not found'} 
      errors.push(error)
      user = undefined
    }
    return {user, errors}
  }

  @Query(() => [User])
  users(@Ctx() { em }: AppContext): Promise<User[]> {
    const userRepository = em.getRepository(User)
    return userRepository.findAll({
      orderBy: { userName: QueryOrder.DESC },
      limit: 20,
    })
  }
}

import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { User } from './User'
import { Post } from './Post'
import { MaxLength } from 'class-validator'

@ObjectType()
@Entity()
export class Author extends User {
  @Field()
  @MaxLength(40)
    name!: string

  @Field(() => Boolean)
  @Property()
    termsAccepted = false

  @Field()
  @Property()
    born?: Date

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.author)
    posts = new Collection<Post>(this)

  constructor(
    name: string,
    email: string,
    userName: string,
    passwordHash: string
  ) {
    super(email, userName, passwordHash)
    this.name = name
    this.email = email
    this.userName = userName
    this.passwordHash = passwordHash
  }
}

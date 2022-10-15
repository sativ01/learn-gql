import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { User } from './User'
import { Post } from './Post'
import { MaxLength } from 'class-validator'
import { BaseEntity } from './BaseEntity'

@ObjectType()
@Entity()
export class Author extends BaseEntity {
  @Field()
  @MaxLength(40)
    name!: string

  @Field(() => Boolean)
  @Property()
    termsAccepted = false

  @Field()
  @Property()
    born?: Date

  @Field()
  @OneToOne()
    user!: User

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.author)
    posts = new Collection<Post>(this)

  constructor(
    user: User,
    name: string,
    born?: Date,
    termsAccepted?:boolean
  ) {
    super()
    this.user = user
    this.name = name
    this.born = born
    this.termsAccepted = !!termsAccepted
  }
}

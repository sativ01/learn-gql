import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { BaseEntity } from './BaseEntity'
import { Post } from './Post'

@ObjectType()
@Entity()
export class Author extends BaseEntity {
  @Field()
  @Property()
  	name!: string

  @Field()
  @Property()
  	email!: string

  @Field()
  @Property()
  	age?: number

  @Field(() => Boolean)
  @Property()
  	termsAccepted = false

  @Field()
  @Property()
  	born?: Date

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.author)
  	posts = new Collection<Post>(this)

  constructor(name: string, email: string) {
  	super()
  	this.name = name
  	this.email = email
  }
}

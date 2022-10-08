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
  @Property({unique: true})
    userName!: string

  @Field(() => [Post], {nullable: true})
  @OneToMany(() => Post, (post) => post.author)
  	posts = new Collection<Post>(this)


  @Property()
    password!: string

  constructor(name: string, email: string, userName: string) {
  	super()
  	this.name = name
  	this.email = email
  	this.userName = userName
  }
}

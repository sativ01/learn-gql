import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'
import { Post } from './Post'

@Entity()
export class Author extends BaseEntity {
  @Property()
  	name!: string

  @Property()
  	email!: string

  @Property()
  	age?: number

  @Property()
  	termsAccepted = false

  @Property()
  	born?: Date

  @OneToMany(() => Post, (post) => post.author)
  	posts = new Collection<Post>(this)

  constructor(name: string, email: string) {
  	super()
  	this.name = name
  	this.email = email
  }
}

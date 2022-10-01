import {
	Entity,
	ManyToOne,
	Property,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { Author } from './Author'
import { BaseEntity } from './BaseEntity'

@ObjectType()
@Entity()
export class Post extends BaseEntity {

  @Field()
  @Property()
  	title!: string

  @Field(() => Author)
  @ManyToOne()
  	author!: Author
}

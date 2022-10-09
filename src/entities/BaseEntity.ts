import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export abstract class BaseEntity {
  @Field(() => String)
  @PrimaryKey()
    _id!: ObjectId

  @Field()
  @SerializedPrimaryKey()
    id!: string

  @Field(() => String)
  @Property()
    createdAt = new Date()

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
    updatedAt = new Date()
}

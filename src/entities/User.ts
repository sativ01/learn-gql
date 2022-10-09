import { Entity, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { BaseEntity } from './BaseEntity'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property()
    email!: string

  @Field()
  @Property({ unique: true })
    userName!: string

  @Property()
    passwordHash!: string

  constructor(email: string, userName: string, passwordHash: string) {
    super()
    this.email = email
    this.userName = userName
    this.passwordHash = passwordHash
  }
}

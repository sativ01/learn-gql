import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Author } from "./Author";

@Entity()
export class Post {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string; // string variant of PK, will be handled automatically

  @Property()
  title!: string;

  @ManyToOne()
  author!: Author;
}

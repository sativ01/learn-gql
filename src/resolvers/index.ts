import { AuthorResolver } from './authors'
import { PostResolver } from './posts'
import { UserResolver } from './users'

export const resolvers = [AuthorResolver, UserResolver, PostResolver]

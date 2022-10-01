import { EntityManager } from '@mikro-orm/mongodb'

export type AppContext = {
  em: EntityManager<any> 
}

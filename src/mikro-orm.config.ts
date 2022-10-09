import { Options } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { entities } from './entities'

const options: Options = {
  dbName: 'learngql',
  type: 'mongo',
  debug: process.env.NODE_ENV !== 'production',
  user: 'root',
  password: 'rootpassword',
  metadataProvider: TsMorphMetadataProvider,
  entities , // path to our JS entities (dist), relative to `baseDir`
  // entitiesTs: ["./src/entities/**/*.ts"], // path to our TS entities (source), relative to `baseDir`
}

export default options

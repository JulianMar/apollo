import type { ModuleRuntimeConfig, ModulePublicRuntimeConfig } from './module.mjs'

declare module '@nuxt/schema' {
  interface RuntimeConfig extends ModuleRuntimeConfig {}
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
}

export { type ErrorResponse } from '@apollo/client/link/error'

export { type ClientConfig, default, type defineApolloClient } from './module.mjs'

export { type ModuleOptions, type ModulePublicRuntimeConfig, type ModuleRuntimeConfig } from './module.mjs'

import * as _nuxt_schema from '@nuxt/schema';
import { N as NuxtApolloConfig, C as ClientConfig } from './shared/apollo.CH3hnyzm.mjs';
export { ErrorResponse } from '@apollo/client/link/error';
import 'graphql-ws';
import '@apollo/client';
import 'nuxt/app';

type ModuleOptions = NuxtApolloConfig;
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

declare const defineApolloClient: (config: ClientConfig) => ClientConfig;
interface ModuleRuntimeConfig {
    apollo: NuxtApolloConfig<any>;
}
interface ModulePublicRuntimeConfig {
    apollo: NuxtApolloConfig<any>;
}
declare module '@nuxt/schema' {
    interface NuxtConfig {
        ['apollo']?: Partial<ModuleOptions>;
    }
    interface NuxtOptions {
        ['apollo']?: ModuleOptions;
    }
    interface RuntimeConfig extends ModuleRuntimeConfig {
    }
    interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {
    }
}

export { ClientConfig, _default as default, defineApolloClient };
export type { ModuleOptions, ModulePublicRuntimeConfig, ModuleRuntimeConfig };

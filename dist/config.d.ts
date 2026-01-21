import { C as ClientConfig } from './shared/apollo.CH3hnyzm.js';
import 'graphql-ws';
import '@apollo/client';
import 'nuxt/app';

declare const defineApolloClient: (config: ClientConfig) => ClientConfig;

export { ClientConfig, defineApolloClient };

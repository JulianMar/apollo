import { ApolloClient } from '@apollo/client/core';
import type { ErrorResponse } from '../types.js';
import { useApollo } from './composables.js';
import type { Ref } from '#imports';
import type { ApolloClientKeys } from '#apollo';
declare const _default: import("#app").Plugin<{
    apolloHelpers: {
        clients: Record<ApolloClientKeys, ApolloClient<unknown>> | undefined;
        getToken: (client?: ApolloClientKeys) => Promise<string | null | undefined>;
        onLogin: (token?: string, client?: ApolloClientKeys, skipResetStore?: boolean) => Promise<void>;
        onLogout: (client?: ApolloClientKeys, skipResetStore?: boolean) => Promise<void>;
    };
    apollo: {
        clients: Record<ApolloClientKeys, ApolloClient<unknown>>;
        defaultClient: ApolloClient<unknown> | undefined;
    };
}> & import("#app").ObjectPlugin<{
    apolloHelpers: {
        clients: Record<ApolloClientKeys, ApolloClient<unknown>> | undefined;
        getToken: (client?: ApolloClientKeys) => Promise<string | null | undefined>;
        onLogin: (token?: string, client?: ApolloClientKeys, skipResetStore?: boolean) => Promise<void>;
        onLogout: (client?: ApolloClientKeys, skipResetStore?: boolean) => Promise<void>;
    };
    apollo: {
        clients: Record<ApolloClientKeys, ApolloClient<unknown>>;
        defaultClient: ApolloClient<unknown> | undefined;
    };
}>;
export default _default;
export interface ModuleRuntimeHooks {
    'apollo:auth': (params: {
        client: ApolloClientKeys;
        token: Ref<string | null>;
    }) => void;
    'apollo:error': (error: ErrorResponse) => void;
}
interface DollarApolloHelpers extends ReturnType<typeof useApollo> {
}
interface DollarApollo {
    clients: Record<ApolloClientKeys, ApolloClient<unknown>>;
    defaultClient: ApolloClient<unknown>;
}
declare module '#app' {
    interface RuntimeNuxtHooks extends ModuleRuntimeHooks {
    }
    interface NuxtApp {
        $apolloHelpers: DollarApolloHelpers;
        $apollo: DollarApollo;
    }
}
declare module 'vue' {
    interface ComponentCustomProperties {
        $apolloHelpers: DollarApolloHelpers;
        $apollo: DollarApollo;
    }
}

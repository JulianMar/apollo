import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { createApolloProvider } from "@vue/apollo-option";
import { ApolloClients, provideApolloClients } from "@vue/apollo-composable";
import { ApolloLink, createHttpLink, split } from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import createRestartableClient from "./ws.js";
import { useApollo } from "./composables.js";
import { ref, useCookie, defineNuxtPlugin, useRequestHeaders } from "#imports";
import { NuxtApollo } from "#apollo";
export default defineNuxtPlugin((nuxtApp) => {
  const requestCookies = import.meta.server && NuxtApollo.proxyCookies && useRequestHeaders(["cookie"]) || void 0;
  const clients = {};
  for (const [key, clientConfig] of Object.entries(NuxtApollo.clients)) {
    const getAuth = async () => {
      const token = ref(null);
      await nuxtApp.callHook("apollo:auth", { token, client: key });
      if (!token.value) {
        if (clientConfig.tokenStorage === "cookie") {
          if (import.meta.client) {
            const t = useCookie(clientConfig.tokenName).value;
            if (t) {
              token.value = t;
            }
          } else if (requestCookies?.cookie) {
            const t = requestCookies.cookie.split(";").find((c) => c.trim().startsWith(`${clientConfig.tokenName}=`))?.split("=")?.[1];
            if (t) {
              token.value = t;
            }
          }
        } else if (import.meta.client && clientConfig.tokenStorage === "localStorage") {
          token.value = localStorage.getItem(clientConfig.tokenName);
        }
        if (!token.value) {
          return;
        }
      }
      const authScheme = !!token.value?.match(/^[a-z]+\s/i)?.[0];
      if (authScheme || clientConfig?.authType === null) {
        return token.value;
      }
      return `${clientConfig?.authType} ${token.value}`;
    };
    const authLink = setContext(async (_, { headers }) => {
      const auth = await getAuth();
      if (!auth) {
        return;
      }
      return {
        headers: {
          ...headers,
          ...requestCookies && requestCookies,
          [clientConfig.authHeader]: auth
        }
      };
    });
    const httpLink = authLink.concat(createHttpLink({
      ...clientConfig?.httpLinkOptions && clientConfig.httpLinkOptions,
      uri: import.meta.client && clientConfig.browserHttpEndpoint || clientConfig.httpEndpoint,
      headers: { ...clientConfig?.httpLinkOptions?.headers || {} }
    }));
    let wsLink = null;
    if (import.meta.client && clientConfig.wsEndpoint) {
      const wsClient = createRestartableClient({
        ...clientConfig.wsLinkOptions,
        url: clientConfig.wsEndpoint,
        connectionParams: async () => {
          const auth = await getAuth();
          if (!auth) {
            return;
          }
          return { headers: { [clientConfig.authHeader]: auth } };
        }
      });
      wsLink = new GraphQLWsLink(wsClient);
      nuxtApp._apolloWsClients = nuxtApp._apolloWsClients || {};
      nuxtApp._apolloWsClients[key] = wsClient;
    }
    const errorLink = onError((err) => {
      nuxtApp.callHook("apollo:error", err);
    });
    const link = ApolloLink.from([
      errorLink,
      ...!wsLink ? [httpLink] : [
        ...clientConfig?.websocketsOnly ? [wsLink] : [
          split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return definition.kind === "OperationDefinition" && definition.operation === "subscription";
            },
            wsLink,
            httpLink
          )
        ]
      ]
    ]);
  }
  provideApolloClients(clients);
  nuxtApp.vueApp.provide(ApolloClients, clients);
  nuxtApp.vueApp.use(createApolloProvider({ defaultClient: clients?.default }));
  nuxtApp._apolloClients = clients;
  const defaultClient = clients?.default;
  return {
    provide: {
      apolloHelpers: useApollo(),
      apollo: { clients, defaultClient }
    }
  };
});

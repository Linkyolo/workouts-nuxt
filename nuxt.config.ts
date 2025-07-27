// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: {
    port: 4000
  },
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-graphql-request', '@nuxt/icon'],
  build: {
    transpile: ['nuxt-graphql-request'],
  },
  graphql: {
    /**
     * An Object of your GraphQL clients
     */
    clients: {
      default: {
        /**
         * The client endpoint url
         */
        endpoint: ' http://localhost:3000/',
        /**
         * Per-client options overrides
         * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
         */
        options: {},
      },
      // ...your other clients
    },

    /**
     * Options
     * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
     */
    options: {
      method: 'get', // Default to `POST`
    },

    /**
     * Optional
     * default: false (this includes graphql-tag for node_modules folder)
     */
    includeNodeModules: true,
  },

  ui: {
    theme: {
      colors: {
        primary: 'primary',
        secondary: 'secondary',
        tertiary: 'tertiary',

      }
    }
  },
})

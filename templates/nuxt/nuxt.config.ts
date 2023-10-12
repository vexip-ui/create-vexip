export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/vexip-ui.svg' }]
    }
  },
  modules: ['@vexip-ui/nuxt']
})

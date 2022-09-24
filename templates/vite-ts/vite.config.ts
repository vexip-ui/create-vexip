import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { VexipUIResolver } from '@vexip-ui/plugins'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    autoImport({
      resolvers: [
        VexipUIResolver()
      ]
    }),
    components({
      resolvers: [
        VexipUIResolver()
      ]
    })
  ]
})

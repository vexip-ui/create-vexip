import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { VexipUIResolver } from '@vexip-ui/plugins'

export default defineConfig({
  optimizeDeps: {
    include: ['vexip-ui', 'vexip-ui/es/css/**/*.js', 'vexip-ui/es/style/**/*.js', '@vexip-ui/icons']
  },
  plugins: [
    vue(),
    vueJsx(),
    autoImport({
      vueTemplate: true,
      resolvers: [VexipUIResolver()],
      imports: [
        {
          '@vexip-ui/icons': Object.keys(await import('@vexip-ui/icons')).map(name =>
            name.match(/^I[0-9]/) ? name : [name, `I${name}`]
          )
        }
      ]
    }),
    components({
      resolvers: [VexipUIResolver()]
    })
  ]
})

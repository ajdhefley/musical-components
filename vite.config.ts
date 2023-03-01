import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),

        cssInjectedByJsPlugin(),

        dts({
            insertTypesEntry: true
        }),
    ],
    resolve: {
        alias: {
            '@lib' : resolve(__dirname, './src/lib')
        }
    },
    build: {
        cssCodeSplit: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'musical-components',
            fileName: `index`
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                }
            }
        },
        outDir: 'build'
    },
    define: {
        'process.env': process.env
    }
})

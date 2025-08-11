import { resolve } from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default {
    base: process.env.NODE_ENV === 'production' ? '/cv_3d/' : '',
    build: {
        rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'),
            s1: resolve(__dirname, 'star1.html'),
        }
        }
    }
}
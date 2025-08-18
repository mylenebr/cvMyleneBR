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
            experience: resolve(__dirname, 'experience.html'),
            competences: resolve(__dirname, 'competences.html'),
            presentation: resolve(__dirname, 'presentation.html'),
            interets: resolve(__dirname, 'interets.html'),
            cursus: resolve(__dirname, 'cursus.html'),
        }
        }
    }
}
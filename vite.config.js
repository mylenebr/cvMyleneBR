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
            experience: resolve(__dirname, 'pages/experience.html'),
            competences: resolve(__dirname, 'pages/competences.html'),
            presentation: resolve(__dirname, 'pages/presentation.html'),
            interets: resolve(__dirname, 'pages/interets.html'),
            cursus: resolve(__dirname, 'pages/cursus.html'),
        }
        }
    }
}
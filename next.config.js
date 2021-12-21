// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    poweredByHeader: false,
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    i18n: {
        locales: ['fr', 'nl', 'en'],
        defaultLocale: 'fr',
    }
}
module.exports = nextConfig
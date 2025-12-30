
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://kroooo.com',
    generateRobotsTxt: true,
    exclude: ['/admin', '/admin/*'],
    generateIndexSitemap: false, // Single file is enough for < 5000 pages
}

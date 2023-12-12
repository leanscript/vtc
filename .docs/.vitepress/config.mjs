import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vtc",
  description: "vtc",
  base: '/vtc/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' }
    ],
    search: {
       provider: 'local'
    },
    sidebar: [
      {
        text: 'Quickstart',
        items: [
          { text: 'Requirements', link: '/quickstart/requirements' },
          { text: 'Installation', link: '/quickstart/installation' },
        ]
      },
      {
        text: 'Basics',
        items: [
          { text: 'How does it works', link: '/how-does-it-works' },
          { text: 'Plugging your api', link: '/plugging-your-api' },
          { text: 'Auth', link: '/auth' },
        ]
      },
      {
        text: 'Creating a page',
        collapsed: true,
        items: [
          { text: 'Index page', link: '/index-page' },
          { text: 'Detail page', link: '/detail-page' },
          { text: 'Add page', link: '/add-page' },
          { text: 'Edit page', link: '/edit-page' },
          { text: 'Delete page', link: '/delete-page' },
          { text: 'Actions', link: '/actions' },
        ]
      },
      {
        text: 'Composables',
        collapsed: true,
        items: [
          { text: 'ResourceDetail', link: '/resource-detail-composable' },
          { text: 'ResourceIndex', link: '/resource-index-composable' },
          { text: 'clickOutside', link: '/clickoutside-composable' },
        ]
      },
      {
        text: 'Adding custom fields',
        collapsed: true,
        items: [
          { text: 'Basic field', link: '/basic-field' },
          { text: 'Async field', link: '/async-field' },
        ]
      },
      {
        text: 'Customize theme',
        collapsed: true,
        items: [
          { text: 'Custom colors', link: '/custom-colors' },
          { text: 'Override base theme', link: '/override-base-theme' },
        ]
      },
      {
        text: 'Plugins',
        collapsed: true,
        items: [
          { text: '$admin', link: '/admin-plugin' },
          { text: '$layout', link: '/layout-plugin' },
          { text: '$field', link: '/field-plugin' },
          { text: '$auth', link: '/auth-plugin' },
        ]
      },
      {
        text: 'API reference', link: '/api-reference'
      },
      {
        text: 'Stylesheet reference', link: '/stylesheet-reference'
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/leanscript/supernova' }
    ]
  }
})

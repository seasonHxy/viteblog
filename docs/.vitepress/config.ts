
export default {
  lang: 'en-US',
  title: '集群的博客',
  description: 'Vite & Vue powered static site generator.',
  lastUpdated: true,

  themeConfig: {
    repo: 'seasonHxy',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },

    // carbonAds: {
    //   carbon: 'CEBDT27Y',
    //   custom: 'CKYD62QM',
    //   placement: 'vuejsorg'
    // },

    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
      {
        text: 'Config Reference',
        link: '/config/basics',
        activeMatch: '^/config/'
      },
      // {
      //   text: 'Release Notes',
      //   link: 'https://github.com/vuejs/vitepress/releases'
      // }
    ],

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/config/': getConfigSidebar(),
      '/': getGuideSidebar()
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text:"JavaScript",
      children: [
        { text: 'JS Basic', link:'/books/jsbase/001_jsbase'},
        // { text: 'NodeJS', link:'/nodejs'},
        // { text: 'React', link:'/react'},
        // { text: 'Vue', link:'/vue'},
      ]
    },
    {
      text: "Engineering",
      children:[
        { text: 'Build Tools', link:'/books/engineering/001_mfsu'},
      ]
    },
    // {
    //   text: "Browser", 
    //   children:[
    //     { text: 'JS Basic', link:'/books/engineering/eng.md'},
    //   ]
    // }
    // {
    //   text: 'Introduction',
    //   children: [
    //     { text: 'What is VitePress?', link: '/' },
    //     { text: 'Getting Started', link: '/guide/getting-started' },
    //     { text: 'Configuration', link: '/guide/configuration' },
    //     { text: 'Asset Handling', link: '/guide/assets' },
    //     { text: 'Markdown Extensions', link: '/guide/markdown' },
    //     { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
    //     { text: 'Deploying', link: '/guide/deploy' }
    //   ]
    // },
    // {
    //   text: 'Advanced',
    //   children: [
    //     { text: 'Frontmatter', link: '/guide/frontmatter' },
    //     { text: 'Theming', link: '/guide/theming' },
    //     { text: 'API Reference', link: '/guide/api' },
    //     {
    //       text: 'Differences from Vuepress',
    //       link: '/guide/differences-from-vuepress'
    //     }
    //   ]
    // }
  ]
}

function getConfigSidebar() {
  return [
    {
      text: 'App Config',
      children: [{ text: 'Basics', link: '/config/basics' }]
    },
    {
      text: 'Theme Config',
      children: [
        { text: 'Homepage', link: '/config/homepage' },
        { text: 'Algolia Search', link: '/config/algolia-search' },
        { text: 'Carbon Ads', link: '/config/carbon-ads' }
      ]
    }
  ]
}


export default {
  lang: 'en-US',
  title: "Front Shadow's Blog ",
  description: 'front end powered static site.',
  // lastUpdated: true,

  themeConfig: {
    repo: 'seasonHxy',
    docsDir: 'docs',
    docsBranch: 'main',
    // editLinks: true,
    // editLinkText: 'Edit this page on GitHub',
    // lastUpdated: 'Last Updated',

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
      // {
      //   text: 'Config Reference',
      //   link: '/config/basics',
      //   activeMatch: '^/config/'
      // },
      // {
      //   text: 'Leaning English',
      //   link '/language/express',
      // }
      {
        text: 'Learning English',
        link: '/language/express/001_reading',
      },
      // {
      //   text: 'Release Notes',
      //   link: 'https://github.com/vuejs/vitepress/releases'
      // }
    ],

    sidebar: {
      'language': getLanguageSidebar(),
      '/guide/': getGuideSidebar(),
      '/config/': getConfigSidebar(),
      '/': getGuideSidebar()
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text: "Go", 
      children:[
        { text: 'go-1.1', link:'/books/go/go_1_1'},
        { text: 'go-2.1', link:'/books/go/go_2_1'}
      ]
    },
    {
      text: "Web3.0", 
      children:[
        { text: 'MetaMask', link:'/books/web3.0/MetaMask_001'},
        { text: 'WEB3.0 stack2', link:'/books/web3.0/MetaMask_002'},
        { text: 'First Eth Contract', link: '/books/web3.0/first_eth_contract' }
      ]
    },
    {
      text:"JavaScript",
      children: [
        { text: 'JS Basic', link:'/books/jsbase/001_jsbase'},
        { text: 'Broswer', link:'/books/broswer/001_eventloop'},
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
    {
      text: "Performance",
      children:[
        { text: 'Browser', link:'/books/performance/001_broswer_performance'},
        { text: 'React Application', link:'/books/performance/002_react_performance'},
        { text: 'Vue Application', link:'/books/performance/003_vue_proformance'},
      ]
    },
    // {
    //   text: "Browser", 
    //   children:[
    //     { text: 'Broswer', link:'/books/broswer/001_eventloop'},
    //   ]
    // },
    
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

function getLanguageSidebar() {
  return [
    {
      text: 'Leaning English',
      children: [
        { text: 'Magic Note W1', link: '/language/express/001_reading' },
        { text: 'Magic Note W2', link: '/language/express/002_music' }
      ]
    },
    // {
    //   text: 'Theme Config',
    //   children: [
    //     { text: 'Homepage', link: '/config/homepage' },
    //     { text: 'Algolia Search', link: '/config/algolia-search' },
    //     { text: 'Carbon Ads', link: '/config/carbon-ads' }
    //   ]
    // }
  ]
}

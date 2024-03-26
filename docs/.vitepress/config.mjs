import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dev Notes",
  description: "Weber Dev Notes",
  lang: 'zh-TW',
  cleanUrls: true,
  base: "/vitpress-dev-notes/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: '.NET', link: '/dotnet/index'},
      {text: 'VitPress', link: '/vitpress/index'}
    ],
    sidebar: [
      {
        text: '.NET',
        items: [
          {text: 'Coravel 範例', link: '/dotnet/coravel'},
        ]
      },
      {
        text: 'Vue',
        items: [
          {text: 'Index', link: '/vue/index'},
        ]
      },
      {
        text: 'Semantic Kernel',
        items: [
          {text: 'Index', link: '/semantic-kernel/index'},
        ]
      },
      {
        text: 'VitPress',
        items: [
          {text: '部署流程', link: '/vitpress/index'},
        ]
      },
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ]
  }
})

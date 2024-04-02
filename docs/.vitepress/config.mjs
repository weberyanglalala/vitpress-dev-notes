import {withMermaid} from "vitepress-plugin-mermaid";
// https://vitepress.dev/reference/site-config
export default withMermaid({
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
      {text: 'VitPress', link: '/vitpress/index'},
      {text: 'AI', link: '/ai/openai/assistants-api'}
    ],
    sidebar: [
      {
        text: '.NET',
        items: [
          {text: 'Coravel 範例', link: '/dotnet/coravel'},
        ]
      },
      {
        text: 'AI',
        items: [
          {text: 'Open AI Assistant API', link: '/ai/openai/assistants-api'},
          {text: 'Lab: 旅遊推薦達人', link: '/ai/openai/travel-recommandation'},
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
  },
  mermaid: {
    theme: 'default',
  }
})

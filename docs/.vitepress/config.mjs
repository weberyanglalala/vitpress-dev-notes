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
      {text: '.NET', link: '/dotnet/coravel'},
      {text: 'VitPress', link: '/vitpress/index'},
      {text: 'AI', link: '/ai/openai/assistants-api'},
      {text: 'Docker', link: '/docker/m1-sql-server-connect-from-vm.md'}
    ],
    sidebar: [
      {
        text: '.NET',
        items: [
          {text: 'Coravel 範例', link: '/dotnet/coravel'},
        ],
        collapsed: false,
      },
      {
        text: 'AI',
        items: [
          {text: 'Open AI Assistant API', link: '/ai/openai/assistants-api'},
          {text: 'Lab: 旅遊推薦達人', link: '/ai/openai/travel-recommendation'},
          {text: 'Lab: Build A Coze Chatbot', link: '/ai/coze/coze-chatbot'},
        ],
        collapsed: false,
      },
      {
        text: 'VitPress',
        items: [
          {text: '部署流程', link: '/vitpress/index'},
        ],
        collapsed: false,
      },
      {
        text: 'Semantic Kernel',
        items: [
          {text: 'Lab: First Agent', link: '/semantic-kernel/first-agent'},
        ],
        collapsed: false,
      },
      {
        text: 'Docker',
        items: [
          {text: 'SQL SERVER', link: '/docker/m1-sql-server-connect-from-vm.md'},
        ],
        collapsed: false,
      },

    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ]
  },
  mermaid: {
    theme: 'default',
  },
  head: [
    [
      'script',
      {async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-B7LWF9VCBK'}
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-B7LWF9VCBK');`
    ],
    [
      'script',
      {},
      `<!-- Hotjar Tracking Code for VitPress -->
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:4950929,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
    ],

  ]
})

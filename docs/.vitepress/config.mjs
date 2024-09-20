import {withMermaid} from "vitepress-plugin-mermaid";
// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "Dev Notes",
  description: "Weber Dev Notes",
  lang: 'zh-TW',
  cleanUrls: true,
  base: "/vitpress-dev-notes/",
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: '.NET', link: '/dotnet/coravel'},
      {text: 'VitPress', link: '/vitpress/index'},
      {text: 'AI', link: '/ai/openai/assistants-api'},
      {text: 'Docker', link: '/docker/m1-sql-server-connect-from-vm'},
      {text: 'Python', link: '/python/beautifulsoup'},
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
        text: 'Python',
        items: [
          {text: 'Beautifulsoup', link: '/python/beautifulsoup'},
        ],
        collapsed: false,
      },
      {
        text: 'AI',
        items: [
          {text: 'Lab: Dify Workflow API', link: '/ai/dify/dify-workflow'},
          {text: 'Lab: Jina Reader API', link: '/ai/openai/document-outline'},
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
          {text: 'Vue Flow Embedding', link: '/vitpress/vue-flow'},
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
      {
        text: 'Line',
        items: [
          {text: 'Line Developers Create Provider', link: '/line/line-developers-create-provider.md'},
          {text: 'Webhooks', link: '/line/webhooks.md'},
          {text: 'Messaging API Overview', link: '/line/messaging-api-overview.md'},
          {text: 'Line Liff init', link: '/line/line-liff-init.md'},
        ],
        collapsed: true,
      },

    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ],
    search: {
      provider: 'local'
    },
    footer: {
      copyright: 'Copyright © 2023-present Weber Yang',
    }
  },
  mermaid: {
    theme: 'default',
  },
  head: [
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
    ['link', {rel: 'stylesheet', href: 'https://unpkg.com/tailwindcss@2.0.4/dist/tailwind.min.css'}]
  ],
  transformHtml: (code, id, {siteConfig}) => {
    const gtmScript = `<!-- Google Tag Manager -->
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-P669ZKDL');</script>
      <!-- End Google Tag Manager -->`;

    const gtmNoscript = `<!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P669ZKDL"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->`;

    return code.replace('</head>', `${gtmScript}\n</head>`)
      .replace('<body>', `<body>\n${gtmNoscript}`);
  }
})

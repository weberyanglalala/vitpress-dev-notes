# Create a new Provider in Line Developers Console

## 使用 LINE 帳號登入 LINE Developers Console
- https://developers.line.biz/en/
- https://developers.line.biz/console/

## Login to Line Developer Console
![](/ai/openai-assistant-api/line-developer-console.png)

## 建立新的 Provider
- https://developers.line.biz/console/
- https://developers.line.biz/en/docs/line-developers-console/overview/
  ![](/line/line-developer-create-provider.png)
  ![](/line/line-developer-create-provider-name.png)

## Create App From a Provider
![](/ai/openai-assistant-api/create-app-from-provider.png)

## Create New Channel
![](/ai/openai-assistant-api/create-new-channel-1.png)
![](/ai/openai-assistant-api/create-new-channel-2.png)

## Setup Channel Settings and Approve Policies
- Company Name
- Channel Name
- Channel Description
- Category
- Subcategory
- ...

## Get Messaging API Credentials
- Channel Access Token
- AdminUserId
  - Basic Settings > Your user ID

## Setup Webhook URL
>set up local development environment by ngrok
- get current application running port
- run ngrok

```
ngrok http localhost:{port}
```

```
ngrok http https://localhost:{{port}} --host-header=localhost:{{port}}
```

- get a public url for webhook

- use webhook url
  - Messaging API > Webhook settings > Use webhooks > Enabled

- update webhook url in Line Developer Console
  - Messaging API > Webhook settings > Webhook URL
- verify webhook url

## Disable Auto-Reply
- Messaging API > LINE Official Account features > Auto-reply messages > Disabled

![](/ai/openai-assistant-api/disable-messaging-api-auto-reply.png)

## Inspect Webhook Request
- Use ngrok to inspect webhook request

```
http://localhost:4040/inspect/http
```

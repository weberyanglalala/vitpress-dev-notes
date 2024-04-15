# Lab: Build Your Own Chatbot
- https://www.coze.com/

## Coze DOC
- https://www.coze.com/docs/zh_cn/quickstart.html

## 參考 Coze 官方文件，將 Coze Bot 發布至 Line Bot
- https://www.coze.com/docs/publish/line

## Part01: Publish Coze Bot
### 1. Publish
![](/ai/coze/BywqDcrca.png)
### 2. Configure Line Settings
![](/ai/coze/ryRCP5rqp.png)
### 3. 參考下方填入 Channel ID(Part02-6), Channel SecretID(Part02-6), Channel Access Token(Part02-9)
![](/ai/coze/r1-duqS5T.png)
#### 4. 完成後如下
![](/ai/coze/rJQQbiScp.png)
![](/ai/coze/HJTMWjBc6.png)
![](/ai/coze/BkcQborqT.png)


## Part02: 創建 Line Channel
### 1. 申請 Line Developer 帳號
- https://www.kolable.app/posts/9a7e992d-aba1-4707-823e-f771bc19ab2e

### 2. Create A New Line Channel
![](/ai/coze/B1WrMcH96.png)

### 3. 選擇 Line Messaging API
![](/ai/coze/rJktGqHcp.png)

### 4. 設定 Channel Info
![](/ai/coze/SJPfX5B5a.png)

### 5. 確認設定
![](/ai/coze/SyynQqH9a.png)

### 6. 進入剛剛新增的 Channel, 在 Basic settings 子頁找到 Channel ID
![](/ai/coze/ryH_KqSqT.png)

### 7. Basic settings 子頁找到 Channel secret
![](/ai/coze/rJsec5Bq6.png)

### 8. 在 Messaging API 子頁設定 Webhook，填入 Part01-3 Webhook URL
![](/ai/coze/ByVpicB9p.png)
![](/ai/coze/SkIUh9S5a.png)
- Webhook Redelivery: 當 webhook 發送失敗，line 會重新發出 request

### 9. 在 Messaging API 子頁，Issue Channel Access Token
![](/ai/coze/Hk4W65Sca.png)

### 10. 設定 Auto-reply messages，關閉自動回應訊息
![](/ai/coze/HytX05S9T.png)
![](/ai/coze/HkoBgjHcp.png)

### 11. 透過 Messaging API 子頁，basic ID, QRCode 分享你的 Bot
![](/ai/coze/BkhR-oHq6.png)



## 什麼是 Webhook
https://medium.com/@justinlee_78563/line-bot-%E7%B3%BB%E5%88%97%E6%96%87-%E4%BB%80%E9%BA%BC%E6%98%AF-webhook-d0ab0bb192be
>Webhook是一種基於事件觸發的HTTP POST請求機制，允許應用程式在特定事件發生時自動通知其他系統或服務，實現數據的實時傳輸和處理。

- 事件觸發：Webhook首先基於事件驅動的模型。當在一個應用程式中發生特定事件時（例如，有新的提交到代碼庫，或者有新的博客評論），就會觸發Webhook。
- HTTP 請求：觸發後，該應用程式會向一個事先設定好的URL（即Webhook URL）發送一個HTTP 請求。這個請求包含了與事件相關的數據或信息。
- 數據傳輸：當接收方的Web應用程式收到這個HTTP 請求後，就會根據請求中的數據進行相應的處理或反應。這可以是更新數據庫，觸發其他流程，或者是通知用戶等動作。
- 實時性和自動化：Webhook的一大優勢是其實時性和自動化特點。由於是事件驅動，因此只要事件發生，相關的通知和數據傳輸就會立即進行，無需人工介入。

# Line Messaging API Overview

- https://developers.line.biz/en/docs/messaging-api/overview/ 

## 簡介

LINE Messaging API 讓您可以建立機器人，為 LINE 使用者提供個性化的體驗。要使用 Messaging API，首先需要將您的機器人與 LINE 平台上的 [頻道](https://developers.line.biz/en/glossary/#channel) 連接。當您建立頻道時，LINE 平台會自動為該頻道創建一個 [LINE 官方帳號](https://developers.line.biz/en/glossary/#line-official-account)。

## 如何運作

Messaging API 允許機器人伺服器通過 HTTPS 以 JSON 格式與 LINE 平台進行數據傳輸。以下是機器人伺服器與 LINE 平台之間的通信流程：

1. 使用者發送消息給 LINE 官方帳號。
2. LINE 平台將 webhook 事件發送到機器人伺服器的 webhook URL。
3. 機器人伺服器檢查 webhook 事件，並通過 LINE 平台回應使用者。

![通信流程](https://developers.line.biz/assets/img/messaging-api-architecture.f40bffbb.png)

## 功能

### 發送回覆消息

您可以使用 Messaging API 向加您為好友的使用者發送回覆消息。詳情請參閱[發送消息](https://developers.line.biz/en/docs/messaging-api/sending-messages/)。

### 隨時發送消息

您可以隨時使用 Messaging API 向使用者發送消息。詳情請參閱[發送消息](https://developers.line.biz/en/docs/messaging-api/sending-messages/)。

### 發送不同類型的消息

Messaging API 支援發送多種類型的消息，包括文字、貼圖、圖片、影片、音頻、位置、Imagemap、模板消息及 Flex Message。詳情請參閱[消息類型](https://developers.line.biz/en/docs/messaging-api/message-types/)。

### 獲取使用者發送的內容

您可以通過 Messaging API 獲取使用者發送的圖片、影片、音頻和文件。用戶發送的內容會在一段時間後自動刪除。詳情請參閱[獲取內容](https://developers.line.biz/en/reference/messaging-api/#get-content)。

### 獲取使用者資料

您可以通過 Messaging API 獲取與您的 LINE 官方帳號互動的使用者的資料，包括顯示名稱、語言、頭像和狀態消息。詳情請參閱[獲取資料](https://developers.line.biz/en/reference/messaging-api/#get-profile)。

### 加入群聊

Messaging API 可以讓您在群聊中發送消息，並獲取群聊成員的資料。詳情請參閱[群聊](https://developers.line.biz/en/docs/messaging-api/group-chats/)。

### 使用豐富菜單

Messaging API 允許您在聊天中設置和自定義豐富菜單，幫助使用者找到如何與您的 LINE 官方帳號互動。詳情請參閱[使用豐富菜單](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/)。

### 使用 Beacon

利用 LINE Beacon，您可以設置您的 LINE 官方帳號與進入 beacon 區域的使用者互動。詳情請參閱[使用 Beacon](https://developers.line.biz/en/docs/messaging-api/using-beacons/)。

### 使用帳號連結

Messaging API 允許您安全地將使用者在您服務中的帳號與他們的 LINE 帳號連結。詳情請參閱[帳號連結](https://developers.line.biz/en/docs/messaging-api/linking-accounts/)。

### 獲取發送消息的數量

您可以通過 Messaging API 獲取從您的 LINE 官方帳號發送的消息數量。僅計算通過 Messaging API 發送的消息。詳情請參閱以下文檔：
* [獲取本月發送消息的目標限制](https://developers.line.biz/en/reference/messaging-api/#get-quota)
* [獲取本月發送的消息數量](https://developers.line.biz/en/reference/messaging-api/#get-consumption)
* [獲取發送的回覆消息數量](https://developers.line.biz/en/reference/messaging-api/#get-number-of-reply-messages)
* [獲取發送的推送消息數量](https://developers.line.biz/en/reference/messaging-api/#get-number-of-push-messages)
* [獲取發送的多播消息數量](https://developers.line.biz/en/reference/messaging-api/#get-number-of-multicast-messages)
* [獲取發送的廣播消息數量](https://developers.line.biz/en/reference/messaging-api/#get-number-of-broadcast-messages)

## 訂閱方案及費用

您可以免費開始使用 Messaging API。每個月可以免費發送一定數量的消息，具體數量取決於您的 LINE 官方帳號的訂閱方案。超過免費消息限制後，您可以根據發送的額外消息數量支付相應費用。詳情請參閱[訂閱方案](https://www.lycbiz.com/jp/service/line-official-account/plan/)（僅提供日文）。

## 下一步

接下來，請參閱[開始使用 Messaging API](https://developers.line.biz/en/docs/messaging-api/getting-started/)來創建一個機器人。首先需要從 LINE Developers Console 創建一個 Messaging API 頻道，LINE 平台會為該頻道創建一個 LINE 官方帳號。

## 相關資源

* [Messaging API 開發指南](https://developers.line.biz/en/docs/messaging-api/development-guidelines/)
* [LINE Messaging API SDKs](https://developers.line.biz/en/docs/messaging-api/line-bot-sdk/)
* [Messaging API 參考](https://developers.line.biz/en/reference/messaging-api/)

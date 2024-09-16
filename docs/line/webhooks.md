# 開發文件：如何接收 LINE 消息（Webhook）

## Reference
- https://developers.line.biz/en/reference/messaging-api/#webhooks

## 目錄
1. [介紹](#介紹)
2. [設置 Webhook URL](#設置-webhook-url)
3. [驗證簽名](#驗證簽名)
4. [Webhook 事件類型](#webhook-事件類型)
5. [處理撤回事件](#處理撤回事件)
6. [Webhook 再傳送](#webhook-再傳送)
7. [獲取用戶發送的內容](#獲取用戶發送的內容)
8. [獲取用戶資料](#獲取用戶資料)
9. [總結](#總結)

## 介紹
每當用戶加好友或發送消息給你的 LINE 官方帳號時，LINE 平台會向你在 [LINE 開發者控制台](https://developers.line.biz/console/) 中註冊的 webhook URL 發送 HTTP POST 請求，請求中包含 webhook 事件對象。

確保你的機器人服務器能夠正確處理這些 webhook 事件對象，否則 LINE 平台可能會暫停向你的機器人服務器發送 webhook。

## 設置 Webhook URL
1. 登錄 [LINE 開發者控制台](https://developers.line.biz/console/)，選擇你的頻道。
2. 進入頻道設定，點擊 **Messaging API** 標籤。
3. 在 Webhook 設置中，輸入你的機器人服務器的 URL，並啟用 **Use webhook**。

## 驗證簽名
- https://developers.line.biz/en/reference/messaging-api/#signature-validation
為確保請求來自 LINE 平台，你需要驗證 `x-line-signature` 請求標頭中的簽名。

1. 使用 HMAC-SHA256 算法計算請求體的摘要，密鑰為 [channel secret](https://developers.line.biz/en/glossary/#channel-secret)。
2. 比對計算出的 Base64 編碼摘要與 `x-line-signature` 請求標頭中的簽名。

以下是 Python 代碼示例：
```python
import base64
import hashlib
import hmac

channel_secret = '...' # Channel secret 字串
body = '...' # 請求體字串
hash = hmac.new(channel_secret.encode('utf-8'),
    body.encode('utf-8'), hashlib.sha256).digest()
signature = base64.b64encode(hash)
# 比對 x-line-signature 請求標頭中的簽名與計算出的簽名
```

## Webhook 事件類型
你可以根據 webhook 事件對象中的數據控制你的機器人的反應。以下是一些常用的事件類型：

### 單聊或群聊中的 Webhook 事件
| Webhook 事件 | 接收條件 | 單聊 | 群聊和多人聊天 |
| --- | --- | --- | --- |
| [Message event](https://developers.line.biz/en/reference/messaging-api/#message-event) | 當用戶發送消息時 | ✅ | ✅ |
| [Unsend event](https://developers.line.biz/en/reference/messaging-api/#unsend-event) | 當用戶撤回消息時 | ✅ | ✅ |
| [Follow event](https://developers.line.biz/en/reference/messaging-api/#follow-event) | 當用戶加好友或解除封鎖時 | ✅ | ❌ |
| [Unfollow event](https://developers.line.biz/en/reference/messaging-api/#unfollow-event) | 當用戶封鎖帳號時 | ✅ | ❌ |
| [Join event](https://developers.line.biz/en/reference/messaging-api/#join-event) | 當帳號加入群聊或多人聊天時 | ❌ | ✅ |
| [Leave event](https://developers.line.biz/en/reference/messaging-api/#leave-event) | 當帳號離開群聊或多人聊天時 | ❌ | ✅ |
| [Member join event](https://developers.line.biz/en/reference/messaging-api/#member-joined-event) | 當用戶加入群聊或多人聊天時 | ❌ | ✅ |
| [Member leave event](https://developers.line.biz/en/reference/messaging-api/#member-left-event) | 當用戶離開群聊或多人聊天時 | ❌ | ✅ |
| [Postback event](https://developers.line.biz/en/reference/messaging-api/#postback-event) | 當用戶觸發回傳動作時 | ✅ | ✅ |
| [Video viewing complete event](https://developers.line.biz/en/reference/messaging-api/#video-viewing-complete) | 當用戶觀看完指定 trackingId 的視頻消息時 | ✅ | ❌ |

## 處理撤回事件
當用戶撤回消息時，會發送 [unsend event](https://developers.line.biz/en/reference/messaging-api/#unsend-event) 到機器人服務器。建議服務提供商尊重用戶的撤回意圖，適當處理消息，以確保目標消息未來不可見或使用。

例如：
* 取消管理界面上顯示的目標消息。
* 刪除存儲在數據庫中的目標消息。

## Webhook 再傳送
如果機器人服務器未能正常響應 webhook，LINE 平台會在一定時間內再次傳送該 webhook。為啟用該功能，請執行以下步驟：

1. 在 [LINE 開發者控制台](https://developers.line.biz/console/) 打開頻道設置。
2. 點擊 **Messaging API** 標籤。
3. 啟用 **Use webhook**。
4. 啟用 **Webhook redelivery**。

## 獲取用戶發送的內容
你可以通過 webhook 獲取用戶發送的圖片、視頻、音頻及文件。例如：

```bash
curl -v -X GET https://api-data.line.me/v2/bot/message/{messageId}/content \
-H 'Authorization: Bearer {channel access token}'
```

## 獲取用戶資料
你可以通過 webhook 中包含的用戶 ID 獲取用戶的 LINE 資料。例如：

```bash
curl -v -X GET https://api.line.me/v2/bot/profile/{userId} \
-H 'Authorization: Bearer {channel access token}'
```

成功後會返回 JSON 對象。

## 總結
本文件詳細介紹了如何設置和驗證 LINE 的 webhook 以及處理各種事件。希望這能幫助你更好地開發 LINE 的應用程序。

若有任何問題，請參考 [LINE 官方文檔](https://developers.line.biz/en/docs/)。

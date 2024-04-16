---
title: Open AI Assistants API
lang: zh-TW
---

# Open AI Assistants API Basics and Retrieval

> https://platform.openai.com/docs/assistants/overview?context=with-streaming

::: info 概觀

- Assistants API 是一個用於創建對話式聊天機器人的 API，這些對話式聊天機器人可以用於回答問題、提供建議、解釋概念等。
- Assistants API 可以上傳特定文檔資料，並根據這些資料來生成回應。
- Assistants API 可以藉由 code interpreter、retrieval、functions 等工具，可以將助手訓練成能執行特定任務的應用程式。

:::

## OpenAI GPTs 示意圖

![](/ai/openai-assistants-api.png)

1. Name: Assistant 的名稱。
2. Instructions: 用於設定 Assistant 的行為以及指令。
3. Model: 呼叫 Assistant 所使用的模型。
4. Tools: Assistant 可以使用的工具，例如 Code Interpreter(代碼解釋器), Retrieval(檢索), Functions(函數調用)等。
5. Files: Assistant 用於檢索的文件。

::: details Retrieval 資料檢索
> Retrieval enables the assistant with knowledge from files that you or your users upload.
> Once a file is uploaded, the assistant automatically decides when to retrieve content based on user requests.

- Retrieval 使 Assistant 具備你或你的使用者上傳檔案的知識。
- 上傳檔案後，Assistant 會根據使用者的要求自動決定何時檢索內容。

:::

::: details Code Interpreter 代碼解釋器
> Code Interpreter enables the assistant to write and run code. This tool can process files with diverse data and
> formatting, and generate files such as graphs.

- Code Interpreter 是一種工具，可以讓助手寫和運行程式。該工具可以處理各種資料和格式的檔案，並生成圖表等檔案。

:::

::: details Functions 函數調用
> Function calling lets you describe custom functions of your app or external APIs to the assistant.
> This allows the assistant to intelligently call those functions by outputting a JSON object containing relevant
> arguments

- 功能呼叫讓您可以描述應用程序或外部 API 的自訂功能。這使助理能夠聰明地呼叫這些功能，並通過包含相關參數的 JSON 物件，輸出結果。

:::

## OpenAI Assistant API 整合流程

1. 定義 instructions 個性化指令和選擇模型來創建 Assistant。
2. 啟用 Tools 工具：
   - Retrieval 資料檢索
   - Code Interpreter 代碼解釋器
   - Functions 函數調用
3. 上傳 Files 檔案，用於資料檢索。 
4. 當使用者開始對話前，創建 Thread 線程。
5. 在 Thread 線程中加入使用者提出的問題。 
6. 在 Thread 上 Run 啟用並呼叫，以產生響應，並呼叫模型和工具。

## How Assistants API works?

- [How Assistants work](https://platform.openai.com/docs/assistants/how-it-works)

## Travel Recommendation Assistant

### Sample Input

```text
我想要查詢台北藝文行程，我想要品味美食、感受文化
```

### Assistant API Logs

#### 1. 使用者撰寫 prompt，建立 Thread，新增 User Message
![](/ai/openai-assistant-api/create-new-message.png)

#### 2. 此時只有建立 Message 並沒有執行並取得結果
![](/ai/openai-assistant-api/return-message-create-success.png)

#### 3. Running Retrieval 資料檢索
![](/ai/openai-assistant-api/running-retrieval.png)

#### 4. Run Thread Logs
![](/ai/openai-assistant-api/run-thread-logs.png)



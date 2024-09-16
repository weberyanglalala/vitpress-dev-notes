# 開發文件：LINE LIFF 應用程式的驗證與設置指南

## 簡介
此文件將指導您如何在 Azure 平台上配置和驗證您的 LINE LIFF（LINE Front-end Framework）應用程式。請依照以下步驟進行操作。

## 1. 配置 LIFF 端點
### 步驟 1：進入 LINE Developers 控制台
前往 [LINE Developers Console](https://developers.line.biz/console/)，進入您在「創建 LINE 頻道 -> 添加 LIFF 應用」中創建的 LIFF 應用頁面。

![Image 1: LIFF console](https://github.com/line/line-api-use-case-members-card-azure/raw/main/docs/images/en/liff-console.png)

### 步驟 2：編輯端點 URL
在端點 URL 欄位中點擊「編輯」按鈕。

![Image 2: Edit Endpoint URL](https://github.com/line/line-api-use-case-members-card-azure/raw/main/docs/images/en/end-point-url-description.png)

### 步驟 3：設置 URL
將您在「構建和部署生產環境 (Azure)」過程中保存的 Azure 靜態 Web 應用主機名稱前添加 `https://`，並將其輸入至 URL 欄位中，然後點擊「更新」。

![Image 3: Description of the endpoint URL](https://github.com/line/line-api-use-case-members-card-azure/raw/main/docs/images/en/end-point-url-editing.png)

## 2. 配置富選單
如果您希望設置一個富選單來啟動應用程式，請參考以下連結並進行設置：
[創建富選單](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/#creating-a-rich-menu-with-the-line-manager)

## 3. 驗證操作
當您完成所有步驟後，請訪問您在「創建 LINE 頻道 -> 添加 LIFF 應用」中創建的 LIFF 應用的 LIFF URL，並確認其是否正常運作。

## 結論
按照以上步驟，您應該能夠成功配置和驗證您的 LINE LIFF 應用程式。如果您在過程中遇到任何問題，請參考 [LINE API 使用案例文件](https://github.com/line/line-api-use-case-members-card-azure/blob/main/docs/en/README_en.md)。

希望這份指南對您有所幫助，祝您開發順利！

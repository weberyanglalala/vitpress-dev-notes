# 在 .NET 中使用 HttpClient 來模擬上述的curl命令

> https://platform.openai.com/docs/assistants/overview/step-1-create-an-assistant

```bash
curl "https://api.openai.com/v1/assistants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v1" \
  -d '{
    "instructions": "You are a personal math tutor. Write and run code to answer math questions.",
    "name": "Math Tutor",
    "tools": [{"type": "code_interpreter"}],
    "model": "gpt-4"
  }'
```

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static readonly HttpClient client = new HttpClient();

    static async Task Main()
    {
        try
        {
            // 設定API Key
            string apiKey = "YOUR_OPENAI_API_KEY";
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            client.DefaultRequestHeaders.Add("OpenAI-Beta", "assistants=v1");

            // 設定請求內容
            var content = new StringContent(
                @"{
                    ""instructions"": ""You are a personal math tutor. Write and run code to answer math questions."",
                    ""name"": ""Math Tutor"",
                    ""tools"": [{""type"": ""code_interpreter""}],
                    ""model"": ""gpt-4""
                }",
                Encoding.UTF8,
                "application/json");

            // 發送POST請求
            HttpResponseMessage response = await client.PostAsync("https://api.openai.com/v1/assistants", content);

            // 處理回應
            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine(responseBody);
            }
            else
            {
                Console.WriteLine($"Error: {response.StatusCode}");
            }
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine("\nException Caught!");
            Console.WriteLine($"Message :{e.Message} ");
        }
    }
}
```

## 使用 IHttpClientFactory 以建立 HttpClient 類型的實例

> https://learn.microsoft.com/zh-tw/dotnet/core/extensions/httpclient-factory

### Setup Http Headers

- 在這個範例程式碼中，我們首先設定了`Authorization`和`Open AI-Beta`標頭，以便在發送請求時進行身份驗證和指定API版本。

```csharp
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
client.DefaultRequestHeaders.Add("OpenAI-Beta", "assistants=v1");
```

### Create Request Content

- 然後，它將會創建一個包含請求內容的`StringContent`實例，並使用`PostAsync`方法發送POST請求到指定的URL。

```csharp
// TODO: fix the JSON string
var content = new StringContent(
                @"{
                    ""instructions"": ""You are a personal math tutor. Write and run code to answer math questions."",
                    ""name"": ""Math Tutor"",
                    ""tools"": [{""type"": ""code_interpreter""}],
                    ""model"": ""gpt-4""
                }",
                Encoding.UTF8,
                "application/json");
```

### Handle Response

- 最後，它將會檢查回應的狀態碼，並輸出回應內容或錯誤訊息。

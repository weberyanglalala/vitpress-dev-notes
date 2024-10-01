# Semantic Kernel Note

- https://learn.microsoft.com/en-us/semantic-kernel/get-started/quick-start-guide?pivots=programming-language-csharp

## What is Semantic Kernel?

- https://learn.microsoft.com/en-us/semantic-kernel/concepts/kernel?pivots=programming-language-csharp

- Kernel 是 Semantic Kernel 的核心組件。
- 簡單來說，Kernel 是一個依賴注入容器，負責管理運行您的 AI 應用所需的所有 Service 和 Plugin。

## What does Semantic Kernel do?

- 選擇最佳的 AI 服務來運行 prompt。
- 使用提供的 prompt template 構建 prompt。 
- 將 prompt 發送到 AI 服務，接收並解析響應。
- 最後將來自 LLM 的 response 返回給您的應用程序

::: info

- Kernel 是一個依賴注入容器，負責管理運行您的 AI 應用所需的所有 Service 和 Plugin。
- Service 包括 AI 服務（例如，Chat Completion, text ）和運行應用程序所需的其他服務（例如，Logging 和 HTTP Client）。
- Plugin 是一個包含一個或多個 Kernel Function 的 Component，例如，Kernel 可以透過 Plugin 呼叫其中的 function 從數據庫檢索數據或調用外部API以執行操作。

:::

## Quick Start Guide

- 安裝必要的套件
- 建立一個 Console Application 使用 Chat 進行對話
- 讓 Semantic Kernel 運行自定義的 Action
- 觀察 Semantic Kernel 如何執行 Action

## Install the required packages

```
<PackageReference Include="Microsoft.SemanticKernel" Version="1.21.1" />
<PackageReference Include="Microsoft.SemanticKernel.Connectors.OpenAI" Version="1.21.1" />
<PackageReference Include="Microsoft.SemanticKernel.PromptTemplates.Handlebars" Version="1.21.1" />
```

## Lab01: Semantic Kernel Intro

> https://ai.google.dev/gemini-api/docs/api-key?hl=zh-tw

> https://github.com/microsoft/semantic-kernel/blob/main/dotnet/samples/GettingStarted/Step1_Create_Kernel.cs

```csharp
// Import packages
// 安裝套件

using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;

// Create a kernel with OpenAI chat completion
// 建立一個 Kernel

// Create a kernel with OpenAI chat completion
#pragma warning disable SKEXP0070
var kernel = Kernel.CreateBuilder()
    .AddGoogleAIGeminiChatCompletion("gemini-1.5-flash", "").Build();
//.AddOpenAIChatCompletion("gpt-4o-mini-2024-07-18", "").Build();

// Example 1. Invoke the kernel with a prompt and display the result
// 呼叫 Kernel 進行對話
Console.WriteLine(await kernel.InvokePromptAsync("天空是什麼顏色？"));
Console.WriteLine();

// Example 2. Invoke the kernel with a templated prompt and display the result
// 透過 Prompt Template 進行對話
KernelArguments arguments = new() { { "topic", "海洋" } };
Console.WriteLine(await kernel.InvokePromptAsync("{{$topic}} 是什麼顏色？", arguments));
Console.WriteLine();

// Example 3. Invoke the kernel with a templated prompt and stream the results to the display
// 使用模板提示並將結果以串流方式顯示
await foreach (var update in kernel.InvokePromptStreamingAsync("{{$topic}} 是什麼顏色? 提供詳細的解釋。", arguments))
{
    Console.Write(update);
}

Console.WriteLine(string.Empty);

// Example 4. Invoke the kernel with a templated prompt and execution settings
// 模板提示和執行設定來呼叫 Kernel
arguments = new(new OpenAIPromptExecutionSettings { MaxTokens = 500, Temperature = 0.5 }) { { "topic", "dogs" } };
Console.WriteLine(await kernel.InvokePromptAsync("請告訴我一個關於 {{$topic}} 的故事。 ", arguments));

// Example 5. Invoke the kernel with a templated prompt and execution settings configured to return JSON
// 使用模板化提示和設定回覆型別為 JSON
#pragma warning disable SKEXP0010
arguments = new(new OpenAIPromptExecutionSettings { ResponseFormat = "json_object" }) { { "topic", "chocolate" } };
Console.WriteLine(await kernel.InvokePromptAsync("創建一個食譜： {{$topic}} cake in JSON format", arguments));

```

## Lab02: Semantic Kernel With Plugin

```csharp
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using System.Reflection;

namespace ConsoleApp2;

class Program
{
    [Experimental("SKEXP0001")]
    static async Task Main(string[] args)
    {
        // Create a kernel with OpenAI chat completion
        IKernelBuilder kernelBuilder = Kernel.CreateBuilder();
        kernelBuilder.AddOpenAIChatCompletion("gpt-4o-mini-2024-07-18",
            "");
        kernelBuilder.Plugins.AddFromType<TimeInformation>();
        kernelBuilder.Plugins.AddFromType<WidgetFactory>();
        Kernel kernel = kernelBuilder.Build();

        // Example 1. Invoke the kernel with a prompt that asks the AI for information it cannot provide and may hallucinate
        Console.WriteLine("Example 1:");
        Console.WriteLine(await kernel.InvokePromptAsync("距離聖誕節還有多少天？"));
        Console.WriteLine();

        // Example 2. Invoke the kernel with a templated prompt that invokes a plugin and display the result
        Console.WriteLine("Example 2:");
        Console.WriteLine(await kernel.InvokePromptAsync(
            "目前時間是 {{TimeInformation.GetCurrentUtcTime}}. 距離聖誕節還有多少天？"));
        Console.WriteLine();

        // Example 3. Invoke the kernel with a prompt and allow the AI to automatically invoke functions
        Console.WriteLine("Example 3:");
        OpenAIPromptExecutionSettings settings = new() { FunctionChoiceBehavior = FunctionChoiceBehavior.Auto() };
        Console.WriteLine(await kernel.InvokePromptAsync("聖誕節距今還有多少天？解釋一下你的思考過程。",
            new(settings)));
        Console.WriteLine();
        
        Console.WriteLine("Example 4:");
        // Example 4. Invoke the kernel with a prompt and allow the AI to automatically invoke functions that use enumerations
        Console.WriteLine(await kernel.InvokePromptAsync("為我創建一個 lime 顏色 widget。", new(settings)));
        Console.WriteLine(await kernel.InvokePromptAsync("為我創建一個 scarlet 顏色 widget",
            new(settings)));
        Console.WriteLine(await kernel.InvokePromptAsync("為我創建一個 attractive maroon and navy colored widget",
            new(settings)));
    }

    /// <summary>
    /// A plugin that returns the current time.
    /// </summary>
    public class TimeInformation
    {
        [KernelFunction]
        [Description("Retrieves the current time in UTC.")]
        public string GetCurrentUtcTime() => DateTime.UtcNow.ToString("R");
    }

    /// <summary>
    /// A plugin that creates widgets.
    /// </summary>
    public class WidgetFactory
    {
        [KernelFunction]
        [Description("Creates a new widget of the specified type and colors")]
        public WidgetDetails CreateWidget([Description("The type of widget to be created")] WidgetType widgetType,
            [Description("The colors of the widget to be created")] WidgetColor[] widgetColors)
        {
            var colors = string.Join('-', widgetColors.Select(c => c.GetDisplayName()).ToArray());
            return new()
            {
                SerialNumber = $"{widgetType}-{colors}-{Guid.NewGuid()}",
                Type = widgetType,
                Colors = widgetColors
            };
        }
    }

    /// <summary>
    /// A <see cref="JsonConverter"/> is required to correctly convert enum values.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum WidgetType
    {
        [Description("A widget that is useful.")]
        Useful,

        [Description("A widget that is decorative.")]
        Decorative
    }

    /// <summary>
    /// A <see cref="JsonConverter"/> is required to correctly convert enum values.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum WidgetColor
    {
        [Description("Use when creating a red item.")]
        Red,

        [Description("Use when creating a green item.")]
        Green,

        [Description("Use when creating a blue item.")]
        Blue
    }

    public class WidgetDetails
    {
        public string SerialNumber { get; init; }
        public WidgetType Type { get; init; }
        public WidgetColor[] Colors { get; init; }
    }
    
}

public static class EnumExtensions
{
    public static string GetDisplayName(this Enum enumValue)
    {
        var field = enumValue.GetType().GetField(enumValue.ToString());
        var attribute = field.GetCustomAttribute<DescriptionAttribute>();
        return attribute == null ? enumValue.ToString() : attribute.Description;
    }
}
```

## Lab03: Generate Product Detail and Category By Plugin

> WF02: Demo: Create Product Detail Workflow
> https://agent.build-school.com/app/7145f604-d7e8-4722-9d48-ecbca9b90467/workflow

### Kernel Function: Generate Travel Category, Description By Category Name

```
生產吸引旅遊者的產品文案，包括旅遊景點、酒店、行程、特別優惠等的推廣內容。
```

```
 1. 接收使用者輸入的行程名稱，並仔細分析其內容。
        2. 根據行程名稱的主題和特點，將其歸類到以下指定的分類之一：
            - Cultural
            - Nature
            - Vacation
            - Adventure
            - Family
            - Backpacking
        3. 確保不自行創建或衍生新的分類，僅使用上述提供的分類。
        4. 輸出結果時，請確保不包含任何XML標籤，僅輸出分類名稱。
        5. 在進行分類時，考慮行程名稱中的關鍵詞和語境，以確保準確性。
```

::: details add logging

```
<ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
    <PackageReference Include="Microsoft.Extensions.Logging.Console" Version="8.0.0" />
    <PackageReference Include="Microsoft.SemanticKernel" Version="1.21.1" />
</ItemGroup>
```

::: 



```csharp
using Microsoft.Extensions.DependencyInjection;

namespace ConsoleApp3;

using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using System.Reflection;
using Microsoft.Extensions.Logging;

class Program
{
    [Experimental("SKEXP0001")]
    static async Task Main(string[] args)
    {
        // Create a kernel with OpenAI chat completion
        IKernelBuilder kernelBuilder = Kernel.CreateBuilder();
        kernelBuilder.AddOpenAIChatCompletion("gpt-4o-mini-2024-07-18",
            "");
        kernelBuilder.Plugins.AddFromType<TravelFactory>();
        kernelBuilder.Services.AddLogging(c => c.AddConsole().SetMinimumLevel(LogLevel.Trace));
        Kernel kernel = kernelBuilder.Build();
        OpenAIPromptExecutionSettings settings = new() { FunctionChoiceBehavior = FunctionChoiceBehavior.Auto(), ResponseFormat = "json_object" };
        Console.WriteLine(await kernel.InvokePromptAsync("請幫我創建一個關於台灣歷史博物館的旅行體驗 in json。", new KernelArguments(settings)));
    }
    

    public class Travel
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public TravelCategory Category { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TravelCategory
    {
        [Description("A travel experience that is about Adventure.")]
        Adventure,

        [Description("A travel experience that is about Nature.")]
        Nature,

        [Description("A travel experience that is about Culture.")]
        Culture,

        [Description("A travel experience that is about Vacation.")]
        Vacation,

        [Description("A travel experience that is about Family.")]
        Family
    }

    public class TravelFactory
    {
        [KernelFunction]
        [Description("Creates a new travel product with the specified name, description, and category.")]
        public Travel CreateTravelProduct([Description("The name of the travel product.")] string productName,
            [Description("The description of the travel product.")]
            string description,
            [Description("The category of the travel product.")]
            TravelCategory category)
        {
            return new Travel
            {
                ProductName = productName,
                Description = description,
                Category = category
            };
        }
    }
}

public static class EnumExtensions
{
    public static string GetDisplayName(this Enum enumValue)
    {
        var field = enumValue.GetType().GetField(enumValue.ToString());
        var attribute = field.GetCustomAttribute<DescriptionAttribute>();
        return attribute == null ? enumValue.ToString() : attribute.Description;
    }
}
```

## Lab04: Semantic Kernel With Chat History
  
```
<ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
    <PackageReference Include="Microsoft.Extensions.Logging.Console" Version="8.0.0" />
    <PackageReference Include="Microsoft.SemanticKernel" Version="1.21.1" />
    <PackageReference Include="Microsoft.SemanticKernel.Core" Version="1.21.1-alpha" />
    <PackageReference Include="Microsoft.SemanticKernel.Plugins.Core" Version="1.21.1-alpha" />
    <PackageReference Include="Microsoft.SemanticKernel.PromptTemplates.Handlebars" Version="1.21.1" />
</ItemGroup>
```


```csharp 
using System.Diagnostics.CodeAnalysis;
using System.Text;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Plugins.Core;
using Microsoft.SemanticKernel.PromptTemplates.Handlebars;

namespace ConsoleApp4
{
    class Program
    {
        private static readonly string OpenApiKey = ""
        private static readonly string DefaultModel = "gpt-4o-mini-2024-07-18";

        [Experimental("SKEXP0050")]
        static async Task Main(string[] args)
        {
            var builder = Kernel.CreateBuilder();
            builder.AddOpenAIChatCompletion(DefaultModel, OpenApiKey);
            builder.Plugins.AddFromType<ConversationSummaryPlugin>();
            var kernel = builder.Build();

            // Create a Semantic Kernel template for chat
            var chat = kernel.CreateFunctionFromPrompt(
                @"{{$history}}
                            User: {{$request}}
                            Assistant: ");
            // Create choices
            List<string> choices = ["Continue", "End", "Summarize"];

            // Create a chat history
            ChatHistory history = [];

            // Create handlebars template for intent
            var functionFromPrompt = kernel.CreateFunctionFromPrompt(
                new()
                {
                    Template = """
                               <message role="system">
                               You are a experienced web developer.
                               You are willing to answer questions about web development.
                               if user intend to summarize the conversation, please summarize the all the chat histories in markdown with
                               clear headings and bullet points and ask for end conversation.
                               if user intend to end the conversation, reply with {{choices.[1]}}.
                               If you are unsure, reply with {{choices.[0]}}.
                               Choices: {{choices}}.</message>
                               {{#each chatHistory}}
                                   <message role="{{role}}">{{content}}</message>
                               {{/each}}

                               <message role="user">{{request}}</message>
                               <message role="system">Intent:</message>
                               """,
                    TemplateFormat = "handlebars"
                },
                new HandlebarsPromptTemplateFactory()
            );

            // Start the chat loop
            while (true)
            {
                // Get user input
                Console.Write("User > ");
                var request = Console.ReadLine();

                // Invoke prompt
                var intent = await kernel.InvokeAsync(
                    functionFromPrompt,
                    new()
                    {
                        { "request", request },
                        { "choices", choices },
                        { "history", history }
                    }
                );

                // End the chat if the intent is "Stop"
                if (intent.ToString().ToUpper() == "END")
                {
                    WriteHistoryToFile(history);
                    break;
                }

                // Get chat response
                var chatResult = kernel.InvokeStreamingAsync<StreamingChatMessageContent>(
                    chat,
                    new()
                    {
                        { "request", request },
                        { "history", string.Join("\n", history.Select(x => x.Role + ": " + x.Content)) }
                    }
                );

                // Stream the response
                var message = new StringBuilder();
                await foreach (var chunk in chatResult)
                {
                    if (chunk.Role.HasValue)
                    {
                        Console.Write(chunk.Role + " > ");
                    }

                    message.Append(chunk.Content);
                    Console.Write(chunk);
                }
                Console.WriteLine();

                // Append to history
                history.AddUserMessage(request!);
                history.AddAssistantMessage(message.ToString());
            }
        }

        private static void WriteHistoryToFile(ChatHistory history)
        {
            string fileName = $"{DateTime.Now:yyyy-MM-dd-HH-mm-ss}-result.txt";
            File.WriteAllText(fileName, string.Join("\n", history.Select(x => x.Role + ": " + x.Content)));
        }

        private static async Task SaveResponseToFileAsync(string response)
        {
            string fileName = $"{DateTime.Now:yyyy-MM-dd-HH-mm-ss}-result.txt";
            await File.WriteAllTextAsync(fileName, response);
        }
    }
}
```

## Lab: Product Detail Create

### System Prompt

```
<instructions>
1. 接收使用者輸入的產品名稱，並確保理解該產品的特性和用途。
2. 使用幽默和有趣的語氣來撰寫產品敘述，讓讀者感到輕鬆愉快。
3. 在撰寫過程中，保持敘述在200字以內，確保信息簡潔明了。
4. 避免使用任何XML標籤，直接生成純文本的產品敘述。
5. 在描述中可以加入一些創意的比喻或幽默的元素，以吸引讀者的注意。
6. 確保產品的主要特點和優勢在敘述中得到充分體現。
</instructions>
```

### User Input

```
吸塵器
```

### Assistant Response

```
這款吸塵器不僅能吸走地板上的灰塵，還能吸走你心中的煩惱！它的吸力強大到可以讓你懷疑自己是不是在家裡養了一隻小黑洞。無論是貓毛、狗毛還是你不小心掉落的薯片屑，它都能一掃而空，讓你的家瞬間變得像新的一樣！
```

## Create A Kernel

### Create a new plugin with folder structure

```
- Plugins(folder)
  - ProductCreatePlugin(folder)
    - ProductDetail(folder)
      - config.json
      - skprompt.txt
```

### config.json

```json
{
  "schema": 1,
  "description": "This plugin is used to create a product detail by providing the product name",
  "completion": {
    "max_tokens": 1000,
    "temperature": 1,
    "top_p": 0.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  },
  "input_variables": [
    {
      "name": "product_name",
      "description": "產品名稱",
      "type": "string",
      "is_required": true
    }
  ]
}
```

### skprompt.txt

```
<instructions>
1. 接收使用者輸入的產品名稱，並確保理解該產品的特性和用途。
2. 使用幽默和有趣的語氣來撰寫產品敘述，讓讀者感到輕鬆愉快。
3. 在撰寫過程中，保持敘述在200字以內，確保信息簡潔明了。
4. 避免使用任何XML標籤，直接生成純文本的產品敘述。
5. 在描述中可以加入一些創意的比喻或幽默的元素，以吸引讀者的注意。
6. 確保產品的主要特點和優勢在敘述中得到充分體現。
</instructions>

<sample_input>
吸塵器
</sample_input>

<sample_output>
這款吸塵器不僅能吸走地板上的灰塵，還能吸走你心中的煩惱！它的吸力強大到可以讓你懷疑自己是不是在家裡養了一隻小黑洞。無論是貓毛、狗毛還是你不小心掉落的薯片屑，它都能一掃而空，讓你的家瞬間變得像新的一樣！
</sample_output>

<user_input>
{{$product_name}}
</user_input>

```

### Program.cs

```csharp
builder.Services.AddSingleton<Kernel>(sp =>
        {
            var kernelBuilder = Kernel.CreateBuilder();
            kernelBuilder.Services.AddOpenAIChatCompletion("gpt-4o-2024-08-06", builder.Configuration["OpenAIApiKey"]); 
            return kernelBuilder.Build();
        });
builder.Services.AddScoped<ProductDetailClient>();
```

### ProductDetailClient.cs

```csharp
using Microsoft.SemanticKernel;

namespace Dotnet8DifyAgentSample.Services.SemanticKernel;

public class ProductCreateClient
{
    private readonly Kernel _kernel;

    public ProductCreateClient(Kernel kernel)
    {
        _kernel = kernel;
    }

    public async Task<string> CreateProductDetail(string productName)
    {
        var pluginDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
        var plugin = _kernel.ImportPluginFromPromptDirectory(Path.Combine(pluginDirectory, "ProductCreatePlugin"));
        var productDetailFunction = plugin["ProductDetail"];
        var response = await _kernel.InvokeAsync(productDetailFunction, arguments: new()
        {
            { "product_name", productName }
        });
        return response.ToString();
    }
}
```

## Lab02: Product CRUD Plugin

### Install the required packages

```
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.8"/>
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.8">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
</PackageReference>
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.8"/>
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.8">
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    <PrivateAssets>all</PrivateAssets>
</PackageReference>
```

### Code First

```csharp
namespace Dotnet8DifyAgentSample.Models;

using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    public Guid Id { get; set; }

    [MaxLength(50)]
    public string Name { get; set; }

    public string Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal SalePrice { get; set; }

    [Required]
    [DefaultValue(0)]
    public int SaleCount { get; set; }
}
```

### DbContext

```csharp
namespace Dotnet8DifyAgentSample.Models;

using Microsoft.EntityFrameworkCore;

public class SkDbContext : DbContext
{
    public SkDbContext(DbContextOptions<SkDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnType("uniqueidentifier");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnType("nvarchar(50)");

            entity.Property(e => e.Description)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.SalePrice)
                .IsRequired()
                .HasColumnType("decimal(18, 2)");

            entity.Property(e => e.SaleCount)
                .IsRequired()
                .HasDefaultValue(0)
                .HasColumnType("int");
        });
    }
}
```

### Add DbContext to DI

```csharp
builder.Services.AddDbContext<SkDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
```

### add-migration

```
dotnet ef migrations add InitialCreate
```

### update-database

```
dotnet ef database update
```

### Insert Seed Data

::: details Seed Data

```sql
INSERT INTO Products (Name, Description, SalePrice) VALUES
(N'日月潭湖光山色之旅', N'體驗台灣最美麗的高山湖泊，日月潭。乘坐遊艇欣賞湖光山色，漫步湖畔步道，品嚐邵族風味餐。參觀文武廟，欣賞湖景。纜車登頂欣賞全景，享受茶園風光。晚間觀賞水社碼頭夜景，感受寧靜湖面月色。行程包括湖區環湖自行車，充分感受大自然魅力。', 3500.00),
(N'阿里山森林鐵路之旅', N'搭乘百年阿里山森林鐵路，穿梭在雲霧繚繞的山林間。清晨觀賞著名的阿里山日出，漫步在參天巨木的森林步道。品嚐高山茶和當地特色料理。夜晚觀星，感受高山的寧靜。行程包括參觀阿里山神木園區、姊妹潭，以及體驗獨特的森林療癒。', 4200.00),
(N'台北101購物美食之旅', N'登上台北101觀景台，俯瞰整個台北市。在101購物中心享受豪華購物體驗，品嚐米其林星級餐廳。漫步信義區，感受現代都市魅力。晚間遊覽饒河街夜市，品嚐各式台灣小吃。行程包括參觀中正紀念堂、龍山寺等經典景點。', 2800.00),
(N'墾丁陽光沙灘之旅', N'在台灣最南端的墾丁，享受陽光、沙灘、海浪。參與水上活動如浮潛、衝浪，探索海底世界。參觀鵝鑾鼻燈塔，欣賞台灣海峽和巴士海峽交會的壯麗景色。夜晚逛墾丁大街，感受熱鬧夜市氛圍。行程包括船遊後壁湖，欣賞美麗的海岸線。', 3800.00),
(N'太魯閣峽谷探險之旅', N'探索台灣最壯麗的自然景觀之一，太魯閣國家公園。沿著峭壁開鑿的步道，欣賞垂直的大理石峽谷。參觀燕子口、九曲洞等著名景點。體驗太魯閣族文化，品嚐原住民特色料理。行程包括健行砂卡礑步道，近距離感受峽谷的雄偉。', 3600.00),
(N'九份山城懷舊之旅', N'漫步在充滿復古風情的九份老街，感受昔日黃金礦town的繁華。品嚐各式傳統小吃如芋圓、魚丸。參觀九份金礦博物館，了解採金歷史。欣賞基隆山日出,享用老街美食早餐。在西本願寺眺望海岸線。行程包括參觀十分老街,放天燈祈福。', 2500.00),
(N'花蓮太魯閣山海之旅', N'探訪花蓮壯麗的自然景觀。遊覽太魯閣國家公園,欣賞峭壁峽谷。參觀七星潭,漫步礫石海灘。品嚐當地特色料理如扁食、麻糬。體驗原住民文化,欣賞傳統歌舞表演。行程包括泛舟秀姑巒溪,感受刺激與自然之美。', 4000.00),
(N'高雄港都風情之旅', N'探索台灣南部最大城市高雄的魅力。搭乘愛河遊船,欣賞河岸風光。參觀駁二藝術特區,感受文創氛圍。遊覽蓮池潭風景區,欣賞龍虎塔。夜遊六合夜市,品嚐道地小吃。行程包括參觀佛光山佛陀紀念館,感受佛教文化。', 2700.00),
(N'台中文化古都之旅', N'體驗台中獨特的文化氛圍。參觀台中國家歌劇院,欣賞建築之美。漫步審計新村文創園區,感受文青氣息。遊覽高美濕地,欣賞夕陽美景。品嚐道地小吃如珍珠奶茶、太陽餅。行程包括參觀彩虹眷村,拍攝繽紛彩繪。', 2600.00),
(N'澎湖藍天碧海之旅', N'探索台灣離島之美,澎湖群島。乘船遊覽吉貝沙尾,漫步細軟白沙。參與水上活動如浮潛、風帆。品嚐新鮮海鮮料理。夜間體驗奢華沙灘露營,欣賞璀璨星空。行程包括參觀澎湖天后宮,了解媽祖信仰文化。', 5000.00),
(N'金門戰地風情之旅', N'探訪充滿歷史韻味的金門。參觀古寧頭戰史館,了解兩岸關係歷史。品嚐金門特產高梁酒、貢糖。漫步經典閩南建築聚落。夜間體驗鄉村風情民宿。行程包括參觀金門國家公園,欣賞自然生態。', 3900.00),
(N'綠島海底溫泉之旅', N'體驗台灣獨特的海底溫泉。潛水探索綠島海域,欣賞繽紛珊瑚礁。夜間觀星,感受無光害星空之美。環島騎車,欣賞海岸風光。品嚐新鮮海鮮料理。行程包括參觀綠島人權文化園區,了解台灣民主發展歷程。', 4500.00),
(N'宜蘭慢活田園之旅', N'感受宜蘭的慢活氛圍。參與DIY體驗如蔥油餅製作、茶葉體驗。漫步羅東夜市,品嚐在地小吃。泡湯礁溪溫泉,放鬆身心。行程包括參觀蘭陽博物館,了解宜蘭在地文化與歷史。', 3200.00),
(N'南投清境農場之旅', N'體驗台灣的小瑞士。在清境農場與綿羊互動,欣賞壯闊山景。漫步合歡山,感受高山植物生態。品嚐高山特產如高麗菜、高山茶。夜間觀星,感受高海拔的璀璨星空。行程包括參訪青青草原,欣賞綿延山脈。', 3700.00),
(N'嘉義阿里山森林之旅', N'探索阿里山國家森林遊樂區。搭乘阿里山小火車,穿梭在雲霧繚繞的森林間。觀賞日出雲海,漫步在千年檜木群中。品嚐高山茶與山中料理。夜間觀星,感受森林的寧靜。行程包括參觀奮起湖老街,品嚐鐵路便當。', 4100.00),
(N'屏東墾丁海洋之旅', N'探索台灣最南端的海洋風光。在墾丁國家公園內浮潛,欣賞繽紛海底世界。衝浪體驗,感受海浪刺激。品嚐新鮮海鮮與當地特色料理。夜遊墾丁大街,感受熱鬧氛圍。行程包括參觀國立海洋生物博物館,了解海洋生態。', 3900.00),
(N'台南古都文化之旅', N'探訪充滿歷史韻味的台南。漫步安平老街,品嚐擔仔麵、蝦捲等台南小吃。參觀赤崁樓、孔廟等古蹟。夜遊花園夜市,感受在地夜生活。行程包括參觀奇美博物館,欣賞藝術收藏。', 2900.00),
(N'新竹科技城之旅', N'體驗台灣科技重鎮的魅力。參觀新竹科學園區探索館,了解台灣科技發展。品嚐新竹名產如貢丸、米粉。漫步十八尖山,欣賞城市風光。夜遊城隍廟夜市,感受在地美食文化。行程包括參觀玻璃工藝博物館,了解新竹玻璃產業。', 2400.00),
(N'苗栗客家文化之旅', N'探索台灣客家文化。參觀客家圓樓,了解傳統客家建築。體驗客家擂茶DIY,品嚐道地客家菜。漫步苗栗山城,感受客家山林文化。夜宿特色民宿,體驗客家生活。行程包括參觀苗栗陶瓷博物館,了解在地陶藝文化。', 2800.00),
(N'基隆港都美食之旅', N'探訪台灣北部重要港口城市。品嚐基隆廟口夜市美食如天婦羅、蚵仔煎。參觀和平島公園,欣賞奇特地質景觀。漫步基隆港,感受港都風情。行程包括搭乘觀光漁船,近距離觀賞基隆嶼風光。', 2300.00),
(N'基隆港都美食之旅', N'探訪台灣北部重要港口城市。品嚐基隆廟口夜市美食如天婦羅、蚵仔煎。參觀和平島公園,欣賞奇特地質景觀。漫步基隆港,感受港都風情。行程包括搭乘觀光漁船,近距離觀賞基隆嶼風光。', 2300.00),
(N'淡水紅毛城歷史之旅', N'探索淡水的豐富歷史。參觀紅毛城、牛津學堂等古蹟，了解西方文化影響。漫步老街，品嚐阿給、魚丸等特色小吃。搭乘渡輪遊淡水河，欣賞夕陽美景。行程包括參觀淡水漁人碼頭，感受現代與傳統的融合。', 2100.00),
(N'北投溫泉養生之旅', N'體驗台北最著名的溫泉區。泡湯於不同特色的溫泉浴池，放鬆身心。參觀北投溫泉博物館，了解溫泉文化歷史。漫步北投公園，感受日式風情。品嚐溫泉蛋等特色小吃。行程包括參訪梅庭，欣賞古典建築之美。', 2800.00),
(N'陽明山花季賞花之旅', N'春季時分，探訪陽明山國家公園的繽紛花海。漫步擎天崗，欣賞壯闊草原風光。參觀陽明書屋，了解蔣中正故居歷史。品嚐麻油雞等當地特色料理。夜晚泡湯天母溫泉，放鬆身心。行程包括健行七星山，欣賞台北盆地全景。', 2600.00),
(N'鹿港老街懷舊之旅', N'漫步於保存完善的清朝古蹟街道。參觀天后宮、龍山寺等歷史建築。品嚐蚵仔煎、鹿港魚丸等特色小吃。體驗傳統工藝如製香、木雕。夜宿百年老厝，感受古都氛圍。行程包括參觀玻璃媽祖廟，欣賞現代與傳統的結合。', 3100.00),
(N'東港大鵬灣遊艇之旅', N'體驗台灣最大的內灣湖泊。搭乘遊艇環繞大鵬灣，欣賞迷人水景。品嚐新鮮海鮮如黑鮪魚、櫻花蝦。參與水上活動如風帆、獨木舟。夜間欣賞海上華燈，感受浪漫氛圍。行程包括參觀東港漁港，了解漁業文化。', 3800.00),
(N'太平山森林芬多精之旅', N'深入宜蘭太平山國家森林遊樂區。搭乘見晴懷古步道小火車，穿梭在原始檜木林間。健行翠峰湖環山步道，欣賞雲霧繚繞的湖光山色。夜宿山中，感受森林浴洗滌身心。行程包括體驗森林療癒，深度放鬆。', 4100.00),
(N'馬祖藍眼淚之旅', N'探訪神秘的海上藍光。夜間出海觀賞藍眼淚奇景，彷彿置身夢幻世界。白天參觀馬祖列島的軍事坑道，了解戰地歷史。品嚐道地馬祖美食如魚麵、老酒。行程包括參觀北海坑道，體驗獨特的地下水路。', 5500.00),
(N'台東熱氣球嘉年華之旅', N'參與台灣最大的熱氣球盛會。乘坐熱氣球翱翔天際，俯瞰壯麗的花東縱谷。品嚐原住民特色料理。參觀臺東森林公園，享受自然生態。夜宿特色星空泡泡屋，欣賞璀璨星空。行程包括參訪卑南文化公園，了解史前文化。', 4800.00),
(N'金門戰地秘境之旅', N'探索昔日戰地前線的神秘面貌。參觀獅山砲陣地，了解冷戰時期的軍事部署。品嚐金門特產高梁酒、貢糖。漫步古厝聚落，感受閩南建築之美。夜間體驗坑道音樂會，聆聽動人旋律。行程包括參觀莒光樓，俯瞰金門全景。', 3700.00),
(N'蘭嶼達悟族文化之旅', N'深度體驗達悟族原住民文化。參與拼板舟製作，了解傳統造船技藝。品嚐飛魚風味餐，感受海洋飲食文化。夜宿達悟族特色家屋，感受與自然共處的生活方式。行程包括環島機車之旅，欣賞蘭嶼獨特地貌。', 5200.00),
(N'阿里山雲海日出之旅', N'體驗阿里山最著名的自然奇觀。搭乘阿里山小火車登上祝山觀日平台，欣賞雲海翻騰、日出東昇的壯麗景象。漫步在霧中森林，感受神木群的莊嚴氛圍。品嚐高山茶與山產料理。行程包括夜間生態觀察，探索森林夜晚的奧秘。', 4300.00),
(N'澎湖跳島之旅', N'探索澎湖群島的多樣風貌。搭乘快艇暢遊吉貝、望安、七美等離島，感受各島獨特魅力。參與水上活動如浮潛、香蕉船。品嚐道地海鮮料理。夜間欣賞澎湖花火節，感受璀璨奇幻的夜空。行程包括參觀二崁聚落，了解澎湖傳統建築。', 5000.00),
(N'花蓮太魯閣峽谷探險之旅', N'深入探索太魯閣國家公園的壯麗峽谷。健行錐麓古道，俯瞰立霧溪谷的雄偉景觀。參觀燕子口、九曲洞等知名景點。體驗太魯閣族文化，品嚐原住民風味餐。行程包括泛舟立霧溪，感受峽谷中的清涼刺激。', 3900.00),
(N'台中彩虹眷村文創之旅', N'探訪充滿創意的台中文化景點。參觀彩虹眷村，欣賞繽紛壁畫藝術。漫步審計新村，感受文青氛圍。品嚐道地小吃如珍珠奶茶、大甲芋頭。夜遊逢甲夜市，體驗熱鬧夜生活。行程包括參觀台中國家歌劇院，欣賞建築之美。', 2700.00),
(N'南投日月潭自行車之旅', N'騎乘自行車環繞日月潭，欣賞湖光山色。停靠向山眺望平台，飽覽全湖美景。參觀文武廟、玄奘寺等湖畔名勝。搭乘纜車登頂，俯瞰日月潭全景。品嚐邵族風味餐與紅茶。行程包括夜間螢火蟲生態之旅，感受大自然的神奇。', 3300.00),
(N'高雄港都藝術之旅', N'探索高雄的文化藝術面貌。參觀駁二藝術特區，感受創意氛圍。搭乘渡輪遊高雄港，欣賞港都風光。漫步衛武營國家藝術文化中心，欣賞世界級建築。夜遊六合夜市，品嚐道地小吃。行程包括參訪旗津，體驗懷舊渡輪之旅。', 2900.00),
(N'新北平溪天燈之旅', N'體驗放天燈的浪漫。在十分老街放飛天燈，許下美好願望。漫步平溪線鐵道，感受小鎮風情。參觀猴硐貓村，與可愛貓咪互動。品嚐礦工便當等在地特色美食。行程包括健行平溪大縱走，欣賞山林之美。', 2400.00),
(N'台南古都文化尋味之旅', N'深度探訪台灣最古老的城市。參觀赤崁樓、安平古堡等歷史古蹟。漫步神農街，品嚐擔仔麵、棺材板等特色小吃。夜遊河樂廣場，欣賞水景設計。體驗傳統漁村文化。行程包括參觀奇美博物館，欣賞藝術收藏。', 3000.00),
(N'宜蘭礁溪溫泉山水之旅', N'結合溫泉與自然美景的療癒之旅。泡湯於知名的礁溪溫泉，舒緩身心。漫步宜蘭河濱公園，欣賞蘭陽平原風光。參觀蘭陽博物館，了解宜蘭文化歷史。品嚐宜蘭特產如鴨賞、三星蔥。行程包括參訪香草菲菲芳香植物博物館，體驗芳療放鬆。', 3400.00),
(N'台東縱谷自行車之旅', N'騎乘自行車穿梭在花東縱谷的稻田與山林間。欣賞秀姑巒溪畔的優美風光，體驗台東慢活氛圍。參觀池上飯包文化故事館，了解在地飲食文化。品嚐名聞遐邇的池上便當。行程包括熱氣球體驗，從高空俯瞰縱谷之美。', 3600.00),
(N'淡水漁人碼頭夕陽之旅', N'體驗淡水最浪漫的時刻。漫步紅毛城及老街，感受歷史風情。搭乘遊船遊淡水河，欣賞兩岸風光。在漁人碼頭欣賞全台最美夕陽，感受浪漫氛圍。品嚐淡水小吃如阿給、魚丸。行程包括參觀滬尾砲台，了解清法戰爭歷史。', 2200.00),
(N'南投溪頭妖怪村之旅', N'深入探索溪頭自然教育園區，感受森林浴洗滌身心。漫步妖怪村，欣賞特色建築與裝飾。品嚐妖怪村特色餐點。夜間參與森林生態導覽，探索夜間生物。住宿森林木屋，感受與大自然共處的寧靜。行程包括大學池生態導覽。', 3800.00),
(N'新竹內灣懷舊之旅', N'搭乘內灣線小火車，欣賞沿途山林景致。漫步內灣老街，品嚐客家美食如粢粑、擂茶。參與傳統客家紙傘彩繪DIY。夜宿內灣吊橋旁特色民宿，聆聽溪水聲入眠。行程包括參觀劉興欽漫畫教育館，了解台灣漫畫發展史。', 2600.00),
(N'澎湖北海夜釣小管之旅', N'體驗澎湖特色夜間活動。搭乘漁船出海，親身體驗夜釣小管的樂趣。白天遊覽澎湖本島景點如中屯風車、跨海大橋。品嚐新鮮海鮮料理。參與水上活動如獨木舟、SUP。行程包括參觀澎湖海洋地質公園，了解當地特殊地貌。', 4200.00),
(N'台中高美濕地生態之旅', N'探索台中最著名的濕地生態系。參與專業導覽，了解濕地動植物生態。欣賞高美濕地日落美景，拍攝絕美倒影。品嚐清水在地小吃。夜遊逢甲夜市，體驗熱鬧氛圍。行程包括參觀台中市港區藝術中心，欣賞當代藝術展覽。', 2500.00),
(N'嘉義阿里山茶園體驗之旅', N'深入阿里山茶區，了解高山茶的生產過程。參與採茶、製茶體驗，親手製作屬於自己的茶葉。漫步茶園間，欣賞雲海美景。品嚐當地特色料理如奮起湖便當、愛玉。行程包括搭乘阿里山森林小火車，穿梭在雲霧繚繞的山林間。', 3900.00),
(N'金門戰地文化體驗之旅', N'深度探訪金門的軍事歷史。參觀古寧頭戰史館、八二三戰史館，了解兩岸關係發展。體驗軍事體能訓練，感受昔日軍旅生活。品嚐金門特產高梁酒、貢糖。夜間參與坑道音樂會，感受歷史與藝術的結合。行程包括騎自行車環島，欣賞金門自然風光。', 3700.00),
(N'屏東墾丁海底郵筒之旅', N'體驗全台最特別的郵筒。潛水至墾丁海底郵筒，寄出水下明信片。參與浮潛活動，欣賞繽紛海底世界。漫步墾丁大街，品嚐海鮮美食。夜間觀星，感受南國的璀璨星空。行程包括參觀國立海洋生物博物館，了解海洋生態。', 4100.00),
(N'宜蘭冬山河親水之旅', N'探索宜蘭最美的河岸風光。參與獨木舟或泛舟活動，親身體驗冬山河的優美。漫步冬山河親水公園，欣賞特色景觀設計。品嚐宜蘭在地小吃如蔥油餅、糕渣。夜宿河畔民宿，聆聽蛙鳴入眠。行程包括參訪仁山植物園，了解宜蘭特有植物生態。', 3200.00),
(N'台南鹽山奇景之旅', N'探訪台南獨特的鹽業文化。參觀七股鹽山，了解鹽業發展歷史。體驗手作鹽DIY，製作專屬鹽品。搭乘鹽田車，欣賞廣闊鹽田風光。品嚐鹽烤蝦等特色料理。行程包括黃金海岸生態之旅，觀察招潮蟹等濕地生物。', 2800.00),
(N'花蓮太魯閣峽谷溯溪之旅', N'挑戰太魯閣最刺激的戶外活動。在導師帶領下溯溪探索立霧溪支流，感受峽谷的雄偉。參觀太魯閣國家公園遊客中心，了解地質知識。品嚐原住民風味餐。夜宿太魯閣特色民宿，聆聽峽谷的夜晚聲音。行程包括清水斷崖健行，欣賞壯麗海岸線。', 4300.00),
(N'基隆外木山日出之旅', N'欣賞基隆最美的日出景點。清晨登上外木山觀景台，等待晨曦中的日出時刻。漫步外木山海灘，感受早晨的寧靜。品嚐基隆特色早餐如蛋餅、鐵板麵。參觀和平島公園，欣賞奇特海蝕地形。行程包括搭乘觀光漁船，近距離欣賞基隆嶼。', 2300.00),
(N'苗栗巧克力雲莊之旅', N'體驗苗栗獨特的巧克力文化。參觀巧克力雲莊，了解從可可豆到巧克力的製作過程。參與巧克力DIY課程，製作專屬巧克力。品嚐各式巧克力料理。漫步銅鑼杭菊花海，欣賞金黃花景。行程包括參訪薰衣草森林，感受浪漫歐風。', 3500.00),
(N'新北平溪線鐵道之旅', N'搭乘平溪線小火車，穿梭在山林間的復古鐵道。停靠十分老街，體驗放天燈祈福。漫步侯硐貓村，與可愛貓咪互動。品嚐礦工便當等在地特色美食。夜宿平溪特色民宿，感受山城寧靜。行程包括嶺腳瀑布健行，欣賞山水之美。', 2700.00),
(N'台東金針山金黃之旅', N'欣賞台東最壯觀的金針花海。搭乘接駁車登上六十石山，飽覽金黃花海與翠綠山林。品嚐金針花特色料理。漫步伯朗大道，感受縱谷的遼闊。夜宿山上露營區，欣賞星空。行程包括參訪布農部落，了解原住民文化。', 3600.00),
(N'高雄旗津海島之旅', N'體驗高雄的海島風情。搭乘渡輪前往旗津，感受懷舊氛圍。騎單車環島，欣賞海岸風光。參觀旗后砲台，了解清代海防歷史。品嚐海鮮粥、海鮮炒麵等特色美食。夜間參加旗津貝殼館，欣賞螢光貝殼。行程包括參與淨灘活動，為環保盡一份心力。', 2400.00),
(N'南投清境農場觀星之旅', N'體驗海拔最高的觀星地點。白天參觀清境農場，與綿羊互動。漫步合歡山，欣賞高山植物生態。晚上參加專業天文導覽，透過高倍望遠鏡觀星。品嚐高山特產如高麗菜、蘿蔔。行程包括參訪清境魯凱族部落，了解原住民文化。', 4000.00),
(N'澎湖七美雙心石滬之旅', N'探訪澎湖最浪漫的島嶼。搭船前往七美島，欣賞著名的雙心石滬。騎單車環島，感受悠閒氛圍。參與浮潛活動，欣賞美麗珊瑚礁。品嚐七美麵線、樹子排骨等特色美食。行程包括夜間螢火蟲生態導覽，感受島嶼的自然之美。', 4500.00),
(N'日月潭環湖遊', N'探索台灣最美麗的湖泊，體驗日月潭的自然之美。乘坐遊艇環湖，參觀文武廟，品嚐邵族風味餐。欣賞湖光山色，享受寧靜與美景的完美結合。全程專業導遊陪同，提供豐富的歷史文化解說。行程包括纜車體驗，俯瞰全湖美景。晚間可選擇參加原住民歌舞表演，深度了解當地文化。', 3500.00),
(N'阿里山日出之旅', N'體驗阿里山的神奇日出美景。搭乘小火車前往祝山觀日平台，等待晨曦中的雲海與日出。漫步在神木區，感受千年老樹的壯觀。品嚐阿里山特產高山茶，了解茶文化。午餐享用當地特色料理。下午參觀小笠原山觀景台，欣賞壯麗的山景。', 4200.00),
(N'墾丁陽光海灘度假', N'墾丁國家公園的陽光與海灘之旅。住宿豪華海景酒店，享受私人沙灘。活動包括浮潛、衝浪課程、香蕉船等水上活動。參觀鵝鑾鼻燈塔，欣賞台灣最南端的美景。晚間可選擇參加夜市美食之旅，品嚐當地特色小吃。行程靈活，充分自由時間享受陽光與海灘。', 5800.00),
(N'太魯閣峽谷探險', N'探索太魯閣國家公園的壯麗峽谷與自然奇觀。徒步燕子口步道，欣賞峭壁與湍急溪流。參觀長春祠，了解其傳奇故事。漫步砂卡礑步道，感受大自然的鬼斧神工。包含太魯閣晶英酒店住宿，享受豪華溫泉設施。專業嚮導全程陪同，確保安全並提供深度解說。', 6500.00),
(N'九份山城懷舊之旅', N'走進時光隧道，探索九份的懷舊魅力。漫步在古色古香的街道，品嚐特色小吃如芋圓、魚丸。參觀金瓜石礦業遺址，了解昔日採金歲月。欣賞基隆山日落美景，夜晚體驗九份獨特的燈光夜景。包含在地特色民宿住宿，感受純樸民風。導覽員帶您探索隱藏巷弄，發現九份秘密景點。', 2800.00),
(N'台北101高空體驗', N'登上台北101觀景台，俯瞰整個大台北地區。體驗全球最快速電梯，了解大樓防震科技。享用101高樓景觀餐廳精緻料理，品味米其林星級美食。參觀101購物中心，盡情享受購物樂趣。夜晚欣賞台北夜景，感受大都會的繁華魅力。', 2000.00),
(N'花蓮太魯閣峽谷探索', N'深入探索太魯閣國家公園的奇景。徒步九曲洞步道，欣賞峽谷地形。參觀白楊步道，感受森林的清新氣息。體驗太魯閣晶英酒店的豪華住宿與溫泉。包含秀林原住民文化體驗，了解當地傳統。行程靈活，可選擇騎自行車或泛舟活動。', 5500.00),
(N'澎湖藍色海洋之旅', N'探索澎湖群島的湛藍海洋。乘坐玻璃底船欣賞海底世界，參與浮潛或潛水活動。遊覽二崁聚落，了解澎湖傳統建築。品嚐道地海鮮料理，體驗澎湖特色美食。夜間可選擇參加海上煙火秀。包含豪華海景酒店住宿，享受寧靜island life。', 6800.00),
(N'高雄港都文化之旅', N'探索高雄的現代與傳統。參觀駁二藝術特區，感受藝術氛圍。搭乘愛河遊船，欣賞河岸風光。遊覽佛光山佛陀紀念館，了解佛教文化。晚上體驗六合夜市的美食之旅。包含高雄85大樓住宿，欣賞高空美景。', 3800.00),
(N'台南古都深度遊', N'深度探索台南的歷史文化。參觀赤崁樓、安平古堡等歷史景點。漫步神農街，品嚐道地小吃如擔仔麵、棺材板。體驗鹽田生態之旅，了解製鹽文化。晚上參加府中街文化導覽。包含台南老宅改建特色旅店住宿，感受古都魅力。', 4500.00),
(N'宜蘭溫泉美食之旅', N'享受宜蘭的溫泉與美食。泡湯於礁溪溫泉區，放鬆身心。參觀傳統藝術中心，了解台灣工藝文化。體驗DIY綠色博覽會，親手製作農產品。品嚐宜蘭特色料理如膽肝湯、鴨賞。包含五星級溫泉酒店住宿，享受頂級服務。', 5200.00),
(N'金門戰地風光遊', N'探索金門的軍事歷史與自然風光。參觀古寧頭戰史館，了解兩岸軍事歷史。遊覽金門國家公園，欣賞特有的海岸地形。品嚐金門高粱酒與特產貢糖。體驗戰地坑道探險，感受昔日軍事氛圍。包含金門特色民宿住宿，深入體驗當地生活。', 4800.00),
(N'阿里山森林鐵路之旅', N'搭乘阿里山森林小火車，穿梭在山林間。欣賞日出雲海，體驗高山茶園採茶樂趣。漫步在阿里山神木區，感受千年巨木的壯觀。品嚐阿里山高山野菜與山產。晚上參與星空觀測活動。包含阿里山高山度假村住宿，享受清新山林氣息。', 5500.00),
(N'台東山海縱谷遊', N'探索台東的自然美景。騎自行車遊覽池上伯朗大道，欣賞金色稻田。參觀卑南文化園區，了解史前文化。體驗熱氣球之旅，俯瞰縱谷美景。晚上泡湯於知本溫泉，放鬆身心。包含台東特色度假村住宿，享受純淨自然環境。', 4900.00),
(N'馬祖藍眼淚生態之旅', N'探索馬祖獨特的自然生態。夜觀藍眼淚奇景，體驗神秘自然現象。參觀馬祖酒廠，品嚐老酒文化。遊覽北海坑道，了解戰地風光。品嚐馬祖特色海鮮料理。包含馬祖特色民宿住宿，深入體驗島嶼生活。行程包括多個島嶼間的船程，欣賞馬祖群島風光。', 6200.00),
(N'綠島潛水探索之旅', N'體驗綠島的海洋生態。參與專業潛水課程，探索繽紛的珊瑚礁世界。夜間觀察綠蠵龜產卵。騎自行車環島，欣賞海岸風光。體驗綠島特有的海底溫泉。晚上參加星空觀測活動。包含綠島特色度假村住宿，享受寧靜的島嶼時光。', 5800.00),
(N'台中文化創意之旅', N'探索台中的藝術與文化。參觀台中國家歌劇院，欣賞建築之美。遊覽彩虹眷村，感受藝術創意。品嚐逢甲夜市美食，體驗在地小吃文化。參與東海大學藝術街區導覽，了解文創發展。包含台中特色設計旅店住宿，感受都市文創氛圍。', 3600.00),
(N'嘉義阿里山森林浴', N'深入阿里山森林，體驗森林浴療癒之旅。參與專業導覽，了解阿里山生態系統。體驗森林瑜伽與冥想課程，放鬆身心。品嚐阿里山特色茶點與有機料理。晚上參加生態夜觀活動，探索夜間森林生態。包含阿里山生態度假村住宿，沉浸在大自然懷抱中。', 5100.00),
(N'蘭嶼達悟文化探索', N'深入了解蘭嶼達悟族文化。參與拼板舟體驗，了解傳統造船技藝。參觀地下屋，探索達悟族傳統建築。品嚐飛魚料理，體驗在地飲食文化。參加夜間天文觀測，欣賞無光害星空。包含達悟族特色民宿住宿，深度體驗島嶼生活。', 5600.00),
(N'南投日月潭文化之旅', N'探索日月潭周邊的自然與人文風光。乘船環湖，欣賞湖光山色。參訪向山遊客中心，了解邵族文化。體驗製茶工藝，品嚐日月潭紅茶。漫步在金龍山步道，欣賞湖景。晚上參加水上燈會，感受浪漫氛圍。包含日月潭特色飯店住宿，享受湖畔寧靜。', 4700.00),
(N'台南古城一日遊', N'深入台南古城，探索赤崁樓、安平古堡、孔廟等歷史景點，感受台灣文化的發源地。全程專業導遊帶領，品味台南小吃與名產。', 1800.00),
(N'太魯閣峽谷徒步旅行', N'在太魯閣國家公園進行徒步旅行，探索峽谷的壯麗景觀與自然奇觀。專業登山教練指導，並提供全程交通與餐飲服務。', 3200.00),
(N'宜蘭溫泉泡湯', N'前往宜蘭享受天然溫泉，舒緩身心。體驗當地特色的日式風呂，並享受精緻的溫泉餐。全程提供專車接送。', 1500.00),
(N'屏東熱帶農場體驗', N'參觀屏東的熱帶農場，了解當地農業技術與生態環境。活動包括農產品採摘、動植物觀察與DIY手作體驗。', 2000.00),
(N'花蓮賞鯨之旅', N'在花蓮港出海賞鯨，觀賞壯麗的海洋生物，並由專業解說員講解海洋生態與保育知識。', 2500.00),
(N'高雄港口夜遊', N'乘船遊覽高雄港口，欣賞夜間燈光與海景，了解高雄作為台灣重要港口城市的歷史與發展。', 1800.00),
(N'苗栗客家文化村參訪', N'深入了解客家文化，參觀苗栗客家文化村，體驗傳統手工藝與客家美食。活動包括DIY手工製作與品嚐當地特色餐點。', 1600.00),
(N'新竹科學園區一日遊', N'參觀新竹科學園區，了解台灣科技產業的發展與創新。行程包括參觀科技館、科學實驗展覽以及參加互動工作坊。', 2000.00),
(N'台東知本溫泉放鬆之旅', N'前往台東知本溫泉區，享受天然溫泉與療癒身心的放鬆時光。全程提供溫泉湯池、精緻餐飲與專業服務。', 2800.00),
(N'蘭嶼文化探索', N'前往蘭嶼島，探索達悟族的文化與生活方式。行程包括傳統文化介紹、手工藝體驗與當地特色餐飲。', 4000.00),
(N'澎湖跳島探險', N'參加澎湖跳島之旅，探索當地的離島生態與自然奇觀。行程包括浮潛、獨木舟探險以及參觀當地漁村。', 3500.00),
(N'桃園夜市美食巡禮', N'漫遊桃園夜市，品嚐台灣各式各樣的夜市美食。活動包括小吃體驗、街頭表演觀賞以及夜市遊戲參與。', 1200.00),
(N'北投溫泉博物館參訪', N'探索北投溫泉博物館，了解台灣溫泉文化的歷史與發展。行程包括博物館導覽、溫泉泡湯與溫泉餐體驗。', 1800.00),
(N'基隆港歷史巡禮', N'參觀基隆港，了解台灣早期的貿易歷史與海上交通發展。行程包括港口導覽、博物館參觀以及基隆小吃體驗。', 1400.00),
(N'台北故宮博物院專業導覽', N'由專業導覽員帶領參觀台北故宮博物院，欣賞來自中華文明的珍貴文物。行程包括主題展覽解說與珍藏介紹。', 2200.00),
(N'新北石門水庫泛舟', N'參加石門水庫泛舟活動，享受水上運動的刺激與樂趣。全程提供專業教練指導與安全設備。', 2800.00),
(N'台中霧峰林家花園之旅', N'參觀台中霧峰林家花園，欣賞傳統庭園建築與文化。專業導遊講解台灣建築歷史與林家的影響力。', 1600.00),
(N'南投清境農場遊覽', N'前往南投清境農場，體驗高山牧場的美景與動物互動。行程包括牧場導覽、奶牛餵食以及品嚐當地乳製品。', 2300.00),
(N'彰化八卦山大佛巡禮', N'參觀彰化八卦山，拜訪大佛與當地廟宇，了解台灣佛教文化。行程包括寺廟參訪與當地文化介紹。', 1200.00),
(N'雲林西螺大橋歷史導覽', N'參觀雲林西螺大橋，了解這座橋樑的重要性與歷史背景。行程包括導覽解說與當地小吃品嚐。', 1000.00),
(N'南投竹山茶園體驗', N'參觀竹山茶園，了解台灣茶葉的生產與製作過程。行程包括採茶體驗、茶葉製作與品茶活動。', 1500.00),
(N'台南孔廟文化之旅', N'參觀台南孔廟，了解孔子文化與儒家思想的傳承。行程包括孔廟導覽、儒家文化講座與當地文化介紹。', 1600.00),
(N'金門戰地遺跡巡禮', N'探索金門島的戰地遺跡，了解台灣在國共內戰期間的歷史。行程包括防空洞、碉堡以及軍事博物館參觀。', 3000.00),
(N'台北松山文創園區導覽', N'參觀松山文創園區，了解台灣創意產業的發展。行程包括創意展覽參觀與文創市集體驗。', 1700.00),
(N'新北淡水老街遊覽', N'漫步淡水老街，感受台灣的歷史氛圍與文化。行程包括老街導覽、小吃品嚐以及紅毛城參觀。', 1300.00),
(N'高雄駁二藝術特區巡禮', N'參觀高雄駁二藝術特區，欣賞當地的藝術創作與展覽。行程包括街頭藝術觀賞、創意市集以及展覽館參觀。', 1800.00),
(N'桃園大溪老街文化之旅', N'探索桃園大溪老街，欣賞古色古香的建築風格與歷史。行程包括老街導覽與當地手工藝品體驗。', 1200.00),
(N'基隆和平島探險', N'參加基隆和平島的海岸探險，探索當地的自然生態與地質景觀。行程包括海岸線健行與潮間帶生態觀察。', 2000.00),
(N'台中歌劇院建築巡禮', N'參觀台中歌劇院，了解這座現代建築的設計理念與結構特點。行程包括專業導覽與劇院內部參觀。', 1900.00),
(N'花蓮玉里鄉田園漫步', N'體驗玉里鄉的田園風光，參加農業活動與田園漫步。行程包括農產品採摘與當地農村生活體驗。', 1400.00),
(N'台北士林夜市美食探索', N'探索士林夜市，品嚐當地各式美食小吃。活動包括導遊帶領的美食之旅與夜市遊戲體驗。', 1000.00),
(N'嘉義阿里山茶園之旅', N'參觀阿里山茶園，了解當地茶葉的種植與製作工藝。行程包括茶葉品鑒、茶園導覽與當地文化介紹。', 2200.00),
(N'宜蘭羅東夜市文化探索', N'探索羅東夜市，了解宜蘭的夜市文化與美食。行程包括美食導覽與當地特色產品購買體驗。', 1100.00),
(N'屏東墾丁國家公園探索', N'參觀墾丁國家公園，探索熱帶生態與自然奇觀。行程包括沙灘活動、森林步道與生態導覽。', 3000.00),
(N'南投水里蛇窯陶藝體驗', N'參觀南投水里的蛇窯，體驗傳統陶藝製作。活動包括DIY陶藝製作與陶瓷展覽參觀。', 1800.00),
(N'台東鹿野高台熱氣球體驗', N'參加台東鹿野高台的熱氣球活動，從高空俯瞰台東的美麗風光。活動包括專業飛行員操作與安全講解。', 3500.00),
(N'台北陽明山國家公園健行', N'在陽明山國家公園進行健行，探索火山地形與自然景觀。活動包括專業導遊帶領的步道行走與生態介紹。', 2100.00),
(N'苗栗三義木雕藝術村參訪', N'參觀三義的木雕藝術村，了解傳統木雕技藝與創作。活動包括木雕創作展示與手工藝品購買。', 1300.00),
(N'彰化鹿港古蹟文化巡禮', N'探索彰化鹿港的古蹟與文化，參觀傳統廟宇與古建築。行程包括導覽解說與當地文化介紹。', 1600.00),
(N'澎湖海上獨木舟探險', N'參加澎湖的海上獨木舟活動，探索海岸線與海洋生態。全程提供專業教練指導與安全設備。', 2800.00),
(N'基隆燈塔日落觀賞', N'前往基隆燈塔，欣賞壯麗的日落景觀。行程包括燈塔導覽與當地景點介紹。', 1000.00),
(N'台北大稻埕碼頭夜遊', N'參加大稻埕碼頭的夜遊，感受台北市區的夜景與河岸風光。行程包括遊船活動與現場音樂表演。', 1500.00),
(N'花蓮七星潭石頭沙灘漫步', N'在七星潭石頭沙灘漫步，享受寧靜的海岸風景。行程包括海岸健行與當地文化介紹。', 1300.00),
(N'新北烏來溫泉文化體驗', N'前往烏來，享受當地著名的溫泉與原住民文化體驗。行程包括溫泉泡湯、當地美食與文化講座。', 1800.00),
(N'桃園石門水庫自行車健行', N'參加石門水庫的自行車健行活動，欣賞周圍的自然風景與湖泊景觀。活動包括自行車租借與導覽服務。', 1200.00),
(N'高雄旗津老街文化巡禮', N'探索旗津老街的歷史與文化，參觀當地古蹟與老街美食。行程包括導覽解說與在地特色小吃體驗。', 1400.00);
```

:::

# Coravel 排程範例 for .NET 7 MVC Project

>https://docs.coravel.net/Invocables/


## 步驟1：安裝Coravel

首先，您需要在您的專案中安裝Coravel。您可以使用NuGet Package Manager或者執行以下命令：

```
dotnet add package Coravel
```

## 步驟2：設定Coravel

在您的`Program.cs`檔案中，您需要設定Coravel。在 DI Container 中，註冊以下代碼：

```csharp
builder.Services.AddScheduler();
builder.Services.AddTransient<CustomSchedulerService>();
```

在 Middleware 中，添加以下代碼：

```csharp
app.Services.UseScheduler(scheduler =>
{
    scheduler.Schedule<CustomSchedulerService>().EverySeconds(5);
});
```

## 步驟3：建立訂單更新任務

建立一個新的類別，例如`CustomSchedulerService`，並實現`IInvocable`介面。

```csharp
using Coravel.Invocable;

namespace WebApplication2.Services;

public class CustomSchedulerService : IInvocable
{
    public Task Invoke()
    {
        Console.WriteLine("CustomSchedulerService is running!");
        return Task.CompletedTask;
    }
}
```

請將`YourDbContext`替換為您的實際DbContext類別名稱。

## 步驟4：排程任務

在您的`Startup.cs`檔案的`Configure`方法中，設定您的任務排程。例如，如果您想要每天午夜執行這個任務，您可以添加以下代碼：

```csharp
app.Services.UseScheduler(scheduler =>
{
    scheduler.Schedule<CustomSchedulerService>().EverySecond();
});
```

### 步驟5：啟動您的應用程式

當您的應用程式啟動時，Coravel將會自動執行您設定的任務。在這個例子中，它將會每天午夜更新所有狀態為"pending"的訂單狀態為"invalid"。

這就是如何在ASP.NET Core MVC中使用 Coravel 來寫排程的範例。請根據您的實際需求調整代碼。

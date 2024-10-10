# Unit 10 - Create Data in Mongo DB

## Connecting to a MongoDB Database

### Install MongoDB Driver

```
dotnet add package MongoDB.Driver
```

```
 <PackageReference Include="MongoDB.Driver" Version="2.28.0" />
```

### Create a Connection

![](https://hackmd.io/_uploads/S1pbWrW3C.png)

### Access a Database using .NET MongoDB Driver

![截圖 2024-09-01 09.21.48](https://hackmd.io/_uploads/S1Y-frWhA.png)

### List all Databases

```csharp
using MongoDB.Driver;

var mongoUrl = new MongoUrl("mongodb+srv://<username>:<password>@mvcsample.rl3fd.mongodb.net/?retryWrites=true&w=majority&appName=MvcSample");
var client = new MongoClient(mongoUrl);
var dbList = client.ListDatabases().ToList();

foreach (var db in dbList)
{
    Console.WriteLine(db);
}

```

```text
{ "name" : "blog", "sizeOnDisk" : NumberLong(16384), "empty" : false }
{ "name" : "demo", "sizeOnDisk" : NumberLong(155648), "empty" : false }
{ "name" : "sample_airbnb", "sizeOnDisk" : NumberLong(55263232), "empty" : false }
{ "name" : "sample_analytics", "sizeOnDisk" : NumberLong(9408512), "empty" : false }
{ "name" : "sample_geospatial", "sizeOnDisk" : NumberLong(1343488), "empty" : false }
{ "name" : "sample_guides", "sizeOnDisk" : NumberLong(40960), "empty" : false }
{ "name" : "sample_mflix", "sizeOnDisk" : NumberLong(118382592), "empty" : false }
{ "name" : "sample_restaurants", "sizeOnDisk" : NumberLong(6803456), "empty" : false }
{ "name" : "sample_supplies", "sizeOnDisk" : NumberLong(1097728), "empty" : false }
{ "name" : "sample_training", "sizeOnDisk" : NumberLong(53182464), "empty" : false }
{ "name" : "sample_weatherdata", "sizeOnDisk" : NumberLong(2740224), "empty" : false }
{ "name" : "admin", "sizeOnDisk" : NumberLong(303104), "empty" : false }
{ "name" : "local", "sizeOnDisk" : NumberLong("22608318464"), "empty" : false }
```

### MongoClient

- An Application should use a single MongoClient instance to reused across all database requests
- Creating MongoClient is resource-intensive, so it is recommended to create a single instance and reuse it

## Insert Documents into MongoDB collection

- InsertOne
- InsertMany

> If the collection does not exist, MongoDB will create it when you insert the first document

### InsertOne: by mongo shell

```text
db.accounts.insertOne({
  "account_id": 111333,
  "limit": 12000,
  "products": [
    "Commodity",
    "Brokerage"
    ],
  "last_updated": new Date()
});
```

![](https://hackmd.io/_uploads/Sy_0pHbhR.png)

### InsertMany: by mongo shell

```text
db.accounts.insertMany([
  {
    "account_id": 111333,
    "limit": 12000,
    "products": [
    "Commodity",
    "Brokerage"
    ],
    "last_updated": new Date()
  },
  {
    "account_id": 678943,
    "limit": 8000,
    "products": [
    "CurrencyService",
    "Brokerage",
    "InvestmentStock"
    ],
    "last_updated": new Date()
  },
  {
    "account_id": 321654,
    "limit": 10000,
    "products": [
    "Commodity",
    "CurrencyService"
    ],
    "last_updated": new Date()
  }
]);
```

![](https://hackmd.io/_uploads/rJiPRB-hC.png)

# Unit 09 - Connection Strings in MongoDB

![](https://hackmd.io/_uploads/H1Ntk2FiR.png)  
![](https://hackmd.io/_uploads/S1Qge3KsC.png)

### How to connect

- shell
- compass
- application

### Format

1. Standard format: connect to standalone cluster, replica set, or sharded cluster
2. DNS Seed List Connection Format: provide a DNS server list to connect to a replica set or sharded cluster
  - ability to change servers in rotation without reconfiguring client

### Standard Format

- prefix: `mongodb+srv://`
- credential: `username:password@`
- host: `hostname:port`
- options: `?retryWrites=true&w=majority&appName=MvcSample`

### Common Errors

- user network access error => add IP address to whitelist
- connection string error => check connection string format

## Connecting with MongoDB Driver using .NET Core MVC

- https://www.mongodb.com/docs/drivers/csharp/current/

### Install MongoDB Driver

```  
dotnet add package MongoDB.Driver  
```  

```  
 <PackageReference Include="MongoDB.Driver" Version="2.28.0" />
```  
  
### Ping MongoDB Atlas Cluster  
  
```csharp  
  
using MongoDB.Driver;  
using MongoDB.Bson;  
  
const string connectionUri = "mongodb+srv://<username>:<password>@mvcsample.rl3fd.mongodb.net/?retryWrites=true&w=majority&appName=MvcSample";  
  
var settings = MongoClientSettings.FromConnectionString(connectionUri);  
  
// Set the ServerApi field of the settings object to set the version of the Stable API on the client  
settings.ServerApi = new ServerApi(ServerApiVersion.V1);  
  
// Create a new client and connect to the server  
var client = new MongoClient(settings);  
  
// Send a ping to confirm a successful connection  
try {  
  var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));  Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");} catch (Exception ex) {  
  Console.WriteLine(ex);
}  
```

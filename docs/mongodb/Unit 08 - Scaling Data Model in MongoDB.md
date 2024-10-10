# Unit 08 - Scaling Data Model in MongoDB

### Optimum Efficiency

- query result time
- memory usage
- cpu usage
- storage

### Unbounded Growth

- unbounded documents are documents that grow indefinitely

```
{
  "title": "Basics of MongoDB",
    "url": "https://www.mongodbbasics.com",
    "text": "Let’s learn the basics of MongoDB!",
    "comments": [
      {
        "name": "John Smith",
        "created_on": ISODate("2022-07-21T11:00:00Z"),
        "comment": "I learned a lot!"
      },
      {
        "name": "Jane Doe",
        "created_on": ISODate("2022-07-22T11:00:00Z"),
        "comment": "Looks great!"
      }
    ]
}
```

> As the number of comments grows, the document size will increase, which can impact read and write performance.  
> For this case, use referencing to store comments in a separate collection.

```
{
  "blog_entry_id": 1,
  "name": "John Smith",
  "created_on": ISODate("2022-07-21T11:00:00Z"),
  "comment": "I learned a lot!"
}
```

### Avoid

- the maximum document size limit of 16MB
- poor query performance
- poor write performance
- high memory usage

## Using Altas Tools for Schema Analysis

> Schema design patterns are guidelines for modeling data in MongoDB

### 常見的模式反模式

- 巨型數組 (Massive arrays): 使用過大的數組可能導致性能下降和操作複雜性增加。
- 大量集合 (Massive number of collections): 過多的集合可能會使數據管理變得困難，並影響查詢性能。
- 臃腫文檔 (Bloated documents): 文檔過大會導致存取速度變慢，並增加存儲需求。
- 不必要的索引 (Unnecessary indexes): 多餘的索引會佔用額外空間並影響寫入性能。
- 沒有索引的查詢 (Queries without indexes): 缺乏索引的查詢會使得資料檢索變得緩慢。
- 一起訪問的資料，但存儲在不同集合 (Data that’s accessed together, but stored in different collections):  
  常常需要一起存取的數據卻分散在不同集合中，會增加查詢的複雜度。

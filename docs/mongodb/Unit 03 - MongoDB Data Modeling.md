# Unit 03 - MongoDB Data Modeling

> Difference from relational database model and the document model

### How to model Data in MongoDB for your application

- What are the requirements of your application?
- What data will you be storing?
- How will users access the data?
- What data will be most valuable to your users?
- What are the relationships between the data?

### A good data model should

- easier to manage data
- make queries more efficient
- use less memory and cpu

### In MongoDB

- data that is accessed together should be stored together
- embedded documents enables us to build complex relationships between data
- normalization data by using database references
- store, query, and use resources efficiently

### 在MongoDB與關係型數據庫的差異：

| 特性   | MongoDB (NoSQL)    | 關聯式資料庫 (RDBMS)    |  
|------|--------------------|-------------------|  
| 資料模型 | 文件、集合和字段；可嵌套資料     | 表、行和列；規範化資料       |  
| 模式   | 靈活，無固定模式           | 固定模式，需要預先定義       |  
| 可擴展性 | 設計用於橫向擴展（分片）       | 主要縱向擴展，橫向擴展較複雜    |  
| 交易   | 支援ACID，通常限於單文件或單集合 | 完全支援ACID，可跨多表     |  
| 查詢語言 | 類JSON語法，特定於MongoDB | SQL，較為標準化         |  
| 資料關係 | 通過嵌入文件或引用實現        | 通過外鍵和連接實現         |  
| 一致性  | 通常優化為最終一致性         | 強一致性              |  
| 適用場景 | 非結構化數據、高擴展性需求、快速開發 | 結構化數據、複雜關係、強一致性需求 |  
| 索引   | 支持多種類型索引           | 支持多種類型索引          |  
| 模式變更 | 靈活，易於適應變化          | 通常需要複雜的遷移過程       |  

這個表格概括了MongoDB（作為NoSQL資料庫的代表）和關聯式資料庫之間的主要差異。每種類型的資料庫都有其優勢和適用場景，選擇哪一種取決於具體的應用需求。

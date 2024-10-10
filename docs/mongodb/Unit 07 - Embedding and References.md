# Unit 07 - Embedding and References

## Embedding

- Embedding is used for one-to-one and one-to-many relationships
- Stored related data in a single document

### Pros

- Simplifies queries and updates
- Increases read performance
- Avoids the need for joins
- Allows developers to update related data in a single write operation

### Cons

- Embedding data into a single document can create large documents
- Large documents can impact read and write performance
- Continuously updating embedded data can lead to document growth
- Unbounded documents may exceed the BSON document size limit of 16MB

```json  
{  
  "name": {  
    "firstName": "Sarah",  
    "lastName": "Davis"  
  },  "job": "professor",  
  "address": {
    "mailingAddress": {  
      "street": "402 Maple",  
      "city": "Chicago",  
      "zipcode": "81442"  
    },
    "secondaryAddress": {  
      "street": "318 University Blvd",  
      "city": "Chicago",  
      "zipcode": "81445"  
    },
    "emergencyAddress": {  
      "name": "Kerri Davis",  
      "street": "42 Wallaby Way",  
      "city": "Sydney",  
      "zipcode": "78 AU290",  
      "country": "Australia"  
    }
  }
}
```  

## Referencing

- Save the _id field of one document in another document as a link between them
- Using reference is called linking, data normalization

### Pros

- No duplication of data
- Smaller documents

### Cons

- querying from multiple documents costs extra resources and impacts read performance

```  
{  
  "student": "John Smith",
  "student_id": "001",
  "age": "18",
  "email": "johnsmith@mongodb.edu",
  "grade_level": "freshman",
  "gpa": "4.0",
  "street": "3771 McClintock Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zip": "90089",
  "emergency_contact_name": "Mary Smith",
  "emergency_contact_relation": "Mother",
  "courses": [
    {
      "course_id": "CS150",
      "course_name": "MongoDB101"
    },
    {
      "course_id": "CS177",
      "course_name": "Introduction to Programming in Python"
    }
  ]
}  
```  

## Comparison of Embedding and Referencing

| 特性          | 嵌入 (Embedding)         | 引用 (Referencing)      |  
|-------------|------------------------|-----------------------|  
| 單一查詢獲取資料    | ✅ 單一查詢獲取所有需要的數據        | ✅ 數據不會重複儲存            |  
| 單一操作更新/刪除資料 | ✅ 更新或刪除資料時，只需操作一個文檔    | ✅ 文檔大小相對較小            |  
| 數據重複        | ❗️ 可能會造成資料的重複儲存，增加數據冗餘 | ❗️ 獲取完整資料時，需從多個文檔聯結數據 |  
| 文檔大小        | ❗️ 可能會導致文檔體積變大         |                       |  

### 總結

選擇嵌入或引用依賴於具體場景的需求，考量數據的一致性、結構複雜性及性能需求。

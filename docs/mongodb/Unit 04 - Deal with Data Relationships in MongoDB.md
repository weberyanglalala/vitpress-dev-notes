# Unit 04 - Deal with Data Relationships in MongoDB

> Data that is accessed together should be stored together  
> Structure data to match the way your application queries and updates data

### Types of Relationships

```text  
{  
  "_id": ObjectId("5f8a7b2b9d3e2a1b3c4d5e6f"),
  "title": "Star Wars: A New Hope",  
  "director": "George Lucas",
  "releaseYear": 1977,
  "casts": [
    {
      "actor": "Mark Hamill",
      "character": "Luke Skywalker"
    },
    {
      "actor": "Harrison Ford",
      "character": "Han Solo"
    }
  ]
}  
```  

#### 1 - 1

- title to director

#### 1 - N

- title to casts

#### N - N

### Ways to Model Relationships in MongoDB

#### Embedding: take related data and store it in a single document

```
{  
  "_id": ObjectId("573a1390f29313caabcd413b"),
  "title": "Star Wars: Episode IV - A New Hope",
  "cast": [
    {"actor": "Mark Hamill", "character": "Luke Skywalker"},
    {"actor": "Harrison Ford", "character": "Han Solo"},
    {"actor": "Carrie Fisher", "character": "Princess Leia Organa"}
  ]
}
```  

#### Referencing: refer to documents in another collection

```  
{  
  "_id": ObjectId("573a1390f29313caabcd413b"),
  "title": "Star Wars: Episode IV - A New Hope",
  "director": "George Lucas",
  "runtime": 121,
  "filming_locations": [
    ObjectId("654a1420f29313fgbcd718"),
    ObjectId("654a1420f29313fgbcd719")
  ]
}  
```  

### Summary

- Data that is accessed together should be stored together
- Modeling 1 - 1, 1 - N, and N - N relationships is easy in MongoDB
- Two primary ways to model relationships in MongoDB: embedding and referencing

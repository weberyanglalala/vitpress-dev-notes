# Unit 12 - Replacing Document in Mongo DB

# Replace Document in Mongo DB
- To replace a document in MongoDB, you can use the `replace_one()` method. The `replace_one()` method replaces the first occurrence of a document that matches the specified filter.

- The replaceOne() method takes the following parameters:

  1. filter: A query that matches the document to replace.
  2. replacement: The new document to replace the old one with.
  3. options: An object that specifies options for the update.

```js
db.collection.replace_one(filter, replacement, options)
```

## Example

```
{
  "_id": "62c5e671541e2c6bcb528308",
  "title": "Deep Dive into React Hooks",
  "ISBN": "00000000",
  "thumbnailUrl": "",
  "publicationDate": ISODate("2019-01-01T00:00:00.000Z"),
  "authors": ["Ada Lovelace"]
}
```

> Replace by its `_id` field

```js
db.books.replace_one(
  { _id: ObjectId("62c5e671541e2c6bcb528308") },
  {
    "title": "Deep Dive into React Hooks",
    "ISBN": "0-1224-6789-1",
    "thumbnailUrl": "https://example.com",
    "publicationDate": ISODate("2024-10-04T00:00:00.000Z"),
    "authors": ["Ada Lovelace", "John Doe"]
  }
)
```

```
{
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1,
    upsertedCount: 0,
    insertedId: null
}
```

### Sample

1. Find the document with a common_name of Northern Cardinal and take note of the _id field.

```
db.birds.find({ common_name: "Northern Cardinal" })
```

2. update the document with the _id field you found in the previous step.

```js
{
  "common_name": "Morning Dove",
  "scientific_name": "Zenaida macroura",
  "wingspan_cm": 37.23,
  "habitat": ["urban areas", "farms", "grassland"],
  "diet": ["seeds"],
}
```

```
db.birds.replaceOne(
  { _id: ObjectId("6286809e2f3fa87b7d86dccd") },
  {
    "common_name": "Morning Dove",
    "scientific_name": "Zenaida macroura",
    "wingspan_cm": 37.23,
    "habitat": ["urban areas", "farms", "grassland"],
    "diet": ["seeds"],
  }
)
```

## UpdateOne()

```
db.collection.updateOne(
    <filter>,
    <update>,
    <options>
)
```

## Update Operators
- `$set`: add new fields to the document or replace the value of an existing field.
- `$push`: append a value to an array or adds the array field if it doesn't exist.

### Sample

```
{
  _id: ObjectId("6261a92dfee1ff300dc80bf1"),
  title: "The MongoDB Podcast",
  platforms: [ "Apple Podcasts", "Spotify" ],
  year: 2022,
  hosts: [],
  premium_subs: 4152,
  downloads: 2,
  podcast_type: "audio"
}
```

> add new subscribers count field

```js
db.podcasts.updateOne(
  { _id: ObjectId("6261a92dfee1ff300dc80bf1") },
  { $set: { subscribers: 4152 } }
)
```

```
{
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1,
    upsertedId: null
}
```

> add a new host to the hosts array

```js
db.podcasts.updateOne(
  { _id: ObjectId("6261a92dfee1ff300dc80bf1") },
  { $push: { hosts: "John Doe" } }
)
```

```
{
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1,
    upsertedId: null
}
```

## upsert

> insert a document if it doesn't exist

```js
db.podcasts.updateOne(
  { title: "The MongoDB Podcast" },
  { $set: { subscribers: 4152 } },
  { upsert: true }
)
```

```
{
    acknowledged: true,
    matchedCount: 0,
    modifiedCount: 0,
    upsertedId: ObjectId("6286809e2f3fa87b7d86dccd")
}
```

### Sample

> Run a findOne() query for a document with a common_name of Canada Goose and examine its contents

```js
db.birds.findOne({"common_name": "Canada Goose"});
```

> Update the document by adding a new field titled tags and set it to an array containing the following strings: geese, herbivore, and migration using the appropriate MongoDB update operator.

```js
db.birds.updateOne(
  { _id: ObjectId("6268413c613e55b82d7065d2") },
  { $set: { tags: ["geese", "herbivore", "migration"] } }
);
```

## UpdateOne() and then findOne()

- in the approach, you first run an updateOne() query to update the document and then run a findOne() query to verify the changes.
- maked two round trips to the database.
- another user could have updated the document between the two queries and returned incorrect results.



## Using findAndModify()
- The findAndModify() method is a single atomic operation that updates a document and returns the updated document.

```js
db.podcasts.findAndModify({
  query: { _id: ObjectId("6261a92dfee1ff300dc80bf1") },
  update: { $set: { subscribers: 4152 } },
  new: true
})
```

- set the `new` option to `true` to return the updated document.

```
{
    _id: ObjectId("6261a92dfee1ff300dc80bf1"),
    title: "The MongoDB Podcast",
    platforms: [ "Apple Podcasts", "Spotify" ],
    year: 2022,
    hosts: [],
    premium_subs: 4152,
    downloads: 2,
    podcast_type: "audio",
    subscribers: 4152
}
```

### Sample

> Given a common_name for a bird, write a query that will find the document and modify the sightings_count field by incrementing it by 1.

> Common Name: Blue Jay
> Increment the sightings_count field by 1
> Return the updated document

```js
db.birds.findAndModify({
  query: { common_name: "Blue Jay" },
  update: { $inc: { sightings_count: 1 } },
  new: true
})
```

## updateMany()
> arguments: filter document, update document, options object

- not an all-or-nothing operation
- will not roll back the entire operation if one of the updates fails.
- not an atomic operation

```js
db.books.updateMany(
  { publishedDate: { $lt: new Date("2019-01-01") } },
  { $set: { status: "LEGACY" } }
)
```

```
{
    acknowledged: true,
    matchedCount: 3,
    modifiedCount: 3,
    upsertedId: null
}
```

### Sample
> Update the last_seen date to 2022-01-01 for Blue Jay and Grackle in the birds collection.

```js
db.birds.updateMany(
  { common_name: { $in: ["Blue Jay", "Grackle"] } },
  { $set: { last_seen: ISODate("2022-01-01") } },
  { new: true }
)
```

## deleteOne()

> find()
> deleteOne()

```js
db.books.deleteOne({ status: "LEGACY" })
```

```
{
    acknowledged: true,
    deletedCount: 1
}
```

### Sample

```js
db.birds.deleteOne({ _id: ObjectId("62cddf53c1d62bc45439bebf") });
```



## deleteMany()

```js
db.books.deleteMany({ status: "LEGACY" })
```

```
{
    acknowledged: true,
    deletedCount: 3
}
```

### Sample

```js
db.birds.deleteMany({ sightings_count: { $lt: 10 } });
```

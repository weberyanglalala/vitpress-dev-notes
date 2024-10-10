# Unit 11 - Find Documents in MongoDB Collection

### command

- find
- it

### operators

- $in: select all documents that have a field equal to any value in the specified array
- $eq
- $lt: less than
- $gt: greater than
- $lte: less than or equal to
- $gte: greater than or equal to

### Find: by mongo shell

```text
db.zips.find();
```

- use `it` to display the next batch of documents

```text
it
```

### Find with Query: by mongo shell

```text
db.zips.find({ "state": "NY" });
```

```text
db.sales.find({ "_id": ObjectId("5bd761dcae323e45a93ccff4") });
```

### Find with Query and `$in` Operator: by mongo shell

```text
db.zips.find({ "state": { $in: ["NY", "CA"] } });
```

```text
db.sales.find({ storeLocation: { $in: ["London", "New York"] } });
```

### Find documents by using comparison operators

> find by nested property with dot notation

![](https://hackmd.io/_uploads/H1wNX8W2R.png)

```text
{
    "_id": ObjectId("62d18e6ee46fce3f14998fcb"),
    "items": [
        {
            "name": "envelopes",
            "tags": ["stationary", "office", "general"],
            "price": Decimal128("22.9"),
            "quantity": 3
        }
    ],
    "customer": {
        "gender": "M",
        "age": 58,
        "email": "jalpo@ha.mq",
        "satisfaction": 5
    }
}
```

```text
db.sales.find({ "items.price" : { $gt : 50 }});
```

### Query Array Elements in MongoDB

```js
db.accounts.find({
    products: "Commodity"
});
```

> this query will return all documents where the products array contains the value "Commodity" and only the value "
> Commodity"

![](https://hackmd.io/_uploads/HykJQzTCC.png)

#### `$elemMatch`

- Use the $elemMatch operator to find all documents that contain the specified sub document.

> Querying Subdocuments

```js
db.accounts.find({
    products: {
        $elemMatch: {
            $eq: "Commodity"
        }
    }
});
```

```js
db.sales.find({
    items: {
        $elemMatch: {name: "laptop", price: {$gt: 800}, quantity: {$gte: 1}},
    },
})
```

```
{
  "<field>": {
    $elemMatch: {
      <query1>,
      <query2>,
      ...
    }
  }
}
```

#### Sample

```json
{
  "_id": 1,
  "name": "John",
  "scores": [
    {
      "subject": "math",
      "score": 90
    },
    {
      "subject": "english",
      "score": 85
    },
    {
      "subject": "history",
      "score": 80
    }
  ]
}
```

```js
db.students.find({
    scores: {
        $elemMatch: {score: {$gte: 80, $lte: 90}}
    }
})
```

### Finding Documents by Using Logical Operators

- `$and`, `$or`, `$not`, `$nor`

```
{
  "name": "Alice",
  "age": 25,
  "city": "New York",
  "job": "Engineer"
}
```

```js
db.collection.find({
    $and: [
        {age: {$gt: 20}},
        {city: "New York"}
    ]
})
```

```js
db.collection.find({
    $or: [
        {age: {$gt: 30}},
        {city: "Los Angeles"}
    ]
})
```

> when including the same operator more than once in your query, you need to use the explicit $and operator

```js
db.collection.find({
    $and: [
        {age: {$gt: 25}},
        {
            $or: [
                {city: "Chicago"},
                {job: "Teacher"}
            ]
        }
    ]
})
```

#### Sample

```
{
  _id: ObjectId('5bd761dcae323e45a93ccfe8'),
  saleDate: ISODate('2015-03-23T21:06:49.506Z'),
  items: [
    {
      name: 'printer paper',
      tags: [ 'office', 'stationary' ],
      price: Decimal128('40.01'),
      quantity: 2
    },
    {
      name: 'notepad',
      tags: [ 'office', 'writing', 'school' ],
      price: Decimal128('35.29'),
      quantity: 2
    },
    {
      name: 'pens',
      tags: [ 'writing', 'office', 'school', 'stationary' ],
      price: Decimal128('56.12'),
      quantity: 5
    },
    {
      name: 'backpack',
      tags: [ 'school', 'travel', 'kids' ],
      price: Decimal128('77.71'),
      quantity: 2
    },
    {
      name: 'notepad',
      tags: [ 'office', 'writing', 'school' ],
      price: Decimal128('18.47'),
      quantity: 2
    },
    {
      name: 'envelopes',
      tags: [ 'stationary', 'office', 'general' ],
      price: Decimal128('19.95'),
      quantity: 8
    },
    {
      name: 'envelopes',
      tags: [ 'stationary', 'office', 'general' ],
      price: Decimal128('8.08'),
      quantity: 3
    },
    {
      name: 'binder',
      tags: [ 'school', 'general', 'organization' ],
      price: Decimal128('14.16'),
      quantity: 3
    }
  ],
  storeLocation: 'Denver',
  customer: { gender: 'M', age: 42, email: 'cauho@witwuta.sv', satisfaction: 4 },
  couponUsed: true,
  purchaseMethod: 'Online'
}
```

> Find every document in the sales collection that meets the following criteria:

- Purchased online
- Used a coupon
- Purchased by a customer 25 years old or younger

```
db.sales.find({
  $and: [
    { purchaseMethod: "Online" },
    { couponUsed: true },
    { "customer.age": { $lte: 25 } }
  ]
})
```

> Return every document in the sales collection that meets one of the following criteria:

- Item with the name of pens
- Item with a writing tag

```js
db.sales.find({
  $or: [{ "items.name": "pens" }, { "items.tags": "writing" }],
})
```

```js
db.sales.find({
  items: {
    $elemMatch: {
      $or: [{ name: "pens" }, { tags: "writing" }]
    }
  }
})
```

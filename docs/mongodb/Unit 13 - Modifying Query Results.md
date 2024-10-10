# Unit 13 - Modifying Query Results

# Modifying Query Results

## Sorting and Limiting Query Results in MongoDB
> cursor is the pointer to the result set of a query.
> the `find()` method returns a cursor.

## cursor methods
> chained the queries, perform actions on the result set.

> `cursor.sort()` method is used to sort the result in ascending or descending order.

```js
db.collection.find(<query>).sort(<sort>);
```

> `cursor.limit()` method is used to limit the number of documents returned by a query.

```js
db.companies.find(<query>).limit(<number>);
```


### Sample
> find compainies that category is music and sort by name in ascending order

```js
db.companies
    .find({ category_code: "music" })
    .sort({ name: 1 });
```

> `1` for ascending order, `-1` for descending order.

## Limiting the Number of Documents Returned

> limit the number of documents returned by a query will improve the performance of the query.

```js
db.companies
    .find({ category_code: "music" }, { name: 1, number_of_employees: 1 })
    .sort({ number_of_employees: -1 })
    .limit(3);
```

### Sample

```js
db.sales
.find({ "items.name": { $in: ["laptop", "backpack", "printer paper"] }, "storeLocation": "London", })
.sort({ saleDate: -1, })
.limit(3)
```

## Return Specific Fields(DTO) in Query Results




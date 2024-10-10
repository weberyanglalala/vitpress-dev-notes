# Unit 02 - Overview of MongoDB and the Document Model

- General Purpose Document Database
- Mongo DB Save Data As Flexible JSON-like Documents

### Document

- Easier to plan how application data will be stored in MongoDB
- Document is like instance of a class in OOP
- The basic unit of data in MongoDB
- Display like JSON, but stored in BSON (Binary JSON)

#### Structure of a Document

- The values in a document can be any data type, including strings, objects, arrays, booleans, nulls, dates, ObjectIds,
  and more.
- ObjectId is a datatype that creates uniquely identifiers for the required _id field
- _id field is a unique identifier for the document and is not a datatype

```bson
{
  "_id": ObjectId("5f8a7b2b9d3e2a1b3c4d5e6f"),
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "hashed_password_here",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+886912345678",
  "address": {
    "street": "123 Main St",
    "city": "Taipei",
    "state": "Taiwan",
    "zipCode": "106"
  },
  "membershipLevel": "gold",
  "registrationDate": ISODate("2023-04-15T08:30:00Z"),
  "lastLogin": ISODate("2024-08-12T14:45:00Z"),
  "orderHistory": [
    {
      "orderId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e70"),
      "date": ISODate("2024-07-20T10:15:00Z"),
      "totalAmount": 1500.00,
      "status": "delivered"
    }
  ],
  "wishlist": [
    ObjectId("5f8a7b2b9d3e2a1b3c4d5e71"),
    ObjectId("5f8a7b2b9d3e2a1b3c4d5e72")
  ],
  "preferences": {
    "newsletter": true,
    "smsNotifications": false
  }
}
```

```
{
  "_id": ObjectId("5f8a7b2b9d3e2a1b3c4d5e70"),
  "userId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e6f"),
  "orderNumber": "ORD-20240720-001",
  "orderDate": ISODate("2024-07-20T10:15:00Z"),
  "status": "delivered",
  "totalAmount": 1500.00,
  "items": [
    {
      "productId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e73"),
      "productName": "高效能筆記型電腦",
      "quantity": 1,
      "price": 1200.00
    },
    {
      "productId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e74"),
      "productName": "無線滑鼠",
      "quantity": 2,
      "price": 150.00
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Taipei",
    "state": "Taiwan",
    "zipCode": "106"
  },
  "paymentMethod": "信用卡",
  "paymentDetails": {
    "cardType": "Visa",
    "last4Digits": "1234"
  },
  "shippingMethod": "標準配送",
  "shippingCost": 50.00,
  "discounts": [
    {
      "code": "SUMMER10",
      "amount": 50.00
    }
  ],
  "notes": "請在大門口放置包裹"
}
```

```
{
  "_id": ObjectId("5f8a7b2b9d3e2a1b3c4d5e75"),
  "userId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e6f"),
  "items": [
    {
      "productId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e71"),
      "productName": "智能手錶",
      "price": 299.99,
      "dateAdded": ISODate("2024-08-01T09:30:00Z")
    },
    {
      "productId": ObjectId("5f8a7b2b9d3e2a1b3c4d5e72"),
      "productName": "無線耳機",
      "price": 159.99,
      "dateAdded": ISODate("2024-08-05T14:20:00Z")
    }
  ],
  "lastUpdated": ISODate("2024-08-05T14:20:00Z"),
  "notificationSettings": {
    "priceDropAlert": true,
    "backInStockAlert": true
  }
}
```

### Collections

- A grouping of MongoDB documents
- The documents in a collection can have different structures and fields

### Database

- A container for collections

# Banco de dados

Esquema do banco de dados não relacional:

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "users",
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string" },
        name: { bsonType: "string" },
        photoUrl: { bsonType: "string" },
        balance: { bsonType: "int" },
        rankings: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              game: { bsonType: "string" },
              score: { bsonType: "int" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
            required: ["game", "score", "createdAt", "updatedAt"],
          },
        },
        avatars: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              id: { bsonType: "int" },
              spritesheet: { bsonType: "binData" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
            required: ["id", "spritesheet", "createdAt", "updatedAt"],
          },
        },
        gameStates: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              game: { bsonType: "objectId" },
              state: { bsonType: "binData" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
            required: ["game", "state", "createdAt", "updatedAt"],
          },
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      required: ["_id", "email", "name", "balance", "createdAt", "updatedAt"],
    },
  },
});

db.createCollection("games", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "games",
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        image: { bsonType: "binData" },
        url: { bsonType: "string" },
        categories: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      required: ["_id", "name", "url", "createdAt", "updatedAt"],
    },
  },
});

db.createCollection("machines", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "machines",
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        location: {
          bsonType: "object",
          title: "location",
          properties: {
            latitude: { bsonType: "double" },
            longitude: { bsonType: "double" },
            altitude: { bsonType: "double" },
          },
          required: ["latitude", "longitude", "altitude"],
        },
        slots: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              id: { bsonType: "int" },
              food: { bsonType: "string" },
              description: { bsonType: "string" },
              image: { bsonType: "binData" },
              quantity: { bsonType: "int" },
              value: { bsonType: "int" },
              createdAt: { bsonType: "date" },
              updatedAt: { bsonType: "date" },
            },
            required: [
              "id",
              "food",
              "quantity",
              "value",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      required: ["_id", "name", "createdAt", "updatedAt"],
    },
  },
});

db.createCollection("operations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "operations",
      properties: {
        _id: { bsonType: "objectId" },
        from: { bsonType: "string" },
        to: { bsonType: "string" },
        game: { bsonType: "string" },
        food: { bsonType: "string" },
        transfer: { bsonType: "bool" },
        description: { bsonType: "string" },
        value: { bsonType: "int" },
        timestamp: { bsonType: "timestamp" },
      },
      required: ["_id", "value", "timestamp"],
      oneOf: [
        { required: ["from", "to"] },
        { required: ["game", "food", "transfer"] },
      ],
    },
  },
});

db.createCollection("characterTemplate", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "sprites",
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        layerDepth: { bsonType: "int" },
        spritesheet: { bsonType: "binData" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
      required: [
        "_id",
        "name",
        "layerDepth",
        "spritesheet",
        "createdAt",
        "updatedAt",
      ],
    },
  },
});

db.createCollection("logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "logs",
      properties: {
        _id: { bsonType: "objectId" },
        user: { bsonType: "string" },
        facility: { bsonType: "string" },
        severity: { bsonType: "string" },
        message: { bsonType: "string" },
        timestamp: { bsonType: "timestamp" },
      },
      required: ["_id", "user", "facility", "severity", "message", "timestamp"],
    },
  },
});
```

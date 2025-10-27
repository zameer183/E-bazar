# Firebase Indexes Documentation

## Overview

Firebase Firestore requires composite indexes for queries that combine multiple fields or perform ordering on fields other than the document ID. This document lists all required indexes for the E-Bazar application.

## How to Create Indexes

### Method 1: Automatic (Recommended)
When you run a query that requires an index, Firebase will throw an error with a link to create the index automatically. Click the link and Firebase will create it for you.

### Method 2: Manual Creation
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **e-bazar-a9714**
3. Navigate to **Firestore Database** > **Indexes**
4. Click **Create Index**
5. Enter the details from the tables below

### Method 3: Firebase CLI (Advanced)
Use `firestore.indexes.json` file (see bottom of this document) and deploy with:
```bash
firebase deploy --only firestore:indexes
```

---

## Required Indexes

### 1. Shops Collection - Get by Owner

**Purpose**: Retrieve all shops owned by a specific user, sorted by creation date

**Location**: `src/lib/firestore.js:180-181`

| Collection | Field | Order |
|------------|-------|-------|
| shops | ownerId | Ascending |
| shops | createdAt | Descending |

**Query Example**:
```javascript
query(
  collection(db, "shops"),
  where("ownerId", "==", userId),
  orderBy("createdAt", "desc")
)
```

**Status**: ⚠️ Currently sorting in memory (line 190-194)

---

### 2. Shop Images - Ordered by Upload Time

**Purpose**: Get shop images sorted by upload date

**Location**: `src/lib/firestore.js:285-286`

| Collection | Field | Order |
|------------|-------|-------|
| shopImages | shopId | Ascending |
| shopImages | uploadedAt | Descending |

**Query Example**:
```javascript
query(
  collection(db, "shopImages"),
  where("shopId", "==", shopId),
  orderBy("uploadedAt", "desc")
)
```

**Status**: ⚠️ Currently sorting in memory (line 293-298)

---

### 3. Shop Videos - Get by Shop (Single Document)

**Purpose**: Get the video for a specific shop

**Location**: `src/lib/firestore.js:344-348`

**Status**: ✅ No index needed (uses limit without orderBy)

---

### 4. Product Images - By Shop and Product

**Purpose**: Get product images for a shop, sorted by upload date

**Location**: `src/lib/firestore.js:399-403`

| Collection | Field | Order |
|------------|-------|-------|
| productImages | shopId | Ascending |
| productImages | uploadedAt | Descending |

**Query Example**:
```javascript
query(
  collection(db, "productImages"),
  where("shopId", "==", shopId),
  orderBy("uploadedAt", "desc")
)
```

**Status**: ⚠️ Currently sorting in memory (line 410-415)

---

## Additional Recommended Indexes

### 5. Shops - By City and Category

**Purpose**: Browse shops in a specific city and category

| Collection | Field | Order |
|------------|-------|-------|
| shops | citySlug | Ascending |
| shops | categorySlug | Ascending |
| shops | rating | Descending |

**Use Case**: Featured shops page, category browsing

---

### 6. Shops - Top Rated

**Purpose**: Get highest rated shops across all cities

| Collection | Field | Order |
|------------|-------|-------|
| shops | rating | Descending |
| shops | reviews | Descending |

**Use Case**: Top-rated sellers page

---

### 7. Shops - By City (with Rating)

**Purpose**: Get shops in a city sorted by rating

| Collection | Field | Order |
|------------|-------|-------|
| shops | citySlug | Ascending |
| shops | rating | Descending |

**Use Case**: City-specific top shops

---

## Index Creation Checklist

Use this checklist to track index creation:

- [ ] **Index 1**: shops (ownerId + createdAt)
- [ ] **Index 2**: shopImages (shopId + uploadedAt)
- [ ] **Index 4**: productImages (shopId + uploadedAt)
- [ ] **Index 5**: shops (citySlug + categorySlug + rating) [Optional]
- [ ] **Index 6**: shops (rating + reviews) [Optional]
- [ ] **Index 7**: shops (citySlug + rating) [Optional]

---

## Firestore Indexes JSON

Copy this to `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "shops",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "ownerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "shopImages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "shopId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "uploadedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "productImages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "shopId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "uploadedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "shops",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "citySlug",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "categorySlug",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "rating",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "shops",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "rating",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "reviews",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "shops",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "citySlug",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "rating",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## After Creating Indexes

Once you create the indexes:

1. **Update firestore.js**: Uncomment the `orderBy` clauses
2. **Remove in-memory sorting**: Delete the sorting code (lines 190-194, 293-298, 410-415)
3. **Test queries**: Verify all queries work correctly
4. **Monitor performance**: Check Firebase Console > Performance tab

### Example Update

**Before** (with in-memory sorting):
```javascript
const q = query(
  collection(db, "shops"),
  where("ownerId", "==", ownerId)
  // orderBy("createdAt", "desc") - requires index
);
const querySnapshot = await getDocs(q);
const shops = [];
querySnapshot.forEach((doc) => {
  shops.push({ id: doc.id, ...doc.data() });
});

// Sort in memory
shops.sort((a, b) => {
  const aTime = a.createdAt?.toMillis?.() || 0;
  const bTime = b.createdAt?.toMillis?.() || 0;
  return bTime - aTime;
});
```

**After** (with index):
```javascript
const q = query(
  collection(db, "shops"),
  where("ownerId", "==", ownerId),
  orderBy("createdAt", "desc") // ✅ Index created
);
const querySnapshot = await getDocs(q);
const shops = [];
querySnapshot.forEach((doc) => {
  shops.push({ id: doc.id, ...doc.data() });
});
// No need for in-memory sorting!
```

---

## Troubleshooting

### Error: "The query requires an index"

1. Copy the error link
2. Open in browser
3. Click "Create Index"
4. Wait 1-2 minutes for index to build
5. Retry the query

### Index Taking Too Long

- Small collections (< 1000 docs): 1-2 minutes
- Medium collections (1000-10000 docs): 5-15 minutes
- Large collections (10000+ docs): 30+ minutes

### Query Still Not Working

1. Check Firestore Console > Indexes tab
2. Verify index status is "Enabled" (not "Building")
3. Clear browser cache
4. Hard refresh your application

---

## Performance Tips

1. **Create indexes during development** - Don't wait for production
2. **Monitor index usage** - Firebase Console shows unused indexes
3. **Delete unused indexes** - They count toward quotas
4. **Test with production data size** - Performance differs at scale

---

**Last Updated**: $(date)
**Status**: Indexes documented ✅
**Next Step**: Create indexes in Firebase Console

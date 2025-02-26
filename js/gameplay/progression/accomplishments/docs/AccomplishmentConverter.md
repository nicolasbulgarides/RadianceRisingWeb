# AccomplishmentConverter

## Overview

The `AccomplishmentConverter` class is a utility class that provides methods for converting between different accomplishment data formats in the accomplishment system. It handles the transformation of data between preset configurations, composite objects, and serializable representations, ensuring data integrity and consistency throughout the system.

## Class Methods

### `presetToComposite(preset, customData)`

Converts a preset configuration and custom data into a composite object.

**Parameters:**

- `preset` (Object): The preset configuration object, typically obtained from an emitter's `getPreset` method.
- `customData` (Object): Custom data to override default values in the preset.

**Returns:**

- (Object): A composite object containing the header and appropriate data structures.

**Example:**

```javascript
const preset = combatEmitter.getPreset("enemyDefeated");
const customData = {
  idsOfDefeatedEntities: ["goblin-123"],
  combatEventLocation: "dark-forest",
};

const composite = AccomplishmentConverter.presetToComposite(preset, customData);
```

### `extractDataFromComposite(composite)`

Extracts the relevant data structure from a composite object based on its category.

**Parameters:**

- `composite` (Object): The composite object to extract data from.

**Returns:**

- (Object): The extracted data structure, or null if no matching data structure is found.

**Example:**

```javascript
const combatData = AccomplishmentConverter.extractDataFromComposite(composite);
```

### `compositeToSerializable(composite)`

Creates a serializable representation of a composite object by returning a deep copy.

**Parameters:**

- `composite` (Object): The composite object to convert.

**Returns:**

- (Object): A serializable representation of the composite object.

**Example:**

```javascript
const serializable = AccomplishmentConverter.compositeToSerializable(composite);
const jsonString = JSON.stringify(serializable);
```

### `serializableToComposite(serializable)`

Converts a serialized representation back into a composite object.

**Parameters:**

- `serializable` (Object): The serialized representation to convert.

**Returns:**

- (Object): A composite object.

**Example:**

```javascript
const jsonString = localStorage.getItem("accomplishment");
const serializable = JSON.parse(jsonString);
const composite = AccomplishmentConverter.serializableToComposite(serializable);
```

## Data Formats

Understanding the different data formats used in the accomplishment system is crucial for using the `AccomplishmentConverter` class effectively.

### Preset Configuration

A preset configuration is an object that defines the structure and default values for an accomplishment. It is typically obtained from an emitter's `getPreset` method.

```javascript
{
  category: 'combat',
  subCategory: 'enemyDefeated',
  metaData: {
    nickName: 'Enemy Defeated',
    description: 'Defeat an enemy in combat'
  },
  defaultData: {
    idsOfDefeatedEntities: [],
    idsOfVictorEntities: [],
    combatEventLocation: '',
    combatDifficulty: 'normal',
    combatDuration: 0,
    combatRelevantValue: 0
  }
}
```

### Custom Data

Custom data is an object that contains specific values for an accomplishment. It is used to override the default values in a preset configuration.

```javascript
{
  idsOfDefeatedEntities: ['goblin-123'],
  idsOfVictorEntities: ['player-456'],
  combatEventLocation: 'dark-forest',
  combatDifficulty: 'hard',
  combatDuration: 120,
  combatRelevantValue: 10
}
```

### Composite Object

A composite object is the main data structure used to represent an accomplishment in the system. It contains a header and one or more specialized data structures.

```javascript
{
  header: {
    category: 'combat',
    subCategory: 'enemyDefeated',
    metaData: {
      nickName: 'Enemy Defeated',
      description: 'Defeat an enemy in combat'
    }
  },
  combatData: {
    idsOfDefeatedEntities: ['goblin-123'],
    idsOfVictorEntities: ['player-456'],
    combatEventLocation: 'dark-forest',
    combatDifficulty: 'hard',
    combatDuration: 120,
    combatRelevantValue: 10
  },
  timestamp: 1623456789000,
  id: 'acc-1623456789000-123456'
}
```

### Serializable Representation

A serializable representation is a deep copy of a composite object that can be safely serialized to JSON.

## Use Cases

### 1. Converting Preset to Composite

The most common use case for the `AccomplishmentConverter` class is converting a preset configuration and custom data into a composite object. This is typically done when creating a new accomplishment.

```javascript
// Get a preset from an emitter
const preset = combatEmitter.getPreset("enemyDefeated");

// Define custom data
const customData = {
  idsOfDefeatedEntities: ["goblin-123"],
  idsOfVictorEntities: ["player-456"],
  combatEventLocation: "dark-forest",
  combatDifficulty: "hard",
  combatDuration: 120,
  combatRelevantValue: 10,
};

// Convert to a composite object
const composite = AccomplishmentConverter.presetToComposite(preset, customData);

// Now you can use the composite object
accomplishmentManager.trackAccomplishment(composite);
```

### 2. Serializing for Storage

When saving accomplishments to storage, you need to convert them to a serializable format.

```javascript
// Get all accomplishments
const accomplishments = accomplishmentManager.getAllAccomplishments();

// Convert to serializable format
const serializableData = accomplishments.map((accomplishment) =>
  AccomplishmentConverter.compositeToSerializable(accomplishment)
);

// Save to storage
localStorage.setItem("accomplishments", JSON.stringify(serializableData));
```

### 3. Deserializing from Storage

When loading accomplishments from storage, you need to convert them back to composite objects.

```javascript
// Load from storage
const storedData = localStorage.getItem("accomplishments");
if (storedData) {
  const parsedData = JSON.parse(storedData);

  // Convert to composite objects
  const accomplishments = parsedData.map((item) =>
    AccomplishmentConverter.serializableToComposite(item)
  );

  // Now you can use the accomplishments
  accomplishments.forEach((accomplishment) => {
    accomplishmentManager.trackAccomplishment(accomplishment);
  });
}
```

### 4. Extracting Data for Processing

When you need to process different types of accomplishments differently based on their category, you can use the `extractDataFromComposite` method.

```javascript
function processAccomplishment(composite) {
  // Extract the relevant data based on the category
  const specificData =
    AccomplishmentConverter.extractDataFromComposite(composite);

  // Now you can work with the category-specific data
  if (composite.header.category === "combat") {
    processCombatData(specificData);
  } else if (composite.header.category === "exploration") {
    processExplorationData(specificData);
  }
}
```

### 5. Creating Deep Copies

When you need to create a deep copy of an accomplishment, you can use the `compositeToSerializable` and `serializableToComposite` methods.

```javascript
function createDeepCopy(accomplishment) {
  return AccomplishmentConverter.serializableToComposite(
    AccomplishmentConverter.compositeToSerializable(accomplishment)
  );
}
```

## Best Practices

### 1. Always Validate After Conversion

After converting data, it's a good practice to validate the result to ensure it meets the expected format.

```javascript
const composite = AccomplishmentConverter.presetToComposite(preset, customData);
const { isValid, errors } =
  AccomplishmentValidator.validateComposite(composite);

if (!isValid) {
  console.error("Invalid composite object:", errors);
  return null;
}
```

### 2. Handle Missing Data Gracefully

When working with data from external sources, it's important to handle missing or invalid data gracefully.

```javascript
function safeExtractData(composite) {
  if (!composite || !composite.header) {
    return null;
  }

  return AccomplishmentConverter.extractDataFromComposite(composite);
}
```

### 3. Use Type Checking

When working with complex data structures, it's a good practice to use type checking to ensure you're working with the expected data types.

```javascript
function isComposite(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    obj.header &&
    typeof obj.header === "object" &&
    typeof obj.header.category === "string"
  );
}

function processAccomplishment(composite) {
  if (!isComposite(composite)) {
    console.error("Invalid composite object");
    return;
  }

  // Process the accomplishment
}
```

### 4. Keep Track of Data Versions

If your data format changes over time, it's important to keep track of versions to ensure backward compatibility.

```javascript
function migrateAccomplishment(composite, fromVersion, toVersion) {
  if (fromVersion === 1 && toVersion === 2) {
    // Migrate from version 1 to version 2
    composite.version = 2;

    // Add new fields or transform existing ones
    if (composite.header.category === "combat") {
      composite.combatData.combatType =
        composite.combatData.combatType || "standard";
    }
  }

  return composite;
}
```

## Common Pitfalls

### 1. Mutating Original Data

The `presetToComposite` method creates a new object, but it doesn't perform a deep copy of the input data. If you modify the returned object, it won't affect the original preset, but if you modify nested objects, it might affect the original.

```javascript
// Incorrect
const composite = AccomplishmentConverter.presetToComposite(preset, customData);
composite.header.metaData.nickName = "New Name"; // This might modify the original preset

// Correct
const composite = AccomplishmentConverter.presetToComposite(preset, customData);
composite.header = {
  ...composite.header,
  metaData: {
    ...composite.header.metaData,
    nickName: "New Name",
  },
};
```

### 2. Assuming Data Structure

Don't assume the structure of the data. Always check for the existence of properties before accessing them.

```javascript
// Incorrect
const enemyId = composite.combatData.idsOfDefeatedEntities[0];

// Correct
const enemyId =
  composite.combatData &&
  composite.combatData.idsOfDefeatedEntities &&
  composite.combatData.idsOfDefeatedEntities.length > 0
    ? composite.combatData.idsOfDefeatedEntities[0]
    : null;
```

### 3. Ignoring Validation Errors

Don't ignore validation errors. They can help you identify issues with your data.

```javascript
// Incorrect
const composite = AccomplishmentConverter.presetToComposite(preset, customData);
accomplishmentManager.trackAccomplishment(composite);

// Correct
const composite = AccomplishmentConverter.presetToComposite(preset, customData);
const { isValid, errors } =
  AccomplishmentValidator.validateComposite(composite);

if (isValid) {
  accomplishmentManager.trackAccomplishment(composite);
} else {
  console.error("Invalid composite object:", errors);
}
```

## Advanced Usage

### 1. Custom Conversion Logic

If you need custom conversion logic for specific categories, you can extend the `AccomplishmentConverter` class.

```javascript
class CustomAccomplishmentConverter extends AccomplishmentConverter {
  static presetToComposite(preset, customData) {
    const composite = super.presetToComposite(preset, customData);

    // Add custom logic for specific categories
    if (preset.category === "custom") {
      composite.customData = {
        ...preset.defaultData,
        ...customData,
        customField: "custom value",
      };
    }

    return composite;
  }
}
```

### 2. Batch Conversion

When working with large numbers of accomplishments, it can be more efficient to convert them in batches.

```javascript
function batchConvertToSerializable(accomplishments) {
  return accomplishments.map((accomplishment) =>
    AccomplishmentConverter.compositeToSerializable(accomplishment)
  );
}

function batchConvertToComposite(serializables) {
  return serializables.map((serializable) =>
    AccomplishmentConverter.serializableToComposite(serializable)
  );
}
```

### 3. Filtering During Conversion

You can filter accomplishments during conversion to exclude certain categories or types.

```javascript
function convertAndFilterByCategory(accomplishments, category) {
  return accomplishments
    .filter((accomplishment) => accomplishment.header.category === category)
    .map((accomplishment) =>
      AccomplishmentConverter.compositeToSerializable(accomplishment)
    );
}
```

## Integration Examples

### 1. Integration with AccomplishmentManager

```javascript
class AccomplishmentManager {
  constructor() {
    this.accomplishments = [];
  }

  trackAccomplishment(accomplishmentData) {
    // Convert to composite if it's a preset
    let composite = accomplishmentData;
    if (accomplishmentData.defaultData) {
      composite = AccomplishmentConverter.presetToComposite(
        accomplishmentData,
        {}
      );
    }

    // Validate the composite
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(composite);
    if (!isValid) {
      console.error("Invalid accomplishment data:", errors);
      return false;
    }

    // Add the accomplishment
    this.accomplishments.push(composite);
    return true;
  }

  saveAccomplishments() {
    const serializableData = this.accomplishments.map((accomplishment) =>
      AccomplishmentConverter.compositeToSerializable(accomplishment)
    );
    localStorage.setItem("accomplishments", JSON.stringify(serializableData));
  }

  loadAccomplishments() {
    const storedData = localStorage.getItem("accomplishments");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.accomplishments = parsedData.map((item) =>
        AccomplishmentConverter.serializableToComposite(item)
      );
    }
  }
}
```

### 2. Integration with UI Components

```javascript
class AccomplishmentDisplay {
  constructor(accomplishmentManager) {
    this.accomplishmentManager = accomplishmentManager;
  }

  displayAccomplishment(accomplishment) {
    // Extract data for display
    const header = accomplishment.header;
    const specificData =
      AccomplishmentConverter.extractDataFromComposite(accomplishment);

    // Create display element
    const element = document.createElement("div");
    element.className = "accomplishment";
    element.innerHTML = `
      <h3>${header.metaData.nickName}</h3>
      <p>${header.metaData.description}</p>
      <div class="details">
        ${this.renderSpecificData(header.category, specificData)}
      </div>
    `;

    return element;
  }

  renderSpecificData(category, data) {
    // Render category-specific data
    switch (category) {
      case "combat":
        return `
          <p>Defeated: ${data.idsOfDefeatedEntities.join(", ")}</p>
          <p>Location: ${data.combatEventLocation}</p>
          <p>Difficulty: ${data.combatDifficulty}</p>
        `;
      case "exploration":
        return `
          <p>Area: ${data.explorationAreaName}</p>
          <p>Type: ${data.explorationAreaType}</p>
        `;
      default:
        return "";
    }
  }
}
```

### 3. Integration with Network API

```javascript
class AccomplishmentAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async syncAccomplishments(accomplishments) {
    // Convert to serializable format
    const serializableData = accomplishments.map((accomplishment) =>
      AccomplishmentConverter.compositeToSerializable(accomplishment)
    );

    // Send to server
    const response = await fetch(`${this.baseUrl}/accomplishments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serializableData),
    });

    return response.ok;
  }

  async getAccomplishments() {
    // Get from server
    const response = await fetch(`${this.baseUrl}/accomplishments`);
    const data = await response.json();

    // Convert to composite objects
    return data.map((item) =>
      AccomplishmentConverter.serializableToComposite(item)
    );
  }
}
```

## Performance Considerations

### 1. Deep Copying

The `compositeToSerializable` and `serializableToComposite` methods perform deep copies of the input data, which can be expensive for large objects. If performance is a concern, consider using a more efficient deep copy implementation.

```javascript
function efficientDeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

### 2. Batch Processing

When working with large numbers of accomplishments, it's more efficient to process them in batches rather than individually.

```javascript
function batchProcess(accomplishments, batchSize = 100) {
  const results = [];

  for (let i = 0; i < accomplishments.length; i += batchSize) {
    const batch = accomplishments.slice(i, i + batchSize);
    const processedBatch = batch.map((accomplishment) =>
      AccomplishmentConverter.compositeToSerializable(accomplishment)
    );
    results.push(...processedBatch);
  }

  return results;
}
```

### 3. Caching

If you're repeatedly converting the same accomplishments, consider caching the results.

```javascript
const conversionCache = new Map();

function cachedConversion(accomplishment, operation) {
  const cacheKey = `${accomplishment.id}-${operation}`;

  if (conversionCache.has(cacheKey)) {
    return conversionCache.get(cacheKey);
  }

  let result;
  if (operation === "toSerializable") {
    result = AccomplishmentConverter.compositeToSerializable(accomplishment);
  } else if (operation === "toComposite") {
    result = AccomplishmentConverter.serializableToComposite(accomplishment);
  }

  conversionCache.set(cacheKey, result);
  return result;
}
```

## Troubleshooting

### 1. Missing Data After Conversion

If data is missing after conversion, check that you're providing all required fields in the custom data.

```javascript
// Check for required fields
function checkRequiredFields(customData, requiredFields) {
  const missingFields = requiredFields.filter((field) => !customData[field]);

  if (missingFields.length > 0) {
    console.warn(`Missing required fields: ${missingFields.join(", ")}`);
  }
}

// Before conversion
checkRequiredFields(customData, [
  "idsOfDefeatedEntities",
  "combatEventLocation",
]);
```

### 2. Circular References

If you encounter circular references when serializing, you need to break the circular references before conversion.

```javascript
function breakCircularReferences(obj, seen = new WeakSet()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (seen.has(obj)) {
    return "[Circular Reference]";
  }

  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map((item) => breakCircularReferences(item, seen));
  }

  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = breakCircularReferences(obj[key], seen);
    }
  }

  return result;
}

// Before serialization
const safeObj = breakCircularReferences(composite);
const serializable = AccomplishmentConverter.compositeToSerializable(safeObj);
```

### 3. Data Type Mismatches

If you encounter data type mismatches, check that you're providing the correct data types in the custom data.

```javascript
// Check data types
function checkDataTypes(customData, expectedTypes) {
  const typeErrors = [];

  for (const field in expectedTypes) {
    if (customData[field] !== undefined) {
      const expectedType = expectedTypes[field];
      const actualType = Array.isArray(customData[field])
        ? "array"
        : typeof customData[field];

      if (expectedType !== actualType) {
        typeErrors.push(
          `Field '${field}' should be of type '${expectedType}', but got '${actualType}'`
        );
      }
    }
  }

  if (typeErrors.length > 0) {
    console.warn(`Data type mismatches: ${typeErrors.join(", ")}`);
  }
}

// Before conversion
checkDataTypes(customData, {
  idsOfDefeatedEntities: "array",
  combatEventLocation: "string",
  combatDuration: "number",
});
```

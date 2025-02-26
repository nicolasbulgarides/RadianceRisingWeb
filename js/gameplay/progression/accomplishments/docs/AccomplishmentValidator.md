# AccomplishmentValidator

## Overview

The `AccomplishmentValidator` class is a utility class that provides methods for validating accomplishment data structures in the accomplishment system. It ensures that accomplishment data meets the required format and contains all necessary fields, helping to maintain data integrity and prevent errors.

## Class Methods

### `validateComposite(composite)`

Validates a composite accomplishment object.

**Parameters:**

- `composite` (Object): The composite object to validate.

**Returns:**

- (Object): An object with the following properties:
  - `isValid` (boolean): Whether the composite is valid.
  - `errors` (Array): An array of error messages if the composite is invalid.

**Example:**

```javascript
const composite = accomplishmentManager.createFromPreset(
  "combat",
  "enemyDefeated",
  customData
);
const { isValid, errors } =
  AccomplishmentValidator.validateComposite(composite);

if (!isValid) {
  console.error("Invalid composite object:", errors);
  return;
}
```

### `validateHeader(header)`

Validates an accomplishment header.

**Parameters:**

- `header` (Object): The header object to validate.

**Returns:**

- (Object): An object with the following properties:
  - `isValid` (boolean): Whether the header is valid.
  - `errors` (Array): An array of error messages if the header is invalid.

**Example:**

```javascript
const header = {
  category: "combat",
  subCategory: "enemyDefeated",
  metaData: {
    nickName: "Enemy Defeated",
    description: "Defeat an enemy in combat",
  },
};

const { isValid, errors } = AccomplishmentValidator.validateHeader(header);

if (!isValid) {
  console.error("Invalid header:", errors);
  return;
}
```

### `validatePreset(preset)`

Validates a preset configuration.

**Parameters:**

- `preset` (Object): The preset configuration to validate.

**Returns:**

- (Object): An object with the following properties:
  - `isValid` (boolean): Whether the preset is valid.
  - `errors` (Array): An array of error messages if the preset is invalid.

**Example:**

```javascript
const preset = combatEmitter.getPreset("enemyDefeated");
const { isValid, errors } = AccomplishmentValidator.validatePreset(preset);

if (!isValid) {
  console.error("Invalid preset:", errors);
  return;
}
```

### `validateEmitter(emitter)`

Validates an accomplishment emitter.

**Parameters:**

- `emitter` (Object): The emitter object to validate.

**Returns:**

- (Object): An object with the following properties:
  - `isValid` (boolean): Whether the emitter is valid.
  - `errors` (Array): An array of error messages if the emitter is invalid.

**Example:**

```javascript
const emitter = registry.getEmitter("combat");
const { isValid, errors } = AccomplishmentValidator.validateEmitter(emitter);

if (!isValid) {
  console.error("Invalid emitter:", errors);
  return;
}
```

## Validation Rules

### Composite Validation

A valid composite object must:

1. Not be null or undefined.
2. Have a valid header.
3. Have at least one data structure (e.g., combatData, explorationData, etc.).

### Header Validation

A valid header must:

1. Not be null or undefined.
2. Have a non-empty `category` string.
3. Have a non-empty `subCategory` string.
4. Have a `metaData` object with:
   - A non-empty `nickName` string.
   - A non-empty `description` string.

### Preset Validation

A valid preset must:

1. Not be null or undefined.
2. Have a non-empty `category` string.
3. Have a non-empty `subCategory` string.
4. Have a `metaData` object with:
   - A non-empty `nickName` string.
   - A non-empty `description` string.
5. Have a `defaultData` object.

### Emitter Validation

A valid emitter must:

1. Not be null or undefined.
2. Have a `getPreset` method.

## Use Cases

### 1. Validating User Input

When accepting user input for accomplishments, it's important to validate the data before processing it.

```javascript
function processUserInput(userInput) {
  // Create a composite object from user input
  const composite = {
    header: {
      category: userInput.category,
      subCategory: userInput.subCategory,
      metaData: {
        nickName: userInput.nickName,
        description: userInput.description,
      },
    },
    [userInput.category + "Data"]: userInput.data,
  };

  // Validate the composite
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    console.error("Invalid user input:", errors);
    return false;
  }

  // Process the valid composite
  accomplishmentManager.trackAccomplishment(composite);
  return true;
}
```

### 2. Validating Presets

When creating or modifying presets, it's important to validate them to ensure they meet the required format.

```javascript
function createCustomPreset(category, subCategory, metaData, defaultData) {
  const preset = {
    category,
    subCategory,
    metaData,
    defaultData,
  };

  // Validate the preset
  const { isValid, errors } = AccomplishmentValidator.validatePreset(preset);

  if (!isValid) {
    console.error("Invalid preset:", errors);
    return null;
  }

  return preset;
}
```

### 3. Validating Emitters

When registering emitters with the registry, it's important to validate them to ensure they implement the required methods.

```javascript
function registerEmitter(category, emitter) {
  // Validate the emitter
  const { isValid, errors } = AccomplishmentValidator.validateEmitter(emitter);

  if (!isValid) {
    console.error("Invalid emitter:", errors);
    return false;
  }

  // Register the valid emitter
  registry.registerEmitter(category, emitter);
  return true;
}
```

### 4. Validating Accomplishments Before Tracking

Before tracking an accomplishment, it's important to validate it to ensure it meets the required format.

```javascript
function trackAccomplishment(accomplishment) {
  // Validate the accomplishment
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(accomplishment);

  if (!isValid) {
    console.error("Invalid accomplishment:", errors);
    return false;
  }

  // Track the valid accomplishment
  accomplishmentManager.trackAccomplishment(accomplishment);
  return true;
}
```

## Best Practices

### 1. Validate Early and Often

Validate data as early as possible in the process to catch errors before they propagate.

```javascript
// Validate at creation
const preset = combatEmitter.getPreset("enemyDefeated");
const { isValid: presetValid, errors: presetErrors } =
  AccomplishmentValidator.validatePreset(preset);

if (!presetValid) {
  console.error("Invalid preset:", presetErrors);
  return;
}

// Validate after conversion
const composite = AccomplishmentConverter.presetToComposite(preset, customData);
const { isValid: compositeValid, errors: compositeErrors } =
  AccomplishmentValidator.validateComposite(composite);

if (!compositeValid) {
  console.error("Invalid composite:", compositeErrors);
  return;
}

// Validate before tracking
accomplishmentManager.trackAccomplishment(composite);
```

### 2. Provide Helpful Error Messages

When validation fails, provide helpful error messages to make it easier to identify and fix the issue.

```javascript
function validateWithContext(composite, context) {
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    console.error(`Invalid composite in ${context}:`, errors);
    console.error("Composite:", composite);
    return false;
  }

  return true;
}
```

### 3. Use Validation Results to Guide User Feedback

Use validation results to provide feedback to users when they input invalid data.

```javascript
function handleUserSubmit(formData) {
  // Create a composite from form data
  const composite = createCompositeFromFormData(formData);

  // Validate the composite
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    // Display errors to the user
    displayErrors(errors);
    return false;
  }

  // Submit the valid composite
  submitComposite(composite);
  return true;
}
```

### 4. Implement Custom Validation Rules

Extend the validator with custom validation rules for specific categories or use cases.

```javascript
class CustomValidator extends AccomplishmentValidator {
  static validateCombatData(combatData) {
    const errors = [];

    if (
      !combatData.idsOfDefeatedEntities ||
      combatData.idsOfDefeatedEntities.length === 0
    ) {
      errors.push("Combat data must include at least one defeated entity");
    }

    if (!combatData.combatEventLocation) {
      errors.push("Combat data must include a location");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateComposite(composite) {
    // First, use the base validation
    const baseResult = super.validateComposite(composite);

    if (!baseResult.isValid) {
      return baseResult;
    }

    // Then, add custom validation
    if (composite.header.category === "combat" && composite.combatData) {
      const combatResult = this.validateCombatData(composite.combatData);

      if (!combatResult.isValid) {
        return {
          isValid: false,
          errors: combatResult.errors,
        };
      }
    }

    return baseResult;
  }
}
```

## Common Pitfalls

### 1. Ignoring Validation Results

Don't ignore validation results. They can help you identify issues with your data.

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

### 2. Assuming Valid Data

Don't assume that data is valid. Always validate it before processing.

```javascript
// Incorrect
function processAccomplishment(composite) {
  const category = composite.header.category;
  // Process the accomplishment
}

// Correct
function processAccomplishment(composite) {
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    console.error("Invalid composite object:", errors);
    return;
  }

  const category = composite.header.category;
  // Process the accomplishment
}
```

### 3. Validating Too Late

Don't wait until the last moment to validate data. Validate it as early as possible.

```javascript
// Incorrect
function trackAccomplishment(composite) {
  // Process the accomplishment
  // ...

  // Validate at the end
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    console.error("Invalid composite object:", errors);
    return false;
  }

  return true;
}

// Correct
function trackAccomplishment(composite) {
  // Validate at the beginning
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    console.error("Invalid composite object:", errors);
    return false;
  }

  // Process the accomplishment
  // ...

  return true;
}
```

## Advanced Usage

### 1. Custom Validation Rules

You can create custom validation rules for specific categories or use cases.

```javascript
function validateCombatAccomplishment(composite) {
  // First, use the standard validation
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    return { isValid, errors };
  }

  // Then, add custom validation
  const customErrors = [];

  if (composite.header.category !== "combat") {
    customErrors.push("Not a combat accomplishment");
    return { isValid: false, errors: customErrors };
  }

  const combatData = composite.combatData;

  if (!combatData) {
    customErrors.push("Missing combat data");
    return { isValid: false, errors: customErrors };
  }

  if (
    !combatData.idsOfDefeatedEntities ||
    combatData.idsOfDefeatedEntities.length === 0
  ) {
    customErrors.push("No defeated entities specified");
  }

  if (!combatData.combatEventLocation) {
    customErrors.push("No combat location specified");
  }

  return {
    isValid: customErrors.length === 0,
    errors: customErrors,
  };
}
```

### 2. Validation with Schema

You can use a schema to define validation rules for different categories.

```javascript
const validationSchema = {
  combat: {
    requiredFields: [
      "idsOfDefeatedEntities",
      "idsOfVictorEntities",
      "combatEventLocation",
    ],
    typeChecks: {
      idsOfDefeatedEntities: "array",
      idsOfVictorEntities: "array",
      combatEventLocation: "string",
      combatDuration: "number",
    },
  },
  exploration: {
    requiredFields: [
      "explorationAreaId",
      "explorationAreaName",
      "explorationAreaType",
    ],
    typeChecks: {
      explorationAreaId: "string",
      explorationAreaName: "string",
      explorationAreaType: "string",
    },
  },
};

function validateWithSchema(composite, schema) {
  // First, use the standard validation
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    return { isValid, errors };
  }

  // Then, validate against the schema
  const category = composite.header.category;
  const categorySchema = schema[category];

  if (!categorySchema) {
    return { isValid: true, errors: [] };
  }

  const customErrors = [];
  const data = AccomplishmentConverter.extractDataFromComposite(composite);

  if (!data) {
    customErrors.push(`Missing data for category: ${category}`);
    return { isValid: false, errors: customErrors };
  }

  // Check required fields
  if (categorySchema.requiredFields) {
    for (const field of categorySchema.requiredFields) {
      if (!data[field]) {
        customErrors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Check types
  if (categorySchema.typeChecks) {
    for (const [field, expectedType] of Object.entries(
      categorySchema.typeChecks
    )) {
      if (data[field] !== undefined) {
        const actualType = Array.isArray(data[field])
          ? "array"
          : typeof data[field];

        if (expectedType !== actualType) {
          customErrors.push(
            `Field '${field}' should be of type '${expectedType}', but got '${actualType}'`
          );
        }
      }
    }
  }

  return {
    isValid: customErrors.length === 0,
    errors: customErrors,
  };
}
```

### 3. Asynchronous Validation

You can implement asynchronous validation for cases where you need to check against external data.

```javascript
async function validateWithExternalData(composite) {
  // First, use the standard validation
  const { isValid, errors } =
    AccomplishmentValidator.validateComposite(composite);

  if (!isValid) {
    return { isValid, errors };
  }

  // Then, validate against external data
  const customErrors = [];

  if (composite.header.category === "combat") {
    const combatData = composite.combatData;

    if (combatData && combatData.idsOfDefeatedEntities) {
      for (const entityId of combatData.idsOfDefeatedEntities) {
        // Check if the entity exists
        const entityExists = await checkEntityExists(entityId);

        if (!entityExists) {
          customErrors.push(`Entity does not exist: ${entityId}`);
        }
      }
    }
  }

  return {
    isValid: customErrors.length === 0,
    errors: customErrors,
  };
}

async function checkEntityExists(entityId) {
  // In a real implementation, this would check against a database or API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(entityId.startsWith("entity-"));
    }, 100);
  });
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
    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (!isValid) {
      console.error("Invalid accomplishment data:", errors);
      return false;
    }

    // Add the accomplishment
    this.accomplishments.push(accomplishmentData);
    return true;
  }
}
```

### 2. Integration with Form Validation

```javascript
class AccomplishmentForm {
  constructor(formElement, accomplishmentManager) {
    this.formElement = formElement;
    this.accomplishmentManager = accomplishmentManager;

    this.formElement.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(this.formElement);

    // Create a composite from form data
    const composite = {
      header: {
        category: formData.get("category"),
        subCategory: formData.get("subCategory"),
        metaData: {
          nickName: formData.get("nickName"),
          description: formData.get("description"),
        },
      },
    };

    // Add category-specific data
    const category = formData.get("category");
    composite[category + "Data"] = this.getCategoryData(formData, category);

    // Validate the composite
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(composite);

    if (!isValid) {
      this.displayErrors(errors);
      return;
    }

    // Track the accomplishment
    this.accomplishmentManager.trackAccomplishment(composite);

    // Reset the form
    this.formElement.reset();
  }

  getCategoryData(formData, category) {
    // Get category-specific data from the form
    switch (category) {
      case "combat":
        return {
          idsOfDefeatedEntities: formData.getAll("defeatedEntities"),
          idsOfVictorEntities: formData.getAll("victorEntities"),
          combatEventLocation: formData.get("location"),
          combatDifficulty: formData.get("difficulty"),
          combatDuration: parseInt(formData.get("duration"), 10),
          combatRelevantValue: parseInt(formData.get("relevantValue"), 10),
        };
      case "exploration":
        return {
          explorationAreaId: formData.get("areaId"),
          explorationAreaName: formData.get("areaName"),
          explorationAreaType: formData.get("areaType"),
          explorationTimestamp: Date.now(),
          explorationPlayerLevel: parseInt(formData.get("playerLevel"), 10),
        };
      default:
        return {};
    }
  }

  displayErrors(errors) {
    // Display errors to the user
    const errorContainer = this.formElement.querySelector(".error-container");
    errorContainer.innerHTML = "";

    for (const error of errors) {
      const errorElement = document.createElement("div");
      errorElement.className = "error";
      errorElement.textContent = error;
      errorContainer.appendChild(errorElement);
    }
  }
}
```

### 3. Integration with API Validation

```javascript
class AccomplishmentAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async createAccomplishment(accomplishmentData) {
    // Validate the accomplishment data
    const { isValid, errors } =
      AccomplishmentValidator.validateComposite(accomplishmentData);

    if (!isValid) {
      return {
        success: false,
        errors,
      };
    }

    // Send to server
    try {
      const response = await fetch(`${this.baseUrl}/accomplishments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accomplishmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          errors: errorData.errors || ["Failed to create accomplishment"],
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message],
      };
    }
  }
}
```

## Performance Considerations

### 1. Caching Validation Results

If you're validating the same objects multiple times, consider caching the validation results.

```javascript
const validationCache = new Map();

function cachedValidation(composite) {
  // Use the object's ID as the cache key
  const cacheKey = composite.id || JSON.stringify(composite);

  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey);
  }

  const result = AccomplishmentValidator.validateComposite(composite);
  validationCache.set(cacheKey, result);
  return result;
}
```

### 2. Partial Validation

If you're only interested in validating specific aspects of an object, consider implementing partial validation.

```javascript
function validateHeaderOnly(composite) {
  if (!composite || !composite.header) {
    return {
      isValid: false,
      errors: ["Missing header"],
    };
  }

  return AccomplishmentValidator.validateHeader(composite.header);
}
```

### 3. Batch Validation

When validating multiple objects, it can be more efficient to validate them in a batch.

```javascript
function validateBatch(composites) {
  const results = [];

  for (const composite of composites) {
    const result = AccomplishmentValidator.validateComposite(composite);
    results.push({
      composite,
      isValid: result.isValid,
      errors: result.errors,
    });
  }

  return results;
}
```

## Troubleshooting

### 1. Common Validation Errors

Here are some common validation errors and how to fix them:

#### Missing Category

```
Error: Missing required field: category
```

Fix: Ensure that the header has a non-empty `category` string.

```javascript
composite.header.category = "combat";
```

#### Missing Metadata

```
Error: Missing required field: metaData
```

Fix: Ensure that the header has a `metaData` object with `nickName` and `description` properties.

```javascript
composite.header.metaData = {
  nickName: "Enemy Defeated",
  description: "Defeat an enemy in combat",
};
```

#### Missing Data Structure

```
Error: Composite must have at least one data structure
```

Fix: Ensure that the composite has at least one data structure corresponding to its category.

```javascript
composite.combatData = {
  idsOfDefeatedEntities: ["enemy-1"],
  idsOfVictorEntities: ["player-1"],
  combatEventLocation: "forest",
  combatDifficulty: "normal",
  combatDuration: 60,
  combatRelevantValue: 10,
};
```

### 2. Debugging Validation

When debugging validation issues, it can be helpful to log the object being validated and the validation result.

```javascript
function debugValidation(composite) {
  console.log("Validating composite:", composite);

  const result = AccomplishmentValidator.validateComposite(composite);

  console.log("Validation result:", result);

  return result;
}
```

### 3. Handling Validation Errors

When validation fails, you should handle the errors appropriately based on the context.

```javascript
function handleValidationErrors(result, context) {
  if (!result.isValid) {
    switch (context) {
      case "form":
        displayErrorsToUser(result.errors);
        break;
      case "api":
        return {
          success: false,
          errors: result.errors,
        };
      case "internal":
        console.error("Validation errors:", result.errors);
        break;
    }
  }

  return result.isValid;
}
```

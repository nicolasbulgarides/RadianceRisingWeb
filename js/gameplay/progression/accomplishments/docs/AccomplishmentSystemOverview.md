# Accomplishment System

This directory contains the Accomplishment System, which is responsible for tracking player accomplishments across various game activities.

## Architecture

The system is built around the following key components:

1. **Data Structures**: Classes that define the structure of different types of accomplishment data.
2. **Emitters**: Classes that provide preset configurations for common accomplishment scenarios.
3. **Registry**: A central registry that manages all emitters and provides a unified interface.
4. **Utilities**: Helper classes for validation, conversion, and other common tasks.
5. **Manager**: The main manager class that tracks and retrieves accomplishments.
6. **UI Components**: Classes for displaying accomplishments to the player.

## Data Structures

The system includes the following data structures:

- **AccomplishmentDataComposite**: The main composite class that aggregates all specialized data structures.
- **AccomplishmentHeader**: Basic identification information for accomplishments.
- **AccomplishmentCombatData**: For combat outcome accomplishments (defeating enemies, bosses).
- **AccomplishmentQuestData**: For quest progress/completion accomplishments.
- **AccomplishmentExplorationData**: For exploration discovery accomplishments (new areas, landmarks).
- **AccomplishmentCraftingData**: For crafting activity accomplishments (items created, recipes mastered).
- **AccomplishmentCollectionData**: For collection completion accomplishments (item sets, collectibles).
- **AccomplishmentProgressionData**: For progression advancement accomplishments (levels, skills).
- **AccomplishmentAchievementData**: For achievement accomplishments (special feats, challenges).
- **AccomplishmentBasicMilestoneData**: For basic milestone accomplishments (time played, actions performed).
- **AccomplishmentAreaData**: For area/level completion accomplishments (clearing areas, challenges).
- **AccomplishmentLearnedData**: For learning abilities/spells/lore accomplishments.
- **AccomplishmentEventData**: For event participation/completion accomplishments (seasonal events).
- **AccomplishmentAcquiredObjectData**: For item acquisition accomplishments (rare items, equipment).
- **AccomplishmentCompetitiveData**: For PvP competition accomplishments (rankings, tournaments).
- **AccomplishmentStatusData**: For status effect accomplishments (reputation, faction standing).
- **AccomplishmentSocialData**: For social interaction accomplishments (guilds, friends, trading).
- **AccomplishmentPetData**: For pet-related accomplishments (taming, training, collection).
- **AccomplishmentAccountData**: For account milestone accomplishments (subscription, purchases).
- **AccomplishmentEconomyData**: For economic transaction accomplishments (wealth, trading).
- **AccomplishmentCustomizationData**: For customization accomplishments (character appearance, housing).
- **AccomplishmentTimeData**: For time-based accomplishments (daily activities, seasonal goals).
- **AccomplishmentChallengeData**: For challenge accomplishments (difficult feats, speedruns).
- **AccomplishmentDiscoveryData**: For discovery accomplishments (secrets, hidden content).
- **AccomplishmentLoreData**: For lore-related accomplishments (story progression, lore collection).
- **AccomplishmentMasteryData**: For mastery accomplishments (perfecting skills, complete mastery).

## Emitters

The system includes emitters for each category of accomplishment. Each emitter provides preset configurations for common accomplishment scenarios within its category. See the `AccomplishmentEmitterOverview.md` document and the `emitters` directory for details.

## Usage

To track an accomplishment:

1. Get the appropriate emitter from the registry
2. Create an accomplishment data object using a preset
3. Submit the data to the accomplishment manager

```javascript
// Get the registry
const registry = new AccomplishmentEmitterRegistry();

// Create an accomplishment data object
const accomplishmentData = registry.createFromPreset(
  "combat",
  "enemyDefeated",
  {
    enemyId: "goblin-123",
    enemyName: "Forest Goblin",
    enemyLevel: 5,
    playerLevel: 10,
    damageDealt: 150,
    timeToDefeat: 30,
  }
);

// Submit to the accomplishment manager
accomplishmentManager.trackAccomplishment(accomplishmentData);
```

## Utilities

The system includes the following utility classes:

- **AccomplishmentValidator**: For validating accomplishment data structures to ensure they meet the required format and contain all necessary fields.
- **AccomplishmentConverter**: For converting between different data formats (presets, composites, serializable objects).

See the dedicated documentation files for each utility class for more details:

- `AccomplishmentValidator.md`
- `AccomplishmentConverter.md`

## Manager

The `AccomplishmentManager` class is responsible for:

- Tracking new accomplishments
- Retrieving accomplishments by various criteria
- Persisting accomplishments to storage
- Loading accomplishments from storage
- Notifying listeners when new accomplishments are tracked

## UI Components

The `AccomplishmentDisplay` class provides UI components for:

- Displaying notifications for new accomplishments
- Showing a panel with all accomplishments
- Filtering and sorting accomplishments
- Displaying detailed information about accomplishments

## Integration

The system is designed to be integrated with various game systems. Game systems should:

1. Create an instance of the `AccomplishmentEmitterRegistry`
2. Use the registry to create accomplishment data objects
3. Submit these objects to the accomplishment manager
4. Create an instance of the `AccomplishmentDisplay` to show accomplishments to the player

## Best Practices

1. **Use Presets**: Whenever possible, use the provided presets rather than creating accomplishment data manually.
2. **Validate Data**: Always validate accomplishment data before submitting it to the accomplishment manager.
3. **Handle Errors**: Check the return values of methods and handle errors appropriately.
4. **Document Custom Presets**: When adding new presets, document their purpose and required data fields.
5. **Use Deep Copies**: When working with accomplishment data, use deep copies to prevent unintended modifications.
6. **Filter Duplicates**: Check for duplicate accomplishments before tracking to prevent redundancy.
7. **Batch Processing**: When loading or saving large numbers of accomplishments, process them in batches.
8. **Provide Feedback**: Always provide feedback to the player when they earn accomplishments.

## Extending the System

To add a new category of accomplishments:

1. Create a new data structure class
2. Create a new emitter class that extends `AccomplishmentEmitterBase`
3. Register the emitter with the registry
4. Update the `AccomplishmentDataComposite` class to include the new data structure
5. Update the `AccomplishmentConverter` class to handle the new category
6. Add appropriate validation rules to the `AccomplishmentValidator` class

```javascript
// Example of adding a new category
// 1. Create the data structure
class AccomplishmentNewCategoryData {
  constructor() {
    this.newCategoryField1 = "";
    this.newCategoryField2 = 0;
    this.newCategoryTimestamp = Date.now();
  }
}

// 2. Create the emitter
class NewCategoryEmitter extends AccomplishmentEmitterBase {
  getPreset(presetName) {
    // Implementation...
  }
}

// 3. Register with the registry
const registry = new AccomplishmentEmitterRegistry();
registry.registerEmitter("newCategory", new NewCategoryEmitter());
```

## Testing

The system includes a comprehensive test suite in the `tests` directory. Run these tests to verify that the system is working correctly after making changes.

See the `accomplishmentSystemTest.js` file for examples of how to test different aspects of the system.

# Accomplishment Emitter System

This directory contains the Accomplishment Emitter system, which is responsible for creating and managing accomplishment data objects in a standardized way across the game.

## Architecture

The system is built around the following key components:

1. **AccomplishmentEmitterBase**: The base class for all emitters, providing common functionality.
2. **Category-specific Emitters**: Specialized emitters for each category of accomplishment (combat, quest, exploration, etc.).
3. **AccomplishmentEmitterRegistry**: A registry that manages all emitters and provides a unified interface for creating accomplishment data.

## Available Emitters

The system includes the following emitters:

- **AccountEmitter**: For account milestone accomplishments (subscription, purchases)
- **AchievementEmitter**: For achievement accomplishments (special feats, challenges)
- **AcquiredObjectEmitter**: For item acquisition accomplishments (rare items, equipment)
- **AreaEmitter**: For area/level completion accomplishments (clearing areas, challenges)
- **BasicMilestoneEmitter**: For basic milestone accomplishments (time played, actions performed)
- **CollectionEmitter**: For collection completion accomplishments (item sets, collectibles)
- **CombatEmitter**: For combat-related accomplishments (defeating enemies, bosses, etc.)
- **CompetitiveEmitter**: For PvP competition accomplishments (rankings, tournaments)
- **CraftingEmitter**: For crafting activity accomplishments (items created, recipes mastered)
- **EconomyEmitter**: For economic transaction accomplishments (wealth, trading)
- **EventEmitter**: For event participation/completion accomplishments (seasonal events)
- **ExplorationEmitter**: For exploration discovery accomplishments (new areas, landmarks)
- **LearnedEmitter**: For learning abilities/spells/lore accomplishments
- **MinigameEmitter**: For minigame-related accomplishments (high scores, completion)
- **PetEmitter**: For pet-related accomplishments (taming, training, collection)
- **ProgressionEmitter**: For progression advancement accomplishments (levels, skills)
- **QuestEmitter**: For quest-related accomplishments (completing quests, quest milestones)
- **SocialEmitter**: For social interaction accomplishments (guilds, friends, trading)
- **StatusEmitter**: For status effect accomplishments (reputation, faction standing)
- **TechnicalEmitter**: For technical accomplishments (bug reporting, system usage)
- **UsageEmitter**: For usage-related accomplishments (feature usage, tool mastery)

## Usage

To use the system, you typically:

1. Create an instance of the `AccomplishmentEmitterRegistry`
2. Use the registry to create accomplishment data objects from presets
3. Submit these objects to the accomplishment manager for tracking

### Example

```javascript
// Create the registry
const registry = new AccomplishmentEmitterRegistry();

// Create an accomplishment data object using a preset
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

## Presets

Each emitter provides a set of presets for common accomplishment types. These presets include:

- Category and subcategory information
- Metadata (name, description)
- Default data values

You can override any default values by providing custom data when creating from a preset.

## Integration

The system is designed to be integrated with various game systems. See the `usageExample.js` file for examples of how to integrate with:

- Combat systems
- Quest systems
- And more

## Best Practices

1. **Use Presets**: Whenever possible, use the provided presets rather than creating accomplishment data manually.
2. **Extend for New Categories**: If you need a new category of accomplishments, create a new emitter that extends `AccomplishmentEmitterBase`.
3. **Register Custom Emitters**: Register any custom emitters with the registry to maintain a unified interface.
4. **Validate Data**: Always validate accomplishment data before submitting it to the accomplishment manager.
5. **Document Presets**: When adding new presets, document their purpose and required data fields.

## Extending the System

To add a new emitter:

1. Create a new class that extends `AccomplishmentEmitterBase`
2. Implement the `getPreset` method to provide presets for your accomplishment type
3. Register your emitter with the registry

```javascript
// Example of registering a custom emitter
const registry = new AccomplishmentEmitterRegistry();
registry.registerEmitter("myCustomCategory", new MyCustomEmitter());
```

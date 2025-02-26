/**
 * Test suite for the Accomplishment System
 * This file contains tests for the various components of the accomplishment system,
 * including emitters, validators, and converters.
 */

/**
 * Simple test runner
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  /**
   * Add a test to the runner
   * @param {string} name - Name of the test
   * @param {Function} testFn - Test function
   */
  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  /**
   * Run all tests
   */
  runTests() {
    console.log("Running tests...");

    this.tests.forEach((test) => {
      try {
        const result = test.testFn();
        if (result) {
          console.log(`✅ PASS: ${test.name}`);
          this.passedTests++;
        } else {
          console.log(`❌ FAIL: ${test.name}`);
          this.failedTests++;
        }
      } catch (error) {
        console.log(`❌ ERROR: ${test.name}`);
        console.error(error);
        this.failedTests++;
      }
    });

    console.log(
      `\nTest Results: ${this.passedTests} passed, ${this.failedTests} failed`
    );
  }
}

/**
 * Test suite for the Accomplishment System
 */
class AccomplishmentSystemTest {
  constructor() {
    this.runner = new TestRunner();
    this.setupTests();
  }

  /**
   * Set up all tests
   */
  setupTests() {
    // Registry tests
    this.runner.addTest(
      "Registry initialization",
      this.testRegistryInitialization.bind(this)
    );
    this.runner.addTest(
      "Registry emitter registration",
      this.testEmitterRegistration.bind(this)
    );
    this.runner.addTest(
      "Registry default emitters",
      this.testDefaultEmitters.bind(this)
    );

    // Emitter tests
    this.runner.addTest(
      "Combat emitter presets",
      this.testCombatEmitterPresets.bind(this)
    );
    this.runner.addTest(
      "Exploration emitter presets",
      this.testExplorationEmitterPresets.bind(this)
    );
    this.runner.addTest(
      "Quest emitter presets",
      this.testQuestEmitterPresets.bind(this)
    );

    // Validator tests
    this.runner.addTest(
      "Validator header validation",
      this.testHeaderValidation.bind(this)
    );
    this.runner.addTest(
      "Validator preset validation",
      this.testPresetValidation.bind(this)
    );
    this.runner.addTest(
      "Validator composite validation",
      this.testCompositeValidation.bind(this)
    );

    // Converter tests
    this.runner.addTest(
      "Converter preset to composite",
      this.testPresetToComposite.bind(this)
    );
    this.runner.addTest(
      "Converter serialization",
      this.testSerialization.bind(this)
    );
  }

  /**
   * Run all tests
   */
  runTests() {
    this.runner.runTests();
  }

  /**
   * Test registry initialization
   */
  testRegistryInitialization() {
    const registry = new AccomplishmentEmitterRegistry();
    return registry !== null && typeof registry === "object";
  }

  /**
   * Test emitter registration
   */
  testEmitterRegistration() {
    const registry = new AccomplishmentEmitterRegistry();

    // Create a mock emitter
    const mockEmitter = {
      getPreset: (presetName) => {
        return {
          category: "test",
          subCategory: "test",
          metaData: {
            nickName: "Test Preset",
            description: "A test preset",
          },
          defaultData: {},
        };
      },
      validatePreset: (preset) => true,
    };

    // Register the mock emitter
    const result = registry.registerEmitter("test", mockEmitter);

    // Check if the emitter was registered
    const emitter = registry.getEmitter("test");

    return result === true && emitter === mockEmitter;
  }

  /**
   * Test default emitters
   */
  testDefaultEmitters() {
    const registry = new AccomplishmentEmitterRegistry();
    registry.registerDefaultEmitters();

    // Check if some default emitters are registered
    const combatEmitter = registry.getEmitter("combat");
    const questEmitter = registry.getEmitter("quest");
    const explorationEmitter = registry.getEmitter("exploration");

    return (
      combatEmitter !== null &&
      questEmitter !== null &&
      explorationEmitter !== null
    );
  }

  /**
   * Test combat emitter presets
   */
  testCombatEmitterPresets() {
    const registry = new AccomplishmentEmitterRegistry();
    registry.registerDefaultEmitters();

    // Get the combat emitter
    const combatEmitter = registry.getEmitter("combat");

    // Check if the emitter has the expected presets
    const enemyDefeatedPreset = combatEmitter.getPreset("enemyDefeated");
    const bossDefeatedPreset = combatEmitter.getPreset("bossDefeated");

    return (
      enemyDefeatedPreset !== null &&
      bossDefeatedPreset !== null &&
      enemyDefeatedPreset.category === "combat" &&
      bossDefeatedPreset.category === "combat"
    );
  }

  /**
   * Test exploration emitter presets
   */
  testExplorationEmitterPresets() {
    const registry = new AccomplishmentEmitterRegistry();
    registry.registerDefaultEmitters();

    // Get the exploration emitter
    const explorationEmitter = registry.getEmitter("exploration");

    // Check if the emitter has the expected presets
    const areaDiscoveredPreset = explorationEmitter.getPreset("areaDiscovered");
    const landmarkDiscoveredPreset =
      explorationEmitter.getPreset("landmarkDiscovered");

    return (
      areaDiscoveredPreset !== null &&
      landmarkDiscoveredPreset !== null &&
      areaDiscoveredPreset.category === "exploration" &&
      landmarkDiscoveredPreset.category === "exploration"
    );
  }

  /**
   * Test quest emitter presets
   */
  testQuestEmitterPresets() {
    const registry = new AccomplishmentEmitterRegistry();
    registry.registerDefaultEmitters();

    // Get the quest emitter
    const questEmitter = registry.getEmitter("quest");

    // Check if the emitter has the expected presets
    const questCompletedPreset = questEmitter.getPreset("questCompleted");
    const questChainCompletedPreset = questEmitter.getPreset(
      "questChainCompleted"
    );

    return (
      questCompletedPreset !== null &&
      questChainCompletedPreset !== null &&
      questCompletedPreset.category === "quest" &&
      questChainCompletedPreset.category === "quest"
    );
  }

  /**
   * Test header validation
   */
  testHeaderValidation() {
    // Valid header
    const validHeader = {
      category: "test",
      subCategory: "test",
      metaData: {
        nickName: "Test Header",
        description: "A test header",
      },
    };

    // Invalid header (missing category)
    const invalidHeader1 = {
      subCategory: "test",
      metaData: {
        nickName: "Test Header",
        description: "A test header",
      },
    };

    // Invalid header (missing metadata)
    const invalidHeader2 = {
      category: "test",
      subCategory: "test",
    };

    // Invalid header (missing nickname in metadata)
    const invalidHeader3 = {
      category: "test",
      subCategory: "test",
      metaData: {
        description: "A test header",
      },
    };

    const validResult = AccomplishmentValidator.validateHeader(validHeader);
    const invalidResult1 =
      AccomplishmentValidator.validateHeader(invalidHeader1);
    const invalidResult2 =
      AccomplishmentValidator.validateHeader(invalidHeader2);
    const invalidResult3 =
      AccomplishmentValidator.validateHeader(invalidHeader3);

    return (
      validResult.isValid === true &&
      invalidResult1.isValid === false &&
      invalidResult2.isValid === false &&
      invalidResult3.isValid === false
    );
  }

  /**
   * Test preset validation
   */
  testPresetValidation() {
    // Valid preset
    const validPreset = {
      category: "test",
      subCategory: "test",
      metaData: {
        nickName: "Test Preset",
        description: "A test preset",
      },
      defaultData: {
        testField: "test",
      },
    };

    // Invalid preset (missing defaultData)
    const invalidPreset = {
      category: "test",
      subCategory: "test",
      metaData: {
        nickName: "Test Preset",
        description: "A test preset",
      },
    };

    const validResult = AccomplishmentValidator.validatePreset(validPreset);
    const invalidResult = AccomplishmentValidator.validatePreset(invalidPreset);

    return validResult.isValid === true && invalidResult.isValid === false;
  }

  /**
   * Test composite validation
   */
  testCompositeValidation() {
    // Valid composite
    const validComposite = {
      header: {
        category: "test",
        subCategory: "test",
        metaData: {
          nickName: "Test Composite",
          description: "A test composite",
        },
      },
      combatData: {
        idsOfDefeatedEntities: ["enemy-1"],
        idsOfVictorEntities: ["player-1"],
        combatEventLocation: "test-location",
        combatDifficulty: "normal",
        combatDuration: 60,
        combatRelevantValue: 10,
      },
    };

    // Invalid composite (missing header)
    const invalidComposite1 = {
      combatData: {
        idsOfDefeatedEntities: ["enemy-1"],
        idsOfVictorEntities: ["player-1"],
        combatEventLocation: "test-location",
        combatDifficulty: "normal",
        combatDuration: 60,
        combatRelevantValue: 10,
      },
    };

    // Invalid composite (missing data structures)
    const invalidComposite2 = {
      header: {
        category: "test",
        subCategory: "test",
        metaData: {
          nickName: "Test Composite",
          description: "A test composite",
        },
      },
    };

    const validResult =
      AccomplishmentValidator.validateComposite(validComposite);
    const invalidResult1 =
      AccomplishmentValidator.validateComposite(invalidComposite1);
    const invalidResult2 =
      AccomplishmentValidator.validateComposite(invalidComposite2);

    return (
      validResult.isValid === true &&
      invalidResult1.isValid === false &&
      invalidResult2.isValid === false
    );
  }

  /**
   * Test preset to composite conversion
   */
  testPresetToComposite() {
    // Create a preset
    const preset = {
      category: "combat",
      subCategory: "enemyDefeated",
      metaData: {
        nickName: "Enemy Defeated",
        description: "Defeat an enemy in combat",
      },
      defaultData: {
        idsOfDefeatedEntities: [],
        idsOfVictorEntities: [],
        combatEventLocation: "",
        combatDifficulty: "normal",
        combatDuration: 0,
        combatRelevantValue: 0,
      },
    };

    // Create custom data
    const customData = {
      idsOfDefeatedEntities: ["enemy-1"],
      idsOfVictorEntities: ["player-1"],
      combatEventLocation: "test-location",
      combatRelevantValue: 10,
    };

    // Convert preset to composite
    const composite = AccomplishmentConverter.presetToComposite(
      preset,
      customData
    );

    // Check if the composite has the expected structure
    return (
      composite !== null &&
      composite.header !== null &&
      composite.header.category === "combat" &&
      composite.combatData !== null &&
      composite.combatData.idsOfDefeatedEntities.includes("enemy-1") &&
      composite.combatData.combatDifficulty === "normal"
    );
  }

  /**
   * Test serialization
   */
  testSerialization() {
    // Create a composite
    const composite = {
      header: {
        category: "combat",
        subCategory: "enemyDefeated",
        metaData: {
          nickName: "Enemy Defeated",
          description: "Defeat an enemy in combat",
        },
      },
      combatData: {
        idsOfDefeatedEntities: ["enemy-1"],
        idsOfVictorEntities: ["player-1"],
        combatEventLocation: "test-location",
        combatDifficulty: "normal",
        combatDuration: 60,
        combatRelevantValue: 10,
      },
    };

    // Convert to serializable
    const serializable =
      AccomplishmentConverter.compositeToSerializable(composite);

    // Convert back to composite
    const deserializedComposite =
      AccomplishmentConverter.serializableToComposite(serializable);

    // Check if the deserialized composite matches the original
    return (
      deserializedComposite !== null &&
      deserializedComposite.header !== null &&
      deserializedComposite.header.category === "combat" &&
      deserializedComposite.combatData !== null &&
      deserializedComposite.combatData.idsOfDefeatedEntities.includes(
        "enemy-1"
      ) &&
      deserializedComposite.combatData.combatDifficulty === "normal"
    );
  }
}

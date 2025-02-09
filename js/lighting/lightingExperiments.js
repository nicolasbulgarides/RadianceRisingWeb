/**
 * LightingExperiments Class
 *
 * Facilitates experimental configurations in the lighting system.
 * Allows developers to quickly compare different lighting parameter combinations
 * before finalizing them into templates or presets.
 *
 * The class manages temporary experiment profiles and provides fallback values.
 * 
 * baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed

 */
class LightingExperiments {
  constructor(lightingManager) {
    this.lightingManager = lightingManager;
    this.test = 42;

    this.dontTouchInitializeValues();
    this.changeMeConfigureCurrentLightingExperiment(); ///<---Edit the stuff in this method to conduct expriments-
  }

  changeMeConfigureCurrentLightingExperiment() {
    //0 baseLightIntensity
    //1 baseLightIntensityAmplitude
    //2 baseHue
    //3 hueVariation
    //4 baseLightIntensitySpeed,
    //5 hueShiftSpeed


  }

  changeMeStoreNicolasExperimentsAll() {
    this.changeMeStoreNicolasExperimentsDemoA();
  }

  changeMeStoreNicolasExperimentsDemoA() {
    let colorShiftProfile = [0, 0, 0, 1, 15, 14,false,false,0,0];
    let archetypes = ["direction","direction","direction","direction"];
    let demoPath = this.observeThisExampleMotionProfileOneStaticLight(this.test);

    this.registerEntireEnvironmentExperimentOneArchetype(this.test, archetypes, colorShiftProfile, demoPath);
  }



  changeMeStoreFrancescaExperimentsAll() {

  }

  changeMeStoreFrancescaExperimentsDemo() {
  }





  observeThisExampleMotionProfileOneStaticLight(sampleId) {

    let parentId = "Parent: " + sampleId;
    let id = "Child: " + sampleId;
    let category = "static";
    let basePosition = new BABYLON.Vector3(0,0,0);
    let baseSpeed = new BABYLON.Vector3(0,0,0);
    let radiusOrDistance = new BABYLON.Vector3(0,0,0);
    let startRatio = 0;
    let doesLoop = false;
    let teleportOrReverse = "none";
    let onEndInteraction = "none";

    let motionProfile= new LightingMotionProfile(parentId, id, category, basePosition, baseSpeed, radiusOrDistance, startRatio, doesLoop, teleportOrReverse, onEndInteraction);

    return motionProfile;

  }
  observeThisExampleMotionProfileOneLinearLight(sampleId) {

    let parentId = "Parent-Linear: " + sampleId;
    let id = "Child-Linear: " + sampleId;
    let category = "linear";
    let basePosition = new BABYLON.Vector3(0,0,0);
    let baseSpeed = new BABYLON.Vector3(2,2,2);
    let radiusOrDistance = new BABYLON.Vector3(10,10,10);
    let startRatio = 0;
    let doesLoop = true;
    let teleportOrReverse = "reverse";
    let onEndInteraction = "none";

    let motionProfile= new LightingMotionProfile(parentId,id, category, basePosition, baseSpeed, radiusOrDistance, startRatio, doesLoop, teleportOrReverse, onEndInteraction);
    return motionProfile;
  }

  observeThisExampleMotionProfileOneOrbitalLight(sampleId) {
    let parentId = "Parent-Orbital: " + sampleId;
    let id = "Child-Orbital: " + sampleId;
    let category = "orbital";
    let basePosition = new BABYLON.Vector3(0,0,0);
    let baseSpeed = new BABYLON.Vector3(2,2,2);
    let radiusOrDistance = new BABYLON.Vector3(5,5,5);
    let startRatio = 0;
    let doesLoop = true;
    let teleportOrReverse = "reverse";
    let onEndInteraction = "none";

    let motionProfile= new LightingMotionProfile(parentId, id, category, basePosition, baseSpeed, radiusOrDistance, startRatio, doesLoop, teleportOrReverse, onEndInteraction);
    return motionProfile;
  }


  
 convertSingleExperimentIdToValidEnvironmentTemplateBag(experimentIdToCheck) {



  let archetypeProfile = this.experimentEnvironmentLightArchetypeProfiles[experimentIdToCheck];

  let archetypeLightTotal = archetypeProfile.length;

  if (archetypeProfile !== null) {

    let colorProfile = this.experimentEnvironmentLightColorShiftProfiles[experimentIdToCheck];
    let motionProfileDirection = this.experimentEnvironmentLightDirectionLightMotionProfiles[experimentIdToCheck];
    let motionProfilePosition = this.experimentEnvironmentLightPositionLightMotionProfiles[experimentIdToCheck];

    if (motionProfileDirection === null) {

        LoggerOmega.SmartLogger(true, "Motion Profile Direction is null", " Bag archetype status msg");

    } else if (motionProfilePosition === null) {

      LoggerOmega.SmartLogger(true, "Motion Profile Position is null", " Bag archetype status msg");
    }

    let colorPresetsPulled = [];
    let motionPresetsPulled = [];
    
    if (archetypeProfile !== null && colorProfile !== null && (motionProfileDirection !== null || motionProfilePosition !== null)) {
  
      LoggerOmega.SmartLogger(true, "Archetype Profile type:   " + typeof archetypeProfile, " Bag archetype  array status");
      let counter = 0;
  
      while (counter < archetypeLightTotal) {
  
        colorPresetsPulled.push(this.experimentEnvironmentLightColorShiftProfiles[experimentIdToCheck]);
  
        if (archetypeProfile[counter] == "direction") {
          motionPresetsPulled.push(this.experimentEnvironmentLightDirectionLightMotionProfiles[experimentIdToCheck]);
        }
        else if (archetypeProfile[counter] == "position") {
          motionPresetsPulled.push(this.experimentEnvironmentLightPositionLightMotionProfiles[experimentIdToCheck]);
        }
  
        counter++;
      }
  
      LoggerOmega.SmartLogger(true, "Intenal count: " + archetypeLightTotal, " Bag archetype profile count");

      let compositeTemplateBag = new EnvironmentLightingTemplateBag(archetypeLightTotal, archetypeProfile, colorPresetsPulled, motionPresetsPulled);
      return compositeTemplateBag;  
    }
  
    else {
      let statusMsg = `Lighting Experiment Debug [ID ${experimentIdToCheck}]: ` +
      `archetypeProfile: ${archetypeProfile ? "OK" : "Missing"}, ` +
      `colorProfile: ${colorProfile ? "OK" : "Missing"}, ` +
      `motionProfileDirection: ${motionProfileDirection ? "OK" : "Missing"}, ` +
      `motionProfilePosition: ${motionProfilePosition ? "OK" : "Missing"}`;
  
      LoggerOmega.SmartLogger(true, "Count Failed: " + archetypeProfile.length, " Bag archetype profile count");
      LoggerOmega.SmartLogger(true, statusMsg, " Bag archetype status msg");
  
      return null;
    }
  } else {
    LoggerOmega.SmartLogger(true, "Archetype Profile is null", " Bag archetype status msg");

  }

}


registerEntireEnvironmentExperimentOneArchetype(experimentId, archetypePreset, colorPreset, motionPreset) {
  LoggerOmega.SmartLogger(true, ("Checked for archetype preset: " + archetypePreset[0]), "Bag archetype status check A");

  this.registerExperimentalEnvironmentArchetypePreset(experimentId, archetypePreset);

  this.registerExperimentalEnvironmentColorPreset(experimentId, colorPreset);

  if (archetypePreset[0] === "position") {
    this.registerExperimentalEnvironmentPositionLightMotionPreset(experimentId, motionPreset);
  }
  else if (archetypePreset[0] === "direction") {
    this.registerExperimentalEnvironmentDirectionLightMotionPreset(experimentId, motionPreset);
  }
}


  registerExperimentalPlayerArchetypePreset(experimentId, archetypePreset) {
    this.experimentPlayerLightArchetypeProfiles[experimentId] = archetypePreset;
    LoggerOmega.SmartLogger(true, ("Checked for archetype preset: " + archetypePreset[0]), "Bag archetype status check B");

  }
  registerExperimentalPlayerPositionLightMotionPreset(experimentId, motionPreset) {
    this.experimentPlayerLightPositionLightMotionProfiles[experimentId] = motionPreset;
  }
  registerExperimentalPlayerDirectionLightMotionPreset(experimentId, motionPreset) {
    this.experimentPlayerLightDirectionLightMotionProfiles[experimentId] = motionPreset;
  }
  registerExperimentalPlayerColorPreset(experimentId, colorPreset) {
    this.experimentPlayerLightColorShiftProfiles[experimentId] = colorPreset;
  }

    //<===============================End of Player presets and registration utilities

  /**
   * Loads various experimental lighting configurations.
   * Developers can extend this method with additional experiment profiles.
   */
  dontTouchLoadVariousExperimentProfiles() {

    this.changeMeStoreFrancescaExperimentsAll();
    this.changeMeStoreNicolasExperimentsAll();
  }

  /**
   * Loads a blank placeholder experiment profile.
   */
  dontTouchloadBlankPlaceholderValuesComposite() {

    this.dontTouchloadBlankArchetypeValues();
    this.dontTouchloadBlankColorValues();
    
    let defaultEnvironmentDirectionMotionBag = this.lightingManager.lightingFactory.lightingMotionPresets.getDirectionLightMotionPresetByName("default");

    this.experimentEnvironmentLightDirectionLightMotionProfiles[0] = defaultEnvironmentDirectionMotionBag;
    this.experimentEnvironmentLightDirectionLightMotionProfiles[-1] = defaultEnvironmentDirectionMotionBag;

    let defaultEnvironmentPositionMotionBag = this.lightingManager.lightingFactory.lightingMotionPresets.getPositionLightMotionPresetByName("default");
    this.experimentEnvironmentLightPositionLightMotionProfiles[0] = defaultEnvironmentPositionMotionBag;
    this.experimentEnvironmentLightPositionLightMotionProfiles[-1] = defaultEnvironmentPositionMotionBag;
  }
  
  dontTouchloadBlankArchetypeValues() {

    let defaultExperimentEnvironmentArchetypes = ["direction", "direction", "direction", "direction"];

    this.experimentEnvironmentLightArchetypeProfiles[0] = defaultExperimentEnvironmentArchetypes;
    this.experimentEnvironmentLightArchetypeProfiles[-1] = defaultExperimentEnvironmentArchetypes;

    let defaultPlayerArchetype = ["position"];

    this.experimentPlayerLightArchetypeProfiles[0] = defaultPlayerArchetype;
    this.experimentPlayerLightArchetypeProfiles[-1] = defaultPlayerArchetype;

  }
  dontTouchloadBlankColorValues() {
    let defaultColorShiftValues = [0, 0, 0, 0, 0, 0];

    this.experimentPlayerLightColorShiftProfiles[0] = defaultColorShiftValues;
    this.experimentPlayerLightColorShiftProfiles[-1] = defaultColorShiftValues;
    this.experimentEnvironmentLightColorShiftProfiles[0] = defaultColorShiftValues;
    this.experimentEnvironmentLightColorShiftProfiles[-1] = defaultColorShiftValues;
  }
  dontTouchInitializeValues() {
    this.experimentEnvironmentLightArchetypeProfiles = {};
    this.experimentEnvironmentLightColorShiftProfiles = {};
    this.experimentEnvironmentLightDirectionLightMotionProfiles = {};
    this.experimentEnvironmentLightPositionLightMotionProfiles = {};

    this.experimentPlayerLightArchetypeProfiles = {};
    this.experimentPlayerLightColorShiftProfiles = {};
    this.experimentPlayerLightDirectionLightMotionProfiles = {};
    this.experimentPlayerLightPositionLightMotionProfiles = {};

    this.dontTouchloadBlankPlaceholderValuesComposite();
    this.dontTouchLoadVariousExperimentProfiles();
}

registerExperimentalEnvironmentArchetypePreset(experimentId, archetypePreset) {
  LoggerOmega.SmartLogger(true, "Registered experiemnt id: " + experimentId, "Registered experiemnt id testing B");


  this.experimentEnvironmentLightArchetypeProfiles[experimentId] = archetypePreset;

}
registerExperimentalEnvironmentDirectionLightMotionPreset(experimentId, motionPreset) {
  this.experimentEnvironmentLightDirectionLightMotionProfiles[experimentId] = motionPreset;
}
registerExperimentalEnvironmentPositionLightMotionPreset(experimentId, motionPreset) {
  this.experimentEnvironmentLightPositionLightMotionProfiles[experimentId] = motionPreset;
}
registerExperimentalEnvironmentColorPreset(experimentId, colorPreset) {
  this.experimentEnvironmentLightColorShiftProfiles[experimentId] = colorPreset;
}

}

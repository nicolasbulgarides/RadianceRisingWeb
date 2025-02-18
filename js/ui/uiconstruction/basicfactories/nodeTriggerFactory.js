/**
 * SpecialTriggerAssigner
 *
 * Provides a standardized method to assign event observables with custom triggers, function retrieval,
 * parameter selection, and optional sound effects.
 */
class SpecialTriggerAssigner {
  /**
   * Attaches the appropriate event observable to a UI element.
   *
   * @param {string} specialTriggerType - The type of trigger (e.g., "onClick", "onMouseOver", etc.).
   * @param {function} functionToPassIn - The function to execute when triggered.
   * @param {any} parameterToPassIn - The default parameter for the function.
   * @param {boolean} hasSpecialFunction - Whether a special function should be retrieved instead.
   * @param {string} specialFunctionOrganizationGroup - The group in which the special function exists.
   * @param {string} specialTriggerID - The ID used to retrieve the special function.
   * @param {boolean} usesDefaultParameter - Whether to use the original parameter or retrieve a new one.
   * @param {string} soundEffectNickname - A sound effect to play when the trigger fires.
   * @param {BABYLON.GUI.Control} uiElement - The Babylon.js UI element to which the observable is attached.
   */
  static assignTrigger(
    specialTriggerType,
    functionToPassIn,
    parameterToPassIn,
    hasSpecialFunction,
    specialFunctionOrganizationGroup,
    specialFunctionValueID,
    usesDefaultParameter,
    soundEffectNickname,
    uiElement
  ) {
    // Determine the correct function to use
    let finalFunctionToUse = this.determineFinalFunctionToUse(
      functionToPassIn,
      hasSpecialFunction,
      specialFunctionOrganizationGroup,
      specialFunctionValueID
    );

    let finalParameter = this.determineFinalParameterToUse(
      parameterToPassIn,
      usesDefaultParameter,
      specialFunctionOrganizationGroup,
      specialFunctionValueID
    );
    // Determine the correct parameter

    if (finalFunctionToUse != null && finalParameter != null) {
      this.assignSpecificCallback(
        specialTriggerType,
        finalFunctionToUse,
        finalParameter,
        soundEffectNickname,
        uiElement
      );
    }
  }
  static determineFinalFunctionToUse(
    functionToPassIn,
    hasSpecialFunction,
    specialFunctionOrganizationGroup,
    specialFunctionValueID
  ) {
    if (hasSpecialFunction) {
      return SpecialUIFunctionAssigner.getSpecialUIFunction(
        specialFunctionOrganizationGroup,
        specialFunctionValueID
      );
    } else if (typeof functionToPassIn === "function") {
      return functionToPassIn;
    }
    return null;
  }

  static finalFunctionAndSoundEffect(
    finalFunctionToUse,
    finalParameter,
    soundEffectNickname
  ) {
    if (soundEffectNickname != "") {
      SoundEffectsManager.playSound(soundEffectNickname);
    }

    finalFunctionToUse(finalParameter);
  }

  static determineFinalParameterToUse(
    parameterToPassIn,
    usesDefaultParameter,
    specialFunctionOrganizationGroup,
    specialFunctionValueID
  ) {
    if (usesDefaultParameter) {
      return parameterToPassIn;
    } else {
      return SpecialUIParameterAssigner.getSpecialParameterComposite(
        specialFunctionOrganizationGroup,
        specialFunctionValueID
      );
    }
  }
  static assignSpecificCallback(
    specialTriggerType,
    finalFunctionToUse,
    finalParameter,
    soundEffectNickname,
    uiElement
  ) {
    // Attach the appropriate event observable based on specialTriggerType
    switch (specialTriggerType) {
      case "onClick":
        uiElement.onPointerUpObservable.add(
          this.finalFunctionAndSoundEffect(
            () => finalFunctionToUse,
            finalParameter,
            soundEffectNickname
          )
        );
        break;
      case "onMouseOver":
        uiElement.onPointerEnterObservable.add(
          this.finalFunctionAndSoundEffect(
            () => finalFunctionToUse,
            finalParameter,
            soundEffectNickname
          )
        );
        break;
      case "onMouseExit":
        uiElement.onPointerOutObservable.add(
          this.finalFunctionAndSoundEffect(
            () => finalFunctionToUse,
            finalParameter,
            soundEffectNickname
          )
        );
        break;
      case "onPointerDown":
        uiElement.onPointerDownObservable.add(
          this.finalFunctionAndSoundEffect(
            () => finalFunctionToUse,
            finalParameter,
            soundEffectNickname
          )
        );
        break;
      case "onPointerUp":
        uiElement.onPointerUpObservable.add(() =>
          this.finalFunctionAndSoundEffect(
            finalFunctionToUse,
            finalParameter,
            soundEffectNickname
          )
        );
        break;
      default:
        break;
    }
  }
}

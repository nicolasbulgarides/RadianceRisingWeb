class PlayerSaveSettings {
  static GAME_LANGUAGE = "en";
  static NOTIFICATIONS_ENABLED = false;
  static NOTIFICATIONS_SOUND_ENABLED = false;
  static HINT_FREQUENCY = Config.DEFAULT_HINT_FREQUENCY;

  static MUSIC_ENABLED = true;
  static MUSIC_VOLUME = 1;
  static SOUND_EFFECTS_ENABLED = true;
  static SOUND_EFFECTS_VOLUME = 1;

  static COLOR_BLIND_MODE_ENABLED = false;
  static HIGH_CONTRAST_MODE_ENABLED = false;

  static REPORT_ANALYTICS_ENABLED = false;
  static REPORT_BUG_ENABLED = false;

  constructor() {}

  loadPlayerSaveSettingsFromJson(playerSettingsJSON) {}
}

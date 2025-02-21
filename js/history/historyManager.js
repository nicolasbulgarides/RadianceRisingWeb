// Manages the collection and organization of history entries.
// Provides methods to add, retrieve, and serialize history data.
class HistoryManager {
  constructor() {
    this.allHistoryEntries = []; // Array to store all history entries.
    this.specificHistoryGroupAndEntryMap = new Map(); // Map to store history entries by group key.
  }

  // Adds a new history group with the specified key and entries.
  addNewHistoryGroup(groupKey, historyEntryCompositeArray) {
    this.specificHistoryGroupAndEntryMap.set(
      groupKey,
      historyEntryCompositeArray
    );
  }

  // Adds a history entry to a specific group identified by the group key.
  addHistoryEntryToSpecificGroup(groupKey, historyEntryComposite) {
    // Check if the group exists; if not, create a new group array.
    let historyGroup = this.specificHistoryGroupAndEntryMap.get(groupKey);
    if (!historyGroup) {
      historyGroup = [];
      this.specificHistoryGroupAndEntryMap.set(groupKey, historyGroup);
    }
    // Add the new entry to the group's array.
    historyGroup.push(historyEntryComposite);
  }

  // Adds a history entry to the array of all history entries.
  addHistoryEntryToAllHistoryEntries(entry) {
    // You can add logic to validate or group similar actions here.
    this.allHistoryEntries.push(entry);
  }

  // Adds a history entry to both the specific group and the primary array of all entries.
  addHistoryEntryToGroupAndPrimaryArray(groupKey, historyEntryComposite) {
    this.addHistoryEntryToAllHistoryEntries(historyEntryComposite);
    this.addHistoryEntryToSpecificGroup(groupKey, historyEntryComposite);
  }

  // Retrieves all history entries.
  getAllHistoryEntries() {
    return this.allHistoryEntries;
  }

  // Retrieves a history group by its key.
  getHistoryGroup(groupKey) {
    return this.specificHistoryGroupAndEntryMap.get(groupKey) || [];
  }

  // Serializes the history entries to JSON for saving or network transmission.
  serialize() {
    return JSON.stringify(this.allHistoryEntries);
  }

  // Deserializes JSON string to restore history entries.
  // Implement and verify that it works.
  deserialize(jsonString) {
    // Implement deserialization logic here.
  }
}

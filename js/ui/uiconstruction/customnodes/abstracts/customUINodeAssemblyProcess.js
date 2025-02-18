/**
 * Abstract class representing the assembly process for custom UI nodes.
 * This base class outlines the steps required to transform a UI node schematic
 * (which creates the initial layout) into a fully formed UI node template that
 * can later receive dynamic data (e.g., updates to icons, values, etc.).
 *
 * This class is intended to be extended by specific assembly process implementations.
 */
class CustomUINodeAssemblyProcess {
  constructor() {
    // Initialize any common assembly process resources or state here.
  }

  /**
   * Starts the assembly process.
   * Derived classes must override this function to implement specific assembly logic.
   */
  startAssembly() {
    throw new Error("startAssembly() must be implemented by subclass");
  }
}

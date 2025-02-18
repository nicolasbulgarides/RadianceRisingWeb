/**
 * Device Orientation Permission Handler
 *
 * This code handles device orientation permissions for iOS 13+ devices.
 * It creates a floating button to request permission to access DeviceOrientation events.
 * Uncomment the code below to enable the permission prompt.
 */

/*
window.addEventListener("load", requestDeviceOrientationPermission);

// Function to request device orientation permission on compatible devices (e.g., iOS 13+)
function requestDeviceOrientationPermission() {
  // Check if DeviceOrientationEvent exists and supports permission request
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // Create a button for the user to grant permission
    const permissionButton = document.createElement("button");
    permissionButton.innerHTML = "Enable Device Orientation";
    permissionButton.style.position = "absolute";
    permissionButton.style.top = "50%";
    permissionButton.style.left = "50%";
    permissionButton.style.transform = "translate(-50%, -50%)";
    permissionButton.style.padding = "20px";
    permissionButton.style.fontSize = "16px";
    document.body.appendChild(permissionButton);

    // Add click event to request permission
    permissionButton.addEventListener("click", function () {
      DeviceOrientationEvent.requestPermission()
        .then(function (response) {
          if (response === "granted") {
            // Remove the button on successful permission grant
            permissionButton.remove();
          } else {
            alert("Device Orientation permission denied.");
          }
        })
        .catch(function (error) {
          console.error("Device Orientation permission error:", error);
        });
    });
  }
}
*/

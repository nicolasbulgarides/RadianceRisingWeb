/**
      window.addEventListener("load", requestDeviceOrientationPermission);

      
      // Handle device orientation permissions (especially for iOS 13+)
      function requestDeviceOrientationPermission() {
        // Check if the DeviceOrientationEvent is available
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          // iOS 13+ devices require permission
          const permissionButton = document.createElement("button");
          permissionButton.innerHTML = "Enable Device Orientation";
          permissionButton.style.position = "absolute";
          permissionButton.style.top = "50%";
          permissionButton.style.left = "50%";
          permissionButton.style.transform = "translate(-50%, -50%)";
          permissionButton.style.padding = "20px";
          permissionButton.style.fontSize = "16px";
          document.body.appendChild(permissionButton);

          permissionButton.addEventListener("click", function () {
            DeviceOrientationEvent.requestPermission()
              .then(function (response) {
                if (response === "granted") {
                  // Remove the permission button
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

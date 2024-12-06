chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startSelection") {
    initiateBlurSelection();
  }
});

function initiateBlurSelection() {
  // Create the overlay for selection
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.cursor = "crosshair";
  overlay.style.zIndex = "10000";
  document.body.appendChild(overlay);

  let startX, startY, endX, endY;
  const selectionBox = document.createElement("div");
  selectionBox.style.position = "absolute";
  selectionBox.style.border = "2px dashed #fff";
  selectionBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  selectionBox.style.pointerEvents = "none";
  overlay.appendChild(selectionBox);

  overlay.addEventListener("mousedown", (e) => {
    startX = e.clientX + window.scrollX; // Adjust for page scroll
    startY = e.clientY + window.scrollY; // Adjust for page scroll
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = "0";
    selectionBox.style.height = "0";
  });

  overlay.addEventListener("mousemove", (e) => {
    if (startX !== undefined && startY !== undefined) {
      endX = e.clientX + window.scrollX; // Adjust for page scroll
      endY = e.clientY + window.scrollY; // Adjust for page scroll
      selectionBox.style.left = `${Math.min(startX, endX) - window.scrollX}px`;
      selectionBox.style.top = `${Math.min(startY, endY) - window.scrollY}px`;
      selectionBox.style.width = `${Math.abs(endX - startX)}px`;
      selectionBox.style.height = `${Math.abs(endY - startY)}px`;
    }
  });

  overlay.addEventListener("mouseup", () => {
    const selectedArea = {
      left: Math.min(startX, endX),
      top: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    applyBlur(selectedArea);

    // Remove overlay and selection box
    overlay.remove();
    addUnblurButton();
  });
}

function applyBlur(area) {
  const blurDiv = document.createElement("div");
  blurDiv.style.position = "absolute";
  blurDiv.style.top = `${area.top}px`;
  blurDiv.style.left = `${area.left}px`;
  blurDiv.style.width = `${area.width}px`;
  blurDiv.style.height = `${area.height}px`;
  blurDiv.style.filter = "blur(10px)";
  blurDiv.style.backdropFilter = "blur(10px)";
  blurDiv.style.pointerEvents = "none";
  blurDiv.style.zIndex = "10001"; // Above the selection overlay
  document.body.appendChild(blurDiv);
  blurDiv.id = "blur-effect"; // Add ID for easy removal
}

function addUnblurButton() {
  const button = document.createElement("button");
  button.textContent = "Unblur";
  button.style.position = "fixed";
  button.style.top = "20px";
  button.style.right = "20px";
  button.style.zIndex = "10002";
  button.style.padding = "10px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.borderRadius = "5px";
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    removeBlur();
    button.remove(); // Remove the button itself
  });
}

function removeBlur() {
  const blurDiv = document.getElementById("blur-effect");
  if (blurDiv) {
    blurDiv.remove();
  }
}

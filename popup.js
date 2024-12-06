document.getElementById("start-blur").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab) {
    // Inject the content script if not already injected
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    // Send a message to start the blur selection
    chrome.tabs.sendMessage(tab.id, { action: "startSelection" });
  }
});

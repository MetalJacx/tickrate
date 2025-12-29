import { serializeState } from "./util.js";
import { addLog } from "./util.js";

export function initSettings({ onShowSettings, onHideSettings }) {
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const settingsCloseBtn = document.getElementById("settingsCloseBtn");
  const settingsContent = document.getElementById("settingsContent");

  function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = isError ? "error" : "";
    toast.style.display = "block";
    toast.style.animation = "slideIn 0.3s ease-out";
    
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => {
        toast.style.display = "none";
      }, 300);
    }, 3000);
  }

  function openSettings() {
    settingsModal.style.display = "block";
    renderSettings();
    if (onShowSettings) onShowSettings();
  }

  function closeSettings() {
    settingsModal.style.display = "none";
    if (onHideSettings) onHideSettings();
  }

  function renderSettings() {
    settingsContent.innerHTML = "";

    // Export Save
    const exportDiv = document.createElement("div");
    exportDiv.style.cssText = "border: 1px solid #333; border-radius: 6px; padding: 10px; background: #202020;";
    const exportLabel = document.createElement("div");
    exportLabel.textContent = "Export Save";
    exportLabel.style.cssText = "font-size: 12px; font-weight: bold; margin-bottom: 6px; color: #aaa;";
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Copy to Clipboard";
    exportBtn.style.cssText = "width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #555; background: #444; color: #eee; cursor: pointer; font-size: 12px;";
    
    exportBtn.addEventListener("click", () => {
      try {
        const json = JSON.stringify(serializeState(), null, 2);
        navigator.clipboard.writeText(json).then(() => {
          showToast("✓ Save exported to clipboard!");
          addLog("Save exported to clipboard! Paste it somewhere safe.", "gold");
        }).catch(() => {
          prompt("Copy this save data:", json);
          showToast("Save data shown in prompt");
        });
      } catch (e) {
        showToast("Export failed: " + e.message, true);
        addLog("Export failed: " + e.message, "damage_taken");
      }
    });

    exportDiv.appendChild(exportLabel);
    exportDiv.appendChild(exportBtn);
    settingsContent.appendChild(exportDiv);

    // Import Save
    const importDiv = document.createElement("div");
    importDiv.style.cssText = "border: 1px solid #333; border-radius: 6px; padding: 10px; background: #202020;";
    const importLabel = document.createElement("div");
    importLabel.textContent = "Import Save";
    importLabel.style.cssText = "font-size: 12px; font-weight: bold; margin-bottom: 6px; color: #aaa;";
    const importBtn = document.createElement("button");
    importBtn.textContent = "Paste from Clipboard";
    importBtn.style.cssText = "width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #555; background: #444; color: #eee; cursor: pointer; font-size: 12px;";
    
    importBtn.addEventListener("click", () => {
      const json = prompt("Paste your save data here:");
      if (!json) return;
      try {
        const data = JSON.parse(json);
        if (!data.accountName || data.zone === undefined) {
          throw new Error("Invalid save format");
        }
        // Import is handled by main.js via callback or direct state assignment
        // For now, we'll just show the prompt path
        showToast("Import feature coming soon", true);
      } catch (e) {
        showToast("Import failed: " + e.message, true);
      }
    });

    importDiv.appendChild(importLabel);
    importDiv.appendChild(importBtn);
    settingsContent.appendChild(importDiv);

    // Divider
    const divider = document.createElement("div");
    divider.style.cssText = "border-top: 1px solid #333; margin: 10px 0;";
    settingsContent.appendChild(divider);

    // Additional settings can go here
    const placeholderDiv = document.createElement("div");
    placeholderDiv.style.cssText = "color: #aaa; font-size: 12px; text-align: center;";
    placeholderDiv.textContent = "More settings coming soon...";
    settingsContent.appendChild(placeholderDiv);
  }

  // Wire up button events
  settingsBtn.addEventListener("click", openSettings);
  settingsCloseBtn.addEventListener("click", closeSettings);
  
  // Close modal when clicking outside
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      closeSettings();
    }
  });
}

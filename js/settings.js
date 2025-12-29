import { serializeState } from "./util.js";
import { addLog } from "./util.js";

// Simple CRC32 implementation for tamper detection
function crc32(str) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ ((crc ^ str.charCodeAt(i)) & 0xFF);
    for (let k = 0; k < 8; k++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  return (crc ^ (-1)) >>> 0;
}

function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str) {
  return decodeURIComponent(escape(atob(str)));
}

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
    exportBtn.textContent = "Download Save File";
    exportBtn.style.cssText = "width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #555; background: #444; color: #eee; cursor: pointer; font-size: 12px;";
    
    exportBtn.addEventListener("click", () => {
      try {
        const json = JSON.stringify(serializeState(), null, 2);
        const checksum = crc32(json).toString(16).padStart(8, '0');
        const encoded = base64Encode(json);
        const saveData = checksum + "|" + encoded;
        
        // Create blob and download
        const blob = new Blob([saveData], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `tickrate-save-${Date.now()}.save`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast("✓ Save downloaded!");
        addLog("Save file downloaded. Keep it safe!", "gold");
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
    importBtn.textContent = "Upload Save File";
    importBtn.style.cssText = "width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #555; background: #444; color: #eee; cursor: pointer; font-size: 12px;";
    
    importBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".save";
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const saveData = event.target.result;
            const [checksum, encoded] = saveData.split("|");
            
            if (!checksum || !encoded) {
              throw new Error("Invalid save file format");
            }
            
            const json = base64Decode(encoded);
            const data = JSON.parse(json);
            
            // Validate checksum
            const expectedChecksum = crc32(json).toString(16).padStart(8, '0');
            if (checksum !== expectedChecksum) {
              throw new Error("Save file has been tampered with!");
            }
            
            // Validate basic structure
            if (!data.accountName || data.zone === undefined) {
              throw new Error("Invalid save format");
            }
            
            // Import callback would go here - for now we'll just notify
            showToast("✓ Save validated! Reload to import.", false);
            addLog("Save file loaded and verified. Reload the page to import.", "gold");
            
            // Store temporarily in sessionStorage for reload
            sessionStorage.setItem("pendingImport", json);
          } catch (e) {
            showToast("Import failed: " + e.message, true);
            addLog("Import failed: " + e.message, "damage_taken");
          }
        };
        reader.readAsText(file);
      });
      input.click();
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

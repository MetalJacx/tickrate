// Inventory Slot Unlock System Constants
const INVENTORY_MAX_SLOTS = 100;
const CHARACTER_TIER_SLOTS = 10;
const CHARACTER_TIERS_MAX = 5; // first 5 characters contribute
const PAID_SLOT_START_INDEX = CHARACTER_TIERS_MAX * CHARACTER_TIER_SLOTS; // 50
const PAID_SLOTS_MAX = INVENTORY_MAX_SLOTS - PAID_SLOT_START_INDEX; // 50

// Account State
let state = {
    account: {
        inventoryPaidSlotsUnlocked: 0, // how many paid slots are unlocked beyond the character-based 50
        // premiumUnlocks: { inventorySlots: number } // optional for IAP
    }
};

// Derived Values
function getTotalUnlockedSlots(characterCount) {
    const characterUnlockedSlots = Math.min(characterCount, CHARACTER_TIERS_MAX) * CHARACTER_TIER_SLOTS;
    const paidUnlockedSlots = state.account.inventoryPaidSlotsUnlocked;
    return Math.min(characterUnlockedSlots + paidUnlockedSlots, INVENTORY_MAX_SLOTS);
}

// Function to calculate paid unlocks
function getNextPaidBundleSize() {
    return 10; // Fixed bundle size
}

function getPaidBundlePrice(bundleIndex) {
    return 1000 * (bundleIndex + 1) ** 2; // Example pricing model
}

// Function to grant inventory slots
function grantInventorySlots(count) {
    state.account.inventoryPaidSlotsUnlocked = Math.min(state.account.inventoryPaidSlotsUnlocked + count, PAID_SLOTS_MAX);
    // Persist state if necessary
}

// Function to determine character count
function getCharacterCount() {
    // This function should return the number of created heroes on the account
    // For now, we will return a placeholder value
    return 5; // Placeholder for testing
}

// Function to render inventory
function renderInventory() {
    const totalUnlockedSlots = getTotalUnlockedSlots(getCharacterCount());
    const inventoryContainer = document.getElementById('inventoryContainer');
    inventoryContainer.innerHTML = ''; // Clear existing slots

    for (let i = 0; i < INVENTORY_MAX_SLOTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        if (i < totalUnlockedSlots) {
            slot.classList.add('unlocked');
            // Render item or empty
        } else {
            slot.classList.add('locked');
            // Set overlay text
            const overlayText = document.createElement('span');
            if (i < PAID_SLOT_START_INDEX) {
                const tier = Math.floor(i / CHARACTER_TIER_SLOTS) + 1;
                overlayText.textContent = `Unlocked with character #${tier}`;
            } else {
                overlayText.textContent = 'Unlock with gold or purchase';
            }
            slot.appendChild(overlayText);
        }
        inventoryContainer.appendChild(slot);
    }
}

// CSS for inventory slots
const style = document.createElement('style');
style.textContent = `
.inventory-slot {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
    display: inline-block;
    position: relative;
}

.inventory-slot.locked {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.inventory-slot.unlocked {
    background-color: #fff;
}

.inventory-slot span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #000;
    font-weight: bold;
}
`;
document.head.appendChild(style);

// Call renderInventory on page load
window.onload = function() {
    renderInventory();
};
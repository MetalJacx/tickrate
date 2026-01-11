/**
 * specIcons.js — UI-only specialization icons for magic skills
 * Provides human-readable labels and inline SVG icons for each magic specialization.
 * No gameplay logic; purely for rendering in the stat modal.
 */

export const SPEC_LABEL = {
  destruction: "Destruction",
  restoration: "Restoration",
  control: "Control",
  enhancement: "Enhancement",
  summoning: "Summoning",
  utility: "Utility"
};

export const SPEC_ICON_SVG = {
  destruction: `<svg viewBox="0 0 16 16" class="specIcon spec-destruction" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
      <path d="M 8 2 L 10 6 L 14 7 L 11 10 L 11.5 14 L 8 11.5 L 4.5 14 L 5 10 L 2 7 L 6 6 Z"/>
    </g>
  </svg>`,
  
  restoration: `<svg viewBox="0 0 16 16" class="specIcon spec-restoration" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
      <path d="M 8 2 L 8 14 M 3 9 L 13 9"/>
      <circle cx="8" cy="9" r="5.5"/>
    </g>
  </svg>`,
  
  control: `<svg viewBox="0 0 16 16" class="specIcon spec-control" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
      <path d="M 4 6 L 4 10 C 4 12 5.5 13 8 13 C 10.5 13 12 12 12 10 L 12 6"/>
      <path d="M 4 6 C 4 4.5 5.5 3 8 3 C 10.5 3 12 4.5 12 6"/>
    </g>
  </svg>`,
  
  enhancement: `<svg viewBox="0 0 16 16" class="specIcon spec-enhancement" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
      <path d="M 8 2 L 10 7 L 15 7.5 L 11 11 L 12 15.5 L 8 12.5 L 4 15.5 L 5 11 L 1 7.5 L 6 7 Z"/>
    </g>
  </svg>`,
  
  summoning: `<svg viewBox="0 0 16 16" class="specIcon spec-summoning" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
      <circle cx="8" cy="8" r="5.5"/>
      <path d="M 3.5 3.5 L 12.5 12.5 M 12.5 3.5 L 3.5 12.5"/>
    </g>
  </svg>`,
  
  utility: `<svg viewBox="0 0 16 16" class="specIcon spec-utility" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
      <path d="M 5 4 L 3.5 5.5 C 2.5 6.5 2.5 8 3.5 9 L 5 10.5"/>
      <path d="M 11 4 L 12.5 5.5 C 13.5 6.5 13.5 8 12.5 9 L 11 10.5"/>
      <path d="M 8 2 L 8 14"/>
    </g>
  </svg>`
};

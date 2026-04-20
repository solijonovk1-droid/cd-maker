<script setup>
defineProps({
  white: { type: Boolean, default: false },
  size: { type: String, default: 'md' } // sm | md | lg
})
</script>

<template>
  <div class="flex items-center gap-2 select-none">
    <!-- Document + Checkmark Icon -->
    <svg
      :width="size === 'sm' ? 28 : size === 'lg' ? 44 : 36"
      :height="size === 'sm' ? 28 : size === 'lg' ? 44 : 36"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Document body -->
      <path
        d="M10 6C10 4.343 11.343 3 13 3H31L41 13V42C41 43.657 39.657 45 38 45H13C11.343 45 10 43.657 10 42V6Z"
        :fill="white ? 'white' : '#2563EB'"
        fill-opacity="0.12"
        :stroke="white ? 'white' : '#2563EB'"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <!-- Folded corner -->
      <path
        d="M31 3L41 13H33C31.895 13 31 12.105 31 11V3Z"
        :fill="white ? 'white' : '#2563EB'"
        fill-opacity="0.3"
        :stroke="white ? 'white' : '#2563EB'"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <!-- Text lines on document -->
      <line x1="16" y1="21" x2="30" y2="21" :stroke="white ? 'white' : '#2563EB'" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="16" y1="27" x2="26" y2="27" :stroke="white ? 'white' : '#2563EB'" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Checkmark circle -->
      <circle cx="31" cy="37" r="9" :fill="white ? '#2563EB' : '#2563EB'"/>
      <!-- Checkmark -->
      <path
        d="M26.5 37L29.5 40L35.5 34"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Text -->
    <span
      :class="[
        'font-black tracking-tight',
        size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl',
        white ? 'text-white' : 'text-slate-900'
      ]"
    >
      CV <span class="text-blue-600">Maker</span>
    </span>
  </div>
</template>

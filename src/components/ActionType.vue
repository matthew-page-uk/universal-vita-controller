<template>
  <div>
    <slot />
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="0">
        Intelligent
      </option>
      <option value="1">
        Momentary
      </option>
      <option value="2">
        Latching
      </option>
      <option value="3">
        Cough
      </option>
      <option value="4">
        Always on
      </option>
      <option value="5">
        Always off
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Number,
        default: 0
    }
});

defineEmits(['update:modelValue']);
</script>

<style>
</style>
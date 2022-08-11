<template>
    <div>
        <slot></slot>
        <input type="checkbox" :checked="(modelValue === true)" @change="$emit('update:modelValue', $event.target.checked)" />
    </div>

</template>

<script setup>
defineProps({
    modelValue: {
        type: Boolean
    }
});

defineEmits(['update:modelValue']);
</script>

<style>
</style>
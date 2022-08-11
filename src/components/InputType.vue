<template>
    <div>
        Input type:
        <select id="inputType" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
            <option value="0">Line</option>
            <option value="1">Dynamic</option>
            <option value="2">Phantom</option>
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
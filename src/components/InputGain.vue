<template>
    <div style="display: flex; width: 100%">
        Gain

        <div style="width: 100%">
            <input id="headAmp" class="gainInput" type="range" min="0" max="255" list="dBs" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" />

            <datalist id="dBs" class="gainValues">
                <option value="0" label="-18">-18dB</option>
                <option value="128" label="0">0dB</option>
                <option value="255" label="+18">+18dB</option>
            </datalist>
        </div>
    </div>

</template>

<script setup>
defineProps({
    modelValue: Number
});

defineEmits(['update:modelValue']);
</script>

<style>
.gainInput {
    display: flex;
    width: 100%;
}

.gainValues {
    display: flex;
    color: white;
    width: 100%;
    justify-content: space-between;
}
</style>
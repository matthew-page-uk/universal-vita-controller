<template>
    <div>
        <span style="display: flex">
            <div style="margin: 2px; border: solid 1px green; width: 20px; height: 20px;"
                :style="(level > -13) ? { background: 'green' } : { background: 'transparent' }">
            </div>
            <div style="margin: 2px; border: solid 1px green; width: 20px; height: 20px;"
                :style="(level > -7) ? { background: 'green' } : { background: 'transparent' }">
            </div>
            <div style="margin: 2px; border: solid 1px yellow; width: 20px; height: 20px;"
                :style="(level > 0) ? { background: 'yellow' } : { background: 'transparent' }">
            </div>
            <div style="margin: 2px; border: solid 1px red; width: 20px; height: 20px;"
                :style="(level > 6) ? { background: 'red' } : { background: 'transparent' }">
            </div>
            <div>{{ level }}</div>
        </span>
    </div>

</template>

<script setup>
defineProps({
    level: {
        type: Number,
        default: 0
    }
});
</script>

<style>
</style>
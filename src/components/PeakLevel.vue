<template>
    <div>
        <span style="display: flex">
            <div class="led" style="border-color: green;"
                :style="(level > -13) ? { background: 'green' } : { background: 'transparent' }">
            </div>
            <div class="led" style="border-color: green;"
                :style="(level > -7) ? { background: 'green' } : { background: 'transparent' }">
            </div>
            <div class="led" style="border-color: yellow;"
                :style="(level > 0) ? { background: 'yellow' } : { background: 'transparent' }">
            </div>
            <div class="led" style="border-color: red;"
                :style="(level > 6) ? { background: 'red' } : { background: 'transparent' }">
            </div>
            <!-- <div>{{ level }}</div> -->
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
.led {
    margin: 5px;
    width: 15px;
    height: 15px;
    border: solid 1px;
    border-radius: 50%;
}
</style>
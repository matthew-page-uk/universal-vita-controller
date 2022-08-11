<template>

    <div style="border: 1px solid; margin: 20px; padding: 10px">
        <b>{{ props.state.name }} ({{ props.state.address }})</b>

        <InputGain v-model="headAmp" />
        <InputType v-model="inputType" />
        <VitaCheckbox v-model="manualEnabled">Manual control enabled: </VitaCheckbox>
        <PeakLevel :level="props.state.dbPeakLevel" />
        <ActionType v-model="programmeButtonAction">Programme Button: </ActionType>
        <VitaCheckbox v-model="mutesTB">Mutes TB: </VitaCheckbox>
        <ActionType v-model="talkbackButtonAction">Talkback Button: </ActionType>
        <VitaCheckbox v-model="mutesProgramme">Mutes PGM: </VitaCheckbox>
    </div>

</template>

<script setup>
import { ref, computed } from 'vue';

import InputGain from './InputGain.vue';
import InputType from './InputType.vue';
import VitaCheckbox from './VitaCheckbox.vue';
import PeakLevel from './PeakLevel.vue';
import ActionType from './ActionType.vue';

const props = defineProps({
    state: Object
});

const emit = defineEmits([
    'update'
]);

const headAmp = computed({
    get() {
        return props.state.headAmp;
    },

    set(newValue) {
        update({ headAmp: parseInt(newValue) });
    }
});

const inputType = computed({
    get() { return props.state.inputType },
    set(newValue) {
        update({ inputType: parseInt(newValue) });

    }
});

const manualEnabled = computed({
    get() { return props.state.isManualEnabled },
    set(newValue) {
        update({ isManualEnabled: !!newValue });

    }  
});

const programmeButtonAction = computed({
    get() { return props.state.programmeButtonAction },
    set(newValue) {
        update({ programmeButtonAction: parseInt(newValue) });

    }
});

const mutesTB = computed({
    get() { return props.state.isProgrammeMutesTB },
    set(newValue) {
        update({ isProgrammeMutesTB: !!newValue });

    }  
});

const talkbackButtonAction = computed({
    get() { return props.state.talkbackButtonAction },
    set(newValue) {
        update({ talkbackButtonAction: parseInt(newValue) });

    }
});

const mutesProgramme = computed({
    get() { return props.state.isTalkbackMutesProgramme },
    set(newValue) {
        update({ isTalkbackMutesProgramme: !!newValue });

    }  
});


function update(updateObject) {
    emit('update', updateObject);
}

</script>

<style>
</style>
<template>

    <div style="border: 1px solid; margin: 5px; padding: 10px; width: 12em; display: inline-block; background: linear-gradient(90deg, rgba(250,250,250,1) 0%, rgba(220,220,220,1) 100%);">
        <div class="unitName">{{ props.state.name }}</div>
        <div class="unitName">{{ props.state.address }}</div>

        <hr />

        <div class="sectionHeading">Input</div>

        <InputType v-model="inputType" style="float: left;" />
        <InputGain v-model="headAmp" />
        <PeakLevel :level="props.state.dbPeakLevel" />
        <VitaCheckbox v-model="manualEnabled" style="float: left;">Manual Enabled: </VitaCheckbox>

        <br />
        <div class="sectionHeading">Programme Button</div>
        <ActionType v-model="programmeButtonAction" style="float: left;"></ActionType>
        <br />
        <VitaCheckbox v-model="mutesTB" style="float: left;">Mutes TB</VitaCheckbox>

        <br />
        <div class="sectionHeading">Talkback Button</div>
        <ActionType v-model="talkbackButtonAction" style="float: left;"></ActionType>
        <br />
        <VitaCheckbox v-model="mutesProgramme" style="float: left;">Mutes PGM: </VitaCheckbox>
    </div>

</template>

<script setup>
import { computed } from 'vue';

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

.unitName {
    color: maroon;
    font-size: small;
    font-weight: bold;
    text-align: left;
}

.sectionHeading {
    font-size: medium;
    font-weight: bold;
    text-align: left;
    padding-top: .5em;
    padding-bottom: .25em;
}

</style>
<template>
  <div>
    <div
      v-for="vita in vitaData"
      :key="vita.address"
      style="display: inline-block;"
    >
      <VitaContainer
        :state="vita"
        @update="onUpdate(vita.address, $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import VitaContainer from './components/VitaContainer.vue';

const messageFromMain = ref('some text');
const vitaData = reactive({});

    onMounted(() => {
      window.ipcRenderer.receive('deviceState', (state) => {
        vitaData[state.address] = state;
      });

      window.ipcRenderer.receive('removeDevice', (device) => {
        delete vitaData[device.address];
      })
    })

    function onUpdate(address, data) {
        window.ipcRenderer.send('changeDevice', {address, data});
    }

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0px;
}
</style>

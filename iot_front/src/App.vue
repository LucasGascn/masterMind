<script setup>
import HelloWorld from './components/HelloWorld.vue'
import mqtt from 'mqtt'
import { ref } from "vue";
const client = mqtt.connect("mqtt://test.mosquitto.org");

const player1 = ref([])
const player2 = ref([])

let isConnected = false;
client.on("connect", function () {
  client.subscribe("mastermind/player/input", function (err) {
    if (!err) {
      isConnected = true;
    }
  });
});

client.on('message', function(topic, message){
  
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

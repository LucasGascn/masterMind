<script setup>
import "./function/mqtt.js"
import axios from "axios";
import { ref } from "vue";
import client from "./function/mqtt.js";

const soluce1Display = ref(['?','?','?','?','?'])
const soluce2Display = ref(['?','?','?','?','?'])

const player1Input = ref([])
const player2Input = ref([])

const startGame = async () => {
  //const res = await axios.get("http://localhost:3000/start")
  client.publish("mastermind/start",JSON.stringify({msg: "start"}))
  player1Input.value = []
  player2Input.value = []
}

client.on("connect", function () {
  client.subscribe("mastermind/player/input", function (err) {
    if (!err) {
      console.log("connecté")
    }
  });
});

client.on("message", function(topic, msg) {
  const res = JSON.parse(msg.toString());
  if(res.id === "player1"){
    player1Input.value.unshift(res)
  }else{
    player2Input.value.unshift(res)
  }
})
</script>

<template>
  <div style="width: 100%; margin: 0; display: flex; flex-direction: column; justify-content: space-between">
    <button @click="startGame">
      start
    </button>
    <div style="display: flex; width: 100%">
      <div style="display: flex; justify-content: space-around; width: 100%">
        <div style="width: 30%;">
          <div style="width: 100%; display: flex; justify-content: space-around">
            <p>Player 1</p>
            <p>Count : {{player1Input.length}}</p>
          </div>
          <div style="display: flex; width: 100%; justify-content: space-around;">
            <p v-for="soluce in soluce1Display">
              {{soluce}}
            </p>
          </div>
          <div style="max-height: 500px; overflow-y: scroll">
            <div style="display: flex; width: 100%; flex-direction: column; justify-content: space-around;" v-for="input in player1Input">
              <div style="display: flex; justify-content: space-around">
                <p v-for="soluce in input.input">
                  {{soluce.value}}
                </p>
              </div>
              <div style="display: flex; justify-content: space-around; width: 100%;">
                <div style="color: green">
                  {{input.input.filter(e => e.status === "correct").length}}
                </div>
                <div style="color: darkorange">
                  {{input.input.filter(e => e.status === "misplaced").length}}
                </div>
                <div style="color: red">
                  {{input.input.filter(e => e.status === "incorrect").length}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 30%;">
          <div style="width: 100%; display: flex; justify-content: space-around">
            <p>Player 2</p>
            <p>Count : {{player2Input.length}}</p>
          </div>
          <div style="display: flex; width: 100%; justify-content: space-around;">
            <p v-for="soluce in soluce2Display">
              {{soluce}}
            </p>
          </div>
          <div style="max-height: 500px; overflow-y: scroll">
            <div style="display: flex; width: 100%; flex-direction: column; justify-content: space-around;" v-for="input in player2Input">
              <div style="display: flex; justify-content: space-around">
                <p v-for="soluce in input.input">
                  {{soluce.value}}
                </p>
              </div>
              <div style="display: flex; justify-content: space-around; width: 100%;">
                <div style="color: green">
                  {{input.input.filter(e => e.status === "correct").length}}
                </div>
                <div style="color: darkorange">
                  {{input.input.filter(e => e.status === "misplaced").length}}
                </div>
                <div style="color: red">
                  {{input.input.filter(e => e.status === "incorrect").length}}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
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

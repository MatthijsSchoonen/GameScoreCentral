<template>
  <ion-page>
    <ion-header>
       <div class="header">
        <ion-button fill="clear" @click="back()">
            <ion-icon slot="start" :icon="arrowBack"></ion-icon>back
          </ion-button>
          <ion-title class="title">Darts</ion-title>
        </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-if="modeSelected">
        <div class="center">
          <ion-title>Select a Mode</ion-title>
        </div>

        <!-- <div>
          <ion-item @click="playerUI('500')"><ion-title>To 500</ion-title></ion-item>
        </div>
        <div>
          <ion-item @click="playerUI('300')"><ion-title>To 300</ion-title></ion-item>
        </div> -->
        <div>
          <ion-item @click="playerUI('bestOf10')"><ion-title>Best of 10 rounds</ion-title></ion-item>
        </div>
      </div>

      <div v-if="addPlayers">
        <ion-card>
          <ion-card-title>Add a Player</ion-card-title>
          <ion-input v-model="playerName" label="PlayerName" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>
          <div class="right">
            <ion-button class="cardBtn" @click="addPlayer()">Add a player</ion-button>
          </div>
        </ion-card>

        <ion-card>
          <ion-card-title>Player List</ion-card-title>
          <ion-list>
            <ion-item v-for="player in players" :key="player">
              <ion-label>{{ player }}</ion-label>
              <ion-button color="danger" slot="end" @click="removePlayer(player)">Remove</ion-button>
            </ion-item>
          </ion-list>
          <div class="right">
            <ion-button class="cardBtn" @click="startGame()">Start Game</ion-button>
          </div>
        </ion-card>
      </div>

      <div v-if="game500 || game300 || bestOf10">
        <ion-card>
          <ion-card-title>Scoreboard</ion-card-title>
          <ion-list>
            <ion-item v-for="(player, index) in players" :key="index">
              <ion-label>{{ player }}</ion-label>
              <ion-label>Total: {{ scores[player].total }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-card>

        <ion-card>
          <ion-card-title>Add Scores</ion-card-title>
          <ion-list>
          <div class="addScore" v-for="player in players" :key="player">
              <h4>{{ player }}</h4>
              <div>
              <ion-input v-model.number="scores[player].dart1" type="number" placeholder="Dart 1"></ion-input>
              <ion-input v-model.number="scores[player].dart2" type="number" placeholder="Dart 2"></ion-input>
              <ion-input v-model.number="scores[player].dart3" type="number" placeholder="Dart 3"></ion-input>
                <ion-button @click="addScore(player)">Add Score</ion-button>
              </div>
          
            </div>
          </ion-list>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonCard, IonCardTitle, IonIcon, IonButton } from '@ionic/vue';
import { arrowBack } from "ionicons/icons";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const modeSelected = ref(true);
const addPlayers = ref(false);
const game500 = ref(false);
const game300 = ref(false);
const bestOf10 = ref(false);
const mode = ref('');

function back(){
  if(modeSelected.value){
    router.back();
  } else {
    game500.value = false;
    game300.value = false;
    bestOf10.value = false;
    modeSelected.value = true;
    addPlayers.value = false;
  }
}

async function playerUI(selectedMode: string){
  mode.value = selectedMode;
  modeSelected.value = false;
  addPlayers.value = true;
}

const playerName = ref("");
const players = ref<string[]>([]);
const scores = ref<Record<string, { dart1: number, dart2: number, dart3: number, total: number }>>({});

function addPlayer(){
  if (playerName.value && !players.value.includes(playerName.value)) {
    players.value.push(playerName.value);
    scores.value[playerName.value] = { dart1: 0, dart2: 0, dart3: 0, total: 0 };
    playerName.value = ''; 
  }
}

function removePlayer(player: string) {
  players.value = players.value.filter(p => p !== player);
  delete scores.value[player];
}

function startGame() {
  addPlayers.value = false;
  if (mode.value === '500') game500.value = true;
  if (mode.value === '300') game300.value = true;
  if (mode.value === 'bestOf10') bestOf10.value = true;
}

function addScore(player: string) {
  const playerScores = scores.value[player];
  playerScores.total += playerScores.dart1 + playerScores.dart2 + playerScores.dart3;
  playerScores.dart1 = 0;
  playerScores.dart2 = 0;
  playerScores.dart3 = 0;

  if ((mode.value === '500' && playerScores.total >= 500) || (mode.value === '300' && playerScores.total >= 300)) {
    alert(`${player} wins!`);
    resetGame();
  } else if (mode.value === 'bestOf10') {
    if (!rounds.value[player]) rounds.value[player] = [];
    rounds.value[player].push(playerScores.total);
    if (rounds.value[player].length === 10) {
      const totalScore = rounds.value[player].reduce((a, b) => a + b, 0);
      alert(`${player} total score after 10 rounds: ${totalScore}`);
    }
  }
}

function resetGame() {
  game500.value = false;
  game300.value = false;
  bestOf10.value = false;
  modeSelected.value = true;
  addPlayers.value = false;
  players.value = [];
  scores.value = {};
}

const rounds = ref<Record<string, number[]>>({});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ion-title {
  text-align: center;
}

.title {
  text-align: end;
}

.center {
  margin: 5vh auto;
}

ion-card {
  margin: 5vh auto;
  width: 80vw;
}
ion-card-title {
  margin: 2vh auto;
  text-align: center;
}

ion-input {
  margin: 0 auto 3vh;
  width: 60vw;
}

.cardBtn {
  margin: 1vh 0;
}

.right {
  margin: 0 auto;
  width: 60vw;
  display: flex;
  justify-content: end;
}


.addScore{
  margin: 0 auto;
  width: 60vw;
}

.addScore div{
  display: flex;
  justify-content: space-between;
  height: 4.5vh;
  border-bottom: 1px solid black;
}

h4{
  margin: 0.5vh auto;
}
</style>

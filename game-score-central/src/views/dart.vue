<template>
  <ion-page>
    <ion-header>
      <div class="header">
        <ion-button fill="clear" @click="back()">
          <ion-icon slot="start" :icon="arrowBack"></ion-icon>Back
        </ion-button>
        <ion-title class="title">Darts</ion-title>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="modeSelected">
        <div class="center">
          <ion-title>Select a Mode</ion-title>
        </div>
        <div>
          <ion-item @click="playerUI('501')"><ion-title>501</ion-title></ion-item>
        </div>
        <div>
          <ion-item @click="playerUI('301')"><ion-title>301</ion-title></ion-item>
        </div>
        <div>
          <ion-item @click="playerUI('180')"><ion-title>180</ion-title></ion-item>
        </div>
      </div>

      <div v-if="addPlayers">
        <ion-card>
          <ion-card-title>Add a Player</ion-card-title>
          <ion-input
            v-model="playerName"
            label="PlayerName"
            label-placement="floating"
            fill="outline"
            placeholder="Enter text"
          ></ion-input>
          <div class="right">
            <ion-button class="cardBtn" @click="addPlayer()">Add Player</ion-button>
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

      <div v-if="gameStarted">
        <ion-card>
          <ion-card-title>Scoreboard</ion-card-title>
          <ion-list>
            <ion-item v-for="(score, player) in scores" :key="player">
              <ion-label>{{ player }}</ion-label>
              <ion-label>Remaining: {{ score.remaining }}</ion-label>
              <ion-label v-if="currentPlayer === player" color="primary">(Your Turn)</ion-label>
            </ion-item>
          </ion-list>
        </ion-card>

        <ion-card v-if="!winner">
          <ion-card-title>Add Scores ({{ currentPlayer }})</ion-card-title>
          <div class="addScore">
            <ion-input v-model.number="dart1" type="number" placeholder="Dart 1"></ion-input>
            <ion-input v-model.number="dart2" type="number" placeholder="Dart 2"></ion-input>
            <ion-input v-model.number="dart3" type="number" placeholder="Dart 3"></ion-input>
            <ion-button @click="addScore()">Submit Scores</ion-button>
          </div>
        </ion-card>

        <ion-card v-if="winner">
          <ion-card-title>{{ winner }} Wins!</ion-card-title>
          <div class="right">
            <ion-button class="cardBtn" @click="resetGame()">Reset Game</ion-button>
          </div>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonContent,
  IonCard,
  IonCardTitle,
  IonInput,
  IonButton,
  IonItem,
  IonList,
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import { arrowBack } from "ionicons/icons";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// States
const modeSelected = ref(true);
const addPlayers = ref(false);
const gameStarted = ref(false);
const mode = ref("");
const currentPlayerIndex = ref(0);
const winner = ref("");
const dart1 = ref<number | null>(null);
const dart2 = ref<number | null>(null);
const dart3 = ref<number | null>(null);

// Players and Scores
const playerName = ref("");
const players = ref<string[]>([]);
const scores = ref<Record<string, { remaining: number; darts: number[] }>>({});

function back() {
  if (modeSelected.value) {
    router.back();
  } else {
    resetGame();
  }
}

function playerUI(selectedMode: string) {
  mode.value = selectedMode;
  modeSelected.value = false;
  addPlayers.value = true;
}

function addPlayer() {
  if (playerName.value && !players.value.includes(playerName.value)) {
    players.value.push(playerName.value);
    scores.value[playerName.value] = { remaining: parseInt(mode.value), darts: [] };
    playerName.value = "";
  }
}

function removePlayer(player: string) {
  players.value = players.value.filter((p) => p !== player);
  delete scores.value[player];
}

function startGame() {
  addPlayers.value = false;
  gameStarted.value = true;
}

function addScore() {
  const player = players.value[currentPlayerIndex.value];
  const playerScores = scores.value[player];
  const total = (dart1.value || 0) + (dart2.value || 0) + (dart3.value || 0);

  if (playerScores.remaining - total < 0) {
    alert("Score exceeds remaining points. Try again.");
    resetDarts();
    return;
  }

  playerScores.remaining -= total;
  if (playerScores.remaining === 0) {
    // Check if the last dart was a double

    let lastDart = dart3.value || dart2.value || dart1.value;
    if (lastDart % 2 === 0) {
      winner.value = player;
      return;
    } else {
      alert("You must finish on a double!");
      playerScores.remaining += total; // Undo the scores
      resetDarts();
      return;
    }
  }

  resetDarts();
  nextTurn();
}

function resetDarts() {
  dart1.value = null;
  dart2.value = null;
  dart3.value = null;
}

function nextTurn() {
  currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length;
}

function resetGame() {
  modeSelected.value = true;
  addPlayers.value = false;
  gameStarted.value = false;
  currentPlayerIndex.value = 0;
  players.value = [];
  scores.value = {};
  winner.value = "";
}

const currentPlayer = computed(() => players.value[currentPlayerIndex.value]);
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

.addScore {
  margin: 0 auto;
  width: 60vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

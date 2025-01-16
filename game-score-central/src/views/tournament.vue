<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Setup Tournament</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Tournament Setup -->
      <div v-if="!tournamentStarted">
        <ion-card>
          <ion-card-title>Add Players</ion-card-title>
          <ion-input
            v-model="playerName"
            label="Player Name"
            label-placement="floating"
            fill="outline"
            placeholder="Enter player name"
          ></ion-input>
          <ion-button @click="addPlayer">Add Player</ion-button>
        </ion-card>

        <ion-card>
          <ion-card-title>Players</ion-card-title>
          <div class="player-list">
            <ion-list>
              <ion-item v-for="(player, index) in players" :key="index">
                {{ player }}
                <ion-button color="danger" slot="end" @click="removePlayer(player)">
                  Remove
                </ion-button>
              </ion-item>
            </ion-list>
          </div>
        </ion-card>

        <ion-card>
          <ion-card-title>Choose Mode</ion-card-title>
          <ion-button @click="startTournament('solo')">Start Solo Tournament</ion-button>
          <ion-button @click="startTournament('duo')">Start Duo Tournament</ion-button>
        </ion-card>
      </div>

      <!-- Tournament Bracket -->
      <div v-else>
        <div class="bracket">
          <h2>Tournament Bracket</h2>
          <div v-for="(round, index) in rounds" :key="index" class="round">
            <h3>Round {{ index + 1 }}</h3>
            <div v-for="(match, matchIndex) in round" :key="matchIndex" class="match">
              <p>
                {{ match.match[0] }} vs. {{ match.match[1] }}
                <span v-if="match.winner">- Winner: {{ match.winner }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Popup for Current Match -->
        <ion-card v-if="currentMatch">
          <ion-card-title>Current Match</ion-card-title>
          <p>{{ currentMatch[0] }} vs. {{ currentMatch[1] }}</p>
          <ion-button @click="selectWinner(currentMatch[0])">{{ currentMatch[0] }} Wins</ion-button>
          <ion-button @click="selectWinner(currentMatch[1])">{{ currentMatch[1] }} Wins</ion-button>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
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
  IonToolbar,
} from "@ionic/vue";
import { ref, computed } from "vue";

const players = ref([]);
const playerName = ref("");
const mode = ref("solo");
const tournamentStarted = ref(false);
const rounds = ref([]);
const currentMatchIndex = ref(0);

const currentMatch = computed(() => {
  const round = rounds.value[rounds.value.length - 1];
  return round && round[currentMatchIndex.value] ? round[currentMatchIndex.value].match : null;
});

function addPlayer() {
  if (playerName.value && !players.value.includes(playerName.value)) {
    players.value.push(playerName.value);
    playerName.value = "";
  }
}

function removePlayer(player) {
  players.value = players.value.filter(p => p !== player);
}

function startTournament(selectedMode) {
  if (players.value.length < (selectedMode === "duo" ? 4 : 2)) {
    alert("Not enough players for the tournament.");
    return;
  }
  mode.value = selectedMode;
  tournamentStarted.value = true;
  generateRounds();
}

function generateRounds() {
  let initialMatches = [...players.value];
  if (mode.value === "duo") {
    initialMatches = shuffle(players.value).reduce((teams, player, index, arr) => {
      if (index % 2 === 0 && arr[index + 1]) {
        teams.push([player, arr[index + 1]]);
      }
      return teams;
    }, []);
  } else {
    initialMatches = initialMatches.map(player => [player]);
  }
  rounds.value.push(initialMatches.map(match => ({ match, winner: null })));
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function selectWinner(winner) {
  const round = rounds.value[rounds.value.length - 1];
  const match = round[currentMatchIndex.value];
  if (!match) return;

  match.winner = winner;
  currentMatchIndex.value++;

  if (currentMatchIndex.value >= round.length) {
    const winners = round.map(m => m.winner);
    if (winners.length === 1) {
      alert(`${winners[0]} wins the tournament!`);
      resetTournament(); // Reset after tournament ends
    } else {
      rounds.value.push(
        winners.map((_, i, arr) => (i % 2 === 0 ? [arr[i], arr[i + 1]] : null)).filter(Boolean)
      );
      currentMatchIndex.value = 0;
    }
  }
}

function resetTournament() {
  players.value = [];
  tournamentStarted.value = false;
  rounds.value = [];
  currentMatchIndex.value = 0;
}
</script>

<style scoped>
.player-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}
ion-list {
  margin: 0;
}
ion-card-title {
  text-align: center;
  font-weight: bold;
}
.bracket {
  display: flex;
  flex-direction: column;
}
.round {
  margin: 1rem 0;
}
.match {
  margin: 0.5rem 0;
}
</style>

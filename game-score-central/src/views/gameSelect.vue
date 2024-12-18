<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
      <div class="header">
        <ion-button fill="clear" @click="back()">
            <ion-icon slot="start"  :icon="arrowBack"></ion-icon>back
          </ion-button>
            <ion-title>Choose your game</ion-title>
          </div>
      

      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item @click="toDart()">
      <Vue3Lottie class="anim"
              :animationData="dart"
            />
           
            <p>Darts</p>
           
            
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonItem } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import dart from '@/assets/dart.json';
import { arrowBack } from "ionicons/icons";
import { useRouter } from "vue-router";

const router = useRouter();

function back(){
  router.back();
}


function toDart(){
  router.push("/dart");
}

</script>

<style scoped>
.anim{
  margin: 0;
  width: 5vw;
}

.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ion-title{
  text-align: end;
}

</style>
<template>
  <ion-page>  
    <ion-header>     
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">             
      </ion-header>
      <div class="home">
      <Vue3Lottie class="anim"
              :animationData="HomeAnim"
            />
            <ion-title  class="title" size="large">Click to Begin</ion-title>
            </div>
            <ion-button class="button" fill="clear" @click="navigate"></ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import HomeAnim from "@/assets/HomeSceenAnim.json";
import { useRouter } from "vue-router";

const router = useRouter();

function navigate() {
   router.push(`/gameSelect`);
}

</script>

<style lang="css" scoped>
.anim {
  margin:  auto;
  width: 25vw;
}

.title{
  text-align: center;
  font-size: 5vw;
}

.home{
  margin: 40vh auto 0 ; 
}

.button{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
}
</style>
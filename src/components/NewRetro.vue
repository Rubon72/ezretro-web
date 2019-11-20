<template>
  <div class="newRetro_main">
    <div class="newRetro_box">
      <input
        class="input"
        @keyup.enter="createNewRetro"
        v-model="retroName"/>
      <vue-recaptcha
        :loadRecaptchaScript="true"
        @verify="onVerify"
        sitekey="6LcN98IUAAAAAELEa7A2LBZDSdwytL1zDEoV5ycV">
        <button class="button">Create New</button>
      </vue-recaptcha>
      <a href="http://codecar.tel/" class="cartelLink" target="_blank">
        <div class="cartelLink_icon"></div>
        Built by Code Cartel
      </a>
    </div>
  </div>
</template>

<script>
import db from "../firebase";
import firebase from 'firebase';
import VueRecaptcha from 'vue-recaptcha';

export default {
  data(){
    return{
      retroName:''
    }
  },
  components: { VueRecaptcha },
  methods:{
    onVerify:function(){
      this.createNewRetro();
    },
    createNewRetro(){
      db.collection("retros")
        .add({
          retroName: this.retroName,
          createdDate: firebase.firestore.FieldValue.serverTimestamp(),
        }).then((snap) => {
        this.$router.push(snap.id)
      });
    }
  },
  mounted(){
    document.title = 'EZ Retro';
  }
}
</script>


<style scoped>
  html,body{
    height:100%;
  }
</style>
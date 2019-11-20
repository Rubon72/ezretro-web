<template>
  <div>
    <div>
      <div class="title">{{ retro.retroName }}</div>
      <button
        class="button"
        v-clipboard="fullUrl"
        v-clipboard:success="clipboardSuccessHandler"
      >
        {{copyButtonText}}
      </button>
    </div>
    <div class="columns">
      <div class="column">
        <div class="subtitle">What went well?</div>
        <div class="class newPointWrapper">
          <input
            type="text"
            class="input is-small"
            placeholder="Add talking point"
            v-model="newWentWellPoint"
            @keyup.enter="addTalkingPoint('wentWell','newWentWellPoint')"
          />
          <button
            class="button is-small"
            v-if="newWentWellPoint.length"
            @click="addTalkingPoint('wentWell','newWentWellPoint')"
          >
            +
          </button>
        </div>
        <div v-for="wentWellOne in wentWell" :key="wentWellOne.id">
          <div>
            <textarea
              placeholder="Add talking point"
              @blur="pointOnBlur('wentWell',wentWellOne.title,wentWellOne.id)"
              v-model="wentWellOne.title"
            ></textarea>
            <button
              :disabled="checkIsVoted('wentWell',wentWellOne.id)"
              @click="voteClick('wentWell',wentWellOne.id)"
            >+{{wentWellOne.rate}}</button>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="subtitle">What can we improve?</div>
        <input
          class="input is-small"
          type="text"
          placeholder="Add talking point"
          v-model="newToImprovePoint"
          @keyup.enter="addTalkingPoint('toImprove','newToImprovePoint')"
        />
        <button v-if="newToImprovePoint.length" @click="addTalkingPoint('toImprove','newToImprovePoint')">+</button>
        <div v-for="toImproveOne in toImprove" :key="toImproveOne.id">
          <div>
            <textarea
              placeholder="Add talking point"
              @blur="pointOnBlur('toImprove',toImproveOne.title,toImproveOne.id)"
              v-model="toImproveOne.title"
            ></textarea>
            <button
              :disabled="checkIsVoted('toImprove',toImproveOne.id)"
              @click="voteClick('toImprove',toImproveOne.id)"
            >+{{toImproveOne.rate}}</button></div>
        </div>
      </div>
      <div class="column">
        <div class="subtitle">Action items</div>
        <input
          class="input is-small"
          type="text"
          placeholder="Add talking point"
          v-model="newActionPoint"
          @keyup.enter="addTalkingPoint('actionItems','newActionPoint')"
        />
        <button v-if="newActionPoint.length" @click="addTalkingPoint('actionItems','newActionPoint')">+</button>
        <div v-for="actionItem in actionItems" :key="actionItem.id">
          <textarea
            placeholder="Add talking point"
            @blur="pointOnBlur('actionItems',actionItem.title,actionItem.id)"
            v-model="actionItem.title"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "../firebase";
import firebase from 'firebase';

const retrosCollection = db.collection('retros');

export default {
  props: {

  },
  data () {
    return {
      retro:{},
      retroID:this.$router.currentRoute.path.substr(1),
      wentWell:[],
      toImprove:[],
      actionItems:[],
      newWentWellPoint:'',
      newToImprovePoint:'',
      newActionPoint:'',
      fullUrl:window.location.href,
      copyButtonText:'Copy URL',
      voted:{
        wentWell:[],
        toImprove:[]
      }
    }
  },
  computed: {
    wentWellToShow: function () {
      return this.wentWell.orderBy("rate", "desc")
    }
  },
  // firestore () {
  //   return {
  //     retro,
  //     wentWell: retro.collection('wentWell'),
  //     toImprove: retro.collection('toImprove'),
  //     actionItems: retro.collection('actionItems'),
  //   }
  // },
  methods:{
    addTalkingPoint:function (collection, field) {
      retrosCollection.doc(this.retroID).collection(collection).add({
        title: this[field],
        rate:1
      }).then((entry)=>{
        this[field] = '';
        this.voted[collection].push(entry.id);
        this.updateVotedLocalStorage();
      })
    },
    pointOnBlur(collection,title,id) {
      if(title===''){
        retrosCollection.doc(this.retroID).collection(collection).doc(id).delete();
      }else{
        retrosCollection.doc(this.retroID).collection(collection).doc(id).update({
          title: title
        })
      }
    },
    voteClick(collection,id) {
      retrosCollection.doc(this.retroID).collection(collection).doc(id).update('rate', firebase.firestore.FieldValue.increment(1));

      if(!this.voted[collection]){
        this.voted[collection] = [];
      }
      this.voted[collection].push(id);
      this.updateVotedLocalStorage();
    },
    clipboardSuccessHandler () {
      this.copyButtonText = 'Copied!';
      setTimeout(()=> {
        this.copyButtonText = 'Copy URL';
      },1000)
    },
    checkIsVoted(collection,id) {
      return this.voted
        && this.voted[collection]
        && this.voted[collection].indexOf(id)!==-1;
    },
    updateVotedLocalStorage() {
      console.log( JSON.stringify(this.voted));
      localStorage['voted_'+this.retroID] = JSON.stringify(this.voted)
    }
  },
  mounted() {
    const retro = retrosCollection.doc(this.retroID);

    if (localStorage['voted_'+this.retroID]) {
      this.voted = JSON.parse(localStorage['voted_'+this.retroID]);
    }

    const wentWellPromise = this.$bind('wentWell',retro.collection('wentWell').orderBy("rate", "desc"))
    .then((doc) => {
      if(this.voted.wentWell) {
        const cleanedWentWell = this.wentWell.map(item=>item.id);
        this.voted.wentWell = this.voted.wentWell.filter((one) => {
          return cleanedWentWell.indexOf(one) !== -1
        })
      }
    });

    const toImprovePromise = this.$bind('toImprove',retro.collection('toImprove').orderBy("rate", "desc"))
    .then((doc) => {
      if(this.voted.toImprove) {
        const cleanedToImprove = this.toImprove.map(item=>item.id);
        this.voted.toImprove = this.voted.toImprove.filter((one) => {
          return cleanedToImprove.indexOf(one) !== -1
        })
      }
    });

    this.$bind('actionItems',retro.collection('actionItems'));
    this.$bind('retro',retro).then((doc) => {
      document.title =  this.retro.retroName ? `${this.retro.retroName} - EZ Retro` : 'EZ Retro';
    });

    Promise.all([wentWellPromise, toImprovePromise]).then(values => {
      this.updateVotedLocalStorage();
    });
  }
}

</script>

<style scoped>


</style>

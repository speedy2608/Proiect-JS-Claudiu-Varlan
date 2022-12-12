<template>
  <div>
    <button @click.prevent="ascend()">Ascending</button>
    <button @click.prevent="descendend()">Descending</button>

    <div v-for="carte in books" :key="carte.title">
      <Carte @edit="editCarte" :carte="carte" />
    </div>
    <edit-carte :carte="formCarte" />
  </div>
</template>

<script>
import Carte from "../components/Carte.vue";
import EditCarte from "./EditCarte.vue";
import utils from "../utils.js";

export default {
  name: "CarteList",
  components: {
    Carte,
    EditCarte,
  },
  data() {
    return {
      formCarte: {},
      books: [],
      ascendent: 1,
    };
  },
  created() {
    let url = utils.url;
    let requestParam = utils.globalRequestParameters;
    if (!this.carti.length) {
      fetch(url + "carti", requestParam).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchCarti", res);
          this.books = res;
          function compare(a, b) {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
          }
          return this.books.sort(compare);
        })
      );
    }
  },

  computed: {
    carti() {
      return this.$store.state.carti;
    },
  },

  methods: {
    editCarte(carte) {
      this.formCarte = carte;
    },
    ascend() {
      if (this.ascendent === 1) {
        console.log("Lista este sortata ascendent.");
      } else {
        this.ascendent = 1;
        console.log("Lista este sortata ascendent.");
        return this.books.sort(function compare(a, b) {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        });
      }
    },
    descendend() {
      if (this.ascendent === 0) {
        console.log("Lista este sortata descendent.");
      } else {
        this.ascendent = 0;
        console.log("Lista este sortata descendent.");
        return this.books.sort(function compare(a, b) {
          if (a.title > b.title) return -1;
          if (a.title < b.title) return 1;
          return 0;
        });
      }
    },
  },
};
</script>

<style></style>

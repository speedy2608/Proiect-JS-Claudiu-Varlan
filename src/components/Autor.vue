<template>
  <div id="bar">
    <b>{{ autor.firstName }} </b>-<b>{{ autor.lastName }} </b>
    <div id="buttons">
      <button v-if="isAuthenticated" v-bind:id="autor.id" @click="edit">
        Edit
      </button>
      <button
        v-if="isAuthenticated"
        v-bind:id="'DELETE_' + autor.id"
        @click="deleteAutor"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "Autor",
  props: {
    autor: Object,
  },
  data() {
    return {};
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    edit() {
      this.$emit("edit", this.autor);
    },
    deleteAutor() {
      let idDelete = document
        .getElementById(`DELETE_${this.autor.id}`)
        .getAttribute("id")
        .split("_")[1];
      console.log("Vreau sa sterg autorul: " + idDelete);
      let requestParameters = utils.globalRequestParameters;
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "DELETE";

      fetch(utils.url + "autori/" + idDelete, requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            console.log(res.message);
            this.$store.dispatch("deleteAutor", idDelete);
          }
        });
    },
  },
};
</script>

<style>
#bar {
  margin: auto;
  width: 25%;
  border: 3px solid rgb(124, 180, 124);
  padding: 20px;
  position: relative;
  text-align: left;
}

#buttons {
  display: inline;
  right: 10px;
  position: absolute;
}
</style>
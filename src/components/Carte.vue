<template>
  <div id="bar">
    <b>{{ carte.title }} </b>
    {{ carte.nrOfPages }}
    <div id="buttons">
      <button v-if="isAuthenticated" v-bind:id="carte.id" @click="edit">
        Edit
      </button>
      <button
        v-if="isAuthenticated"
        v-bind:id="'DELETE_' + carte.id"
        @click="deleteCarte"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "Carte",
  props: ["carte"],
  data() {
    return {
      authors: [],
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    autori() {
      return this.$store.state.autori;
    },
  },
  methods: {
    edit() {
      this.$emit("edit", this.carte);
    },
    deleteCarte() {
      let idDelete = document
        .getElementById(`DELETE_${this.carte.id}`)
        .getAttribute("id")
        .split("_")[1];

      console.log("Vreau sa sterg cartea: " + idDelete);
      let requestParameters = utils.globalRequestParameters;
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "DELETE";

      let requestParametersAut = { ...utils.globalRequestParameters };
      let tokenAut = window.localStorage.getItem("token");
      requestParametersAut.headers.Authorization = "Bearer " + tokenAut;
      requestParametersAut.method = "PUT";

      console.log(this.carte);
      let autor = this.authors.find((a) => a.id == this.carte.autorId);
      console.log(autor);
      let booksList = autor.booksId.filter((i) => i !== this.carte.id);
      autor.booksId = booksList;

      fetch(utils.url + "carti/" + idDelete, requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            console.log(res.message);
            this.$store.dispatch("deleteCarte", idDelete);
          }
        })
        .then(() => {
          fetch(utils.url + "autori/" + autor.id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(autor),
          })
            .then(() => {
              window.location.reload();
              this.$router.push("/carti");
            })
            .catch((err) => console.log(err.message));
        });
    },
  },
  mounted() {
    fetch("http://127.0.0.1:3000/autori")
      .then((res) => res.json())
      .then((data) => (this.authors = data))
      .catch((err) => console.log(err.message));
  },
};
</script>

<style>
#bar {
  margin: auto;
  width: 25%;
  border: 2px solid rgb(124, 180, 124);
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

<template>
  <div>
    <form @submit.prevent="addCarte()">
      <div>
        <input v-model="title" type="text" placeholder="Titlu" />
      </div>
      <div>
        <input v-model="nrOfPages" type="text" placeholder="Numar de pagini" />
      </div>
      <div>
        <select v-model="autorName">
          <option v-for="autor in authors" :key="autor.id">
            {{ autor.firstName + " " + autor.lastName }}
          </option>
        </select>
      </div>
      <div>
        <input v-model="description" type="text" placeholder="Descriere" />
      </div>
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils";

export default {
  data() {
    return {
      title: "",
      nrOfPages: "",
      description: "",
      autorId: "",
      autorName: "",
      authors: [],
    };
  },
  methods: {
    addCarte() {
      console.log(
        "Adding carte... ",
        "Title: ",
        this.title,
        "Cantitate: ",
        this.nrOfPages,
        "ID Autor: ",
        this.autorId,
        "Descriere: ",
        this.description
      );

      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "POST";

      let requestParametersAut = { ...utils.globalRequestParameters };
      let tokenAut = window.localStorage.getItem("token");
      requestParametersAut.headers.Authorization = "Bearer " + tokenAut;
      requestParametersAut.method = "PUT";

      console.log(this.authors);
      console.log(this.autorId, this.autorName);
      let autor = this.authors.find(
        (a) => a.firstName + " " + a.lastName == this.autorName
      );
      console.log(autor);

      let data = {};
      data.title = this.title;
      data.nrOfPages = this.nrOfPages;
      data.autorId = autor.id;
      data.description = this.description;

      requestParameters.body = JSON.stringify(data);

      let generatedBookId;

      fetch(utils.url + "carti", requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("Probleme cu token-ul la adaugare!");
          } else {
            console.log("Am adaugat cartea cu id-ul: " + res.id);
            data.id = res.id;

            generatedBookId = res.id;

            autor.booksId.push(generatedBookId);
            console.log(autor.booksId);
            this.$store.dispatch("addCarte", data);
            this.$router.push("/");
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
              console.log(autor);
              this.$router.push("/");
            })
            .catch((err) => console.log(err.message));
        });
    },
  },
  computed: {
    autori() {
      return this.$store.state.autori;
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
</style>
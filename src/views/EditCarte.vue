<template>
  <div>
    <h1>Edit</h1>
    <form @submit.prevent="editCarte(carte.id)">
      <div>
        <input
          v-bind:value="formCarte.title"
          id="carteTitle"
          type="text"
          placeholder="Book's Title"
        />
      </div>
      <div>
        <input
          v-bind:value="formCarte.nrOfPages"
          id="carteNrOfPages"
          type="text"
          placeholder="Book's Number of Pages"
        />
      </div>
      <div>
        <textarea
          v-bind:value="formCarte.description"
          id="carteDescription"
          type="text"
          placeholder="Book's Description"
        />
      </div>
      <button v-bind:id="carte.id" class="editeaza">Edit</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "EditCarte",
  data() {
    return {
      formCarte: {},
    };
  },
  props: {
    carte: Object,
  },
  updated() {
    this.formCarte = this.carte;
  },
  computed: {
    carti() {
      return this.$store.state.carti;
    },
  },
  methods: {
    editCarte(id) {
      if (
        document.getElementById("carteTitle").value === "" &&
        document.getElementById("carteNrOfPages").value === ""
      ) {
        console.log("Alegeti o carte pe care doriti sa o editati!");
      } else {
        let requestParameters = utils.globalRequestParameters;
        let token = window.localStorage.getItem("token");
        requestParameters.headers.Authorization = "Bearer " + token;
        requestParameters.method = "PUT";
        let data = {};
        data.id = id;
        data.title = document.getElementById("carteTitle").value;
        data.nrOfPages = document.getElementById("carteNrOfPages").value;
        data.description = document.getElementById("carteDescription").value;
        requestParameters.body = JSON.stringify(data);

        console.log("Vreau sa editez cartea: " + data.id);

        fetch(utils.url + "carti/" + id, requestParameters)
          .then((res) => res.json())
          .then((res) => {
            if (
              res.message === "Decoding error!" ||
              res.message === "Your token expired!"
            )
              console.log("Probleme cu token-ul la editare!");
            else {
              console.log(res.message);
              document.getElementById("carteTitle").value = "";
              document.getElementById("carteNrOfPages").value = "";
              data.description = document.getElementById(
                "carteDescription"
              ).value = "";
              document
                .getElementsByClassName("editeaza")[0]
                .removeAttribute("id");
              this.$store.dispatch("editCarte", data);
            }
          });
      }
    },
  },
};
</script>

<style>
button {
  padding: 5px;
}
</style>
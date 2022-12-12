<template>
  <div>
    <h1>Edit</h1>
    <form @submit.prevent="editAutor(autor.id)">
      <div>
        <input
          v-bind:value="formAutor.firstName"
          id="autorFirstName"
          type="text"
          placeholder="Author's First Name"
        />
      </div>
      <div>
        <input
          v-bind:value="formAutor.lastName"
          id="autorLastName"
          type="text"
          placeholder="Author's Last Name"
        />
      </div>
      <div>
        <input
          v-bind:value="formAutor.age"
          id="autorAge"
          type="text"
          placeholder="Author's Age"
        />
      </div>
      <div>
        <input
          v-bind:value="formAutor.city"
          id="autorCity"
          type="text"
          placeholder="Author's City"
        />
      </div>
      <div>
        <textarea
          rows="4"
          cols="50"
          v-bind:value="formAutor.descriptionAuthor"
          id="autorDescriptionAuthor"
          placeholder="Author's Description"
        />
      </div>
      <button v-bind:id="autor.id" class="editeaza">Edit</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils.js";

export default {
  name: "EditAutor",
  data() {
    return {
      formAutor: {},
    };
  },
  props: {
    autor: Object,
  },
  updated() {
    this.formAutor = this.autor;
  },
  computed: {
    autori() {
      return this.$store.state.autori;
    },
  },
  methods: {
    editAutor(id) {
      if (
        document.getElementById("autorFirstName").value === "" &&
        document.getElementById("autorLastName").value === ""
      ) {
        console.log("Alegeti un autor pe care doriti sa il editati!");
      } else {
        let requestParameters = utils.globalRequestParameters;
        let token = window.localStorage.getItem("token");
        requestParameters.headers.Authorization = "Bearer " + token;
        requestParameters.method = "PUT";
        
        let data = {};
        data.id = id;
        data.firstName = document.getElementById("autorFirstName").value;
        data.lastName = document.getElementById("autorLastName").value;
        data.age = document.getElementById("autorAge").value;
        data.city = document.getElementById("autorCity").value;
        data.descriptionAuthor = document.getElementById(
          "autorDescriptionAuthor"
        ).value;
        requestParameters.body = JSON.stringify(data);

        console.log("Vreau sa editez autorul: " + data.id);

        fetch(utils.url + "autori/" + id, requestParameters)
          .then((res) => res.json())
          .then((res) => {
            if (
              res.message === "Decoding error!" ||
              res.message === "Your token expired!"
            )
              console.log("Probleme cu token-ul la editare!");
            else {
              console.log(res.message);
              document.getElementById("autorFirstName").value = "";
              document.getElementById("autorLastName").value = "";
              document.getElementById("autorAge").value = "";
              document.getElementById("autorCity").value = "";
              document.getElementById("autorDescriptionAuthor").value = "";
              document
                .getElementsByClassName("editeaza")[0]
                .removeAttribute("id");
              this.$store.dispatch("editAutor", data);
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
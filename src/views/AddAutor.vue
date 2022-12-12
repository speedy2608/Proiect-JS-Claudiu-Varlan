
<template>
  <div>
    <form @submit.prevent="addAutor()">
      <div>
        <input
          v-model="firstName"
          type="text"
          placeholder="Author's First Name"
        />
      </div>
      <div>
        <input
          v-model="lastName"
          type="text"
          placeholder="Author's Last Name"
        />
      </div>
      <div>
        <input v-model="age" type="text" placeholder="Author's Age" />
      </div>
      <div>
        <input v-model="city" type="text" placeholder="Author's City" />
      </div>
      <div>
        <input
          v-model="descriptionAuthor"
          type="text"
          placeholder="Author's Description"
        />
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
      firstName: "",
      lastName: "",
      age: "",
      city: "",
      descriptionAuthor: "",
      booksId: "",
    };
  },
  methods: {
    addAutor() {
      console.log(
        "Adding autor... ",
        "First Name: ",
        this.firstName,
        "Last Name: ",
        this.lastName
      );

      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "POST";

      let data = {};
      data.firstName = this.firstName;
      data.lastName = this.lastName;
      data.age = this.age;
      data.city = this.city;
      data.descriptionAuthor = this.descriptionAuthor;
      data.booksId = [];

      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "autori", requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("Probleme cu token-ul la adaugare!");
          } else {
            console.log("Am adaugat autorul cu id-ul: " + res.id);
            data.id = res.id;
            this.$store.dispatch("addAutor", data);
            this.$router.push("/");
          }
        });
    },
  },
};
</script>

<style>
</style>
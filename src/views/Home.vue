<template>
  <div>
    <Autor
      @edit="editAutor"
      :autor="elem"
      v-for="elem in autori"
      :key="elem.id"
    />
    <edit-autor :autor="formAutor" />
  </div>
</template>

<script>
import Autor from "../components/Autor.vue";
import EditAutor from "./EditAutor.vue";
import utils from "../utils.js";

export default {
  name: "Home",
  components: {
    Autor,
    EditAutor,
  },
  data() {
    return {
      formAutor: {},
    };
  },
  created() {
    let url = utils.url;
    let requestParam = utils.globalRequestParameters;
    if (!this.autori.length) {
      fetch(url + "autori", requestParam).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchAutori", res);
        })
      );
    }
  },

  computed: {
    autori() {
      return this.$store.state.autori;
    },
  },
  methods: {
    editAutor(autor) {
      this.formAutor = autor;
    },
  },
};
</script>
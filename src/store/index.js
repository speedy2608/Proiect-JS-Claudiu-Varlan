import { createStore } from 'vuex'

export default createStore({
  state: {
    autori: [],
    carti: [],
    isAuthenticated: false,
  },
  getters: {
    autori: state => {
      return state.autori;
    },
    carti: state => {
      return state.carti;
    },
  },
  mutations: {
    SET_AUTORI: (state, autori) => {
      state.autori = autori;
    },
    SET_CARTI: (state, carti) => {
      state.carti = carti;
    },
    SET_AUTH: (state, status) => {
      state.isAuthenticated = status;
    },
    ADD_AUTOR: (state, autor) => {
      state.autori.push(autor);
    },
    ADD_CARTE: (state, carte) => {
      state.carti.push(carte);
    },
    DELETE_AUTOR: (state, id) => {
      state.autori = state.autori.filter(element => element.id !== id);
    },
    DELETE_CARTE: (state, id) => {
      state.carti = state.carti.filter(element => element.id !== id);
    },
    EDIT_AUTOR: (state, autor) => {
      state.autori = state.autori.map(element => {
        if (element.id === autor.id) {
          if (element.firstName !== autor.firstName)
            element.firstName = autor.firstName;
          if (element.lastName !== autor.lastName)
            element.lastName = autor.lastName;
          if (element.age !== autor.age)
            element.age = autor.age;
          if (element.city !== autor.city)
            element.city = autor.city;
          if (element.descriptionAuthor !== autor.descriptionAuthor)
            element.descriptionAuthor = autor.descriptionAuthor;
          if (element.booksId !== autor.booksId)
            element.booksId = autor.booksId;

        }
        return element;
      })
    },
    EDIT_CARTE: (state, carte) => {
      state.carti = state.carti.map(element => {
        if (element.id === carte.id) {
          if (element.title !== carte.title)
            element.title = carte.title;
          if (element.nrOfPages !== carte.nrOfPages) {
            element.nrOfPages = carte.nrOfPages
          }
        }
        return element;
      })
    }, CHECK_AUTHENTICATED: (state) => {
      if (window.localStorage.getItem('token')) {
        state.isAuthenticated = true;
      }
    }
  },
  actions: {
    fetchAutori: ({ commit }, payload) => {
      commit('SET_AUTORI', payload);
    },
    fetchCarti: ({ commit }, payload) => {
      commit('SET_CARTI', payload);
    },
    login: ({ commit }, payload) => {
      commit('SET_AUTH', payload);
    },
    addAutor: ({ commit }, payload) => {
      commit('ADD_AUTOR', payload);
    },
    addCarte: ({ commit }, payload) => {
      commit('ADD_CARTE', payload);
    },
    deleteAutor: ({ commit }, payload) => {
      commit('DELETE_AUTOR', payload);
    },
    deleteCarte: ({ commit }, payload) => {
      commit('DELETE_CARTE', payload);
    },
    editAutor: ({ commit }, payload) => {
      commit('EDIT_AUTOR', payload);
    },
    editCarte: ({ commit }, payload) => {
      commit('EDIT_CARTE', payload);
    },
    checkAuthenticated: ({ commit }) => {
      commit('CHECK_AUTHENTICATED');
    }
  },
  modules: {
  }
})

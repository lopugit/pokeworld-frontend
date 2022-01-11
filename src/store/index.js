import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import pokeworld from './pokeworld'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const currentStoreVersion = window.localStorage.getItem('storeVersion')
const storeVersion = 8
if (!currentStoreVersion || currentStoreVersion < storeVersion) {
  const store = JSON.parse(window.localStorage.getItem('vuex')) || {}
  window.localStorage.setItem(
    'vuex',
    JSON.stringify({
      pokeworld: {
        user: store && store.pokeworld && store.pokeworld.user,
      },
    })
  )
  window.localStorage.setItem('storeVersion', storeVersion)
}

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      pokeworld,
    },

    plugins: [
      createPersistedState({
        paths: ['pokeworld'],
      }),
    ],
  })
  window.store = Store
  return Store
})

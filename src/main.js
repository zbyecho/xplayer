import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "../src/assets/css/reset.css";
Vue.config.productionTip = false;
Vue.prototype.$scoket = null;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

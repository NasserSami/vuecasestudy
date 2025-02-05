<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>INFO3067 Case Study Application</q-toolbar-title>
        <q-btn flat round dense icon="reorder" class="q-mr-xs">
          <q-menu transition-show="scale" transition-hide="scale">
            <q-list style="min-width: 100px">
              <q-item clickable v-ripple v-close-popup to="/">
                <q-item-section>Home</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-close-popup to="brand">
                <q-item-section>Brands</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-close-popup to="branchlocator">
                <q-item-section>Branches</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-close-popup to="history">
                <q-item-section>Order History</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-close-popup to="register">
                <q-item-section>Register</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-close-popup to="login">
                <q-item-section>Login</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-close-popup to="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="text-center">
        <q-avatar class="q-mb-xs logo" size="1000%" square>
          <img :src="`/img/logo.png`" />
        </q-avatar>
      </div>
      <router-view />
    </q-page-container>
    <q-footer style="background-color: #536493">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-subtitle2">
            Best viewed on mobile devices — Sam Nasser &copy;{{
              new Date().getFullYear()
            }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainLayout",
  setup() {
    return {};
  },
});
</script>

<style scoped>

.logo {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>

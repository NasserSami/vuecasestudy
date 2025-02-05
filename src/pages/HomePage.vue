<template>
  <div class="text-center">
    <div class="text-h2 q-mt-xsm">Home</div>
    <div class="text-h4 q-mt-xl">
      <span v-for="(letter, index) in state.splitMessage" :key="index" class="rocking-letter">
        <template v-if="letter === ' '">&nbsp;</template>
        <template v-else>{{ letter }}</template>
      </span>
      <div class="q-mt-xl">
          <q-btn
            color="primary"
            label="OUR BRANDS"
            :disable="state.qty < 0"
            @click="viewBrands()"
            style="max-width: 25vw; margin-left: 3vw"
          />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    let state = reactive({
      status: "",
      splitMessage: []
    });

    onMounted(() => {
      welcome();
    });

    const welcome = () => {
      if (sessionStorage.getItem("customer")) {
        state.status = "Welcome to our Store!";
        state.splitMessage = state.status.split("");
      }
    };

    const viewBrands = () => {
      router.push("brand");
    };

    return {
      state,
      viewBrands,
    };
  },
};
</script>

<style scoped>
@keyframes rock {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}

.rocking-letter {
  display: inline-block;
  animation: rock 1s infinite ease-in-out;
}
</style>

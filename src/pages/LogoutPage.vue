<template>
  <div class="text-h5 text-center text-primary text-bold q-mt-sm">
    {{ state.status }}
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";

export default {
  setup() {
    let state = reactive({
      status: "",
    });

    onMounted(() => {
      clearCustomer();
    });

    const clearCustomer = () => {
      sessionStorage.removeItem("customer");
      state.customer = [];
      state.status = "Customer Now Logged Out";
    };

    return {
      state,
      clearCustomer,
    };
  },
};
</script>

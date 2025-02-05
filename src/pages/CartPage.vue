<template>
  <div class="text-center">
    <div class="text-h4 q-mt-md text-primary">Cart Contents</div>
    <q-avatar class="q-mt-md" size="xl" square>
      <img :src="`img/cart.png`" />
    </q-avatar>
    <div class="text-h6 text-positive">{{ state.status }}</div>
  </div>

  <q-scroll-area v-if="state.cart.length > 0" style="height: 45vh">
    <q-card class="q-ma-md">
      <q-item separator>
        <q-item-section class="text-left col-5">
          <strong>Name</strong>
        </q-item-section>
        <q-item-section class="text-left col-2">
          <strong>Qty</strong>
        </q-item-section>
        <q-item-section class="text-left col-2 price-section">
          <strong>MSRP</strong>
        </q-item-section>
        <q-item-section class="text-left col-2 price-extended">
          <strong>Extended</strong>
        </q-item-section>
      </q-item>
      <q-list separator>
        <q-item clickable v-for="cartitem in state.cart" :key="cartitem.id">
          <q-item-section class="text-left col-5">
            {{ cartitem.item.productName }}
          </q-item-section>
          <q-item-section class="text-left col-2">
            {{ cartitem.qty }}
          </q-item-section>
          <q-item-section class="text-left col-2 price-section">
            {{ formatCurrency(cartitem.item.msrp) }}
          </q-item-section>
          <q-item-section class="text-left col-2 price-extended">
            {{ formatCurrency(cartitem.item.msrp * cartitem.qty) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-left col-7">
            <strong>Sub:</strong>
          </q-item-section>
          <q-item-section class="text-right col-5">
            {{ formatCurrency(state.subTot) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-left col-7">
            <strong>Tax (13%):</strong>
          </q-item-section>
          <q-item-section class="text-right col-5">
            {{ formatCurrency(state.taxTot) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-left col-7">
            <strong>Total:</strong>
          </q-item-section>
          <q-item-section class="text-right col-5">
            <strong>{{ formatCurrency(state.total) }}</strong>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-scroll-area>

  <q-card-section
    style="display: flex; justify-content: center; align-items: center"
  >
    <q-btn
      class="q-mr-sm shadow-11"
      color="primary"
      label="Checkout"
      :disable="state.cart.length < 1"
      @click="saveCart()"
    />
    <q-btn
      class="shadow-11"
      color="primary"
      label="CLEAR CART"
      @click="clearCart()"
      style="max-width: 25vw; margin-left: 3vw"
    />
  </q-card-section>
</template>

<script>
import { reactive, onMounted } from "vue";
import { formatCurrency } from "../utils/formatutils";
import { poster } from "../utils/apiutil";
export default {
  setup() {
    onMounted(() => {
      loadCart();
    });

    let state = reactive({
      status: "",
      cart: [],
      subTot: 0,
      taxTot: 0,
      total: 0,
    });

    const loadCart = () => {
      if (sessionStorage.getItem("cart")) {
        state.cart = JSON.parse(sessionStorage.getItem("cart"));
        state.cart.forEach((cartitem) => {
          state.subTot += cartitem.item.msrp * cartitem.qty;
        });
        state.taxTot = state.subTot * 0.13;
        state.total = state.subTot + state.taxTot;
      } else {
        state.cart = [];
      }
    };

    const saveCart = async () => {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      let cart = JSON.parse(sessionStorage.getItem("cart"));
      try {
        state.status = "sending order info to server";
        let orderHelper = { email: customer.email, selections: cart };
        let payload = await poster("order", orderHelper);
        if (payload.indexOf("not") > 0) {
          state.status = payload;
        } else {
          clearCart();
          state.status = payload;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error add order: ${err}`;
      }
    };

    const clearCart = () => {
      sessionStorage.removeItem("cart");
      state.cart = [];
      state.subTot = 0;
      state.taxTot = 0;
      state.total = 0;
      state.status = "Cart Cleared";
    };

    return {
      state,
      loadCart,
      clearCart,
      formatCurrency,
      saveCart,
    };
  },
};
</script>

<style scoped>
.price-section {
  padding-left: 1px;
  padding-right: 10px;
  margin-left: 0.5px;
}
.price-extended {
  padding-left: 10px;
  padding-right: 10px;
}
</style>

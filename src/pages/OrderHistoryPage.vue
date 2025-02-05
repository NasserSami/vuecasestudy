<template>
  <div class="text-center">
    <div class="text-h4 q-mt-lg text-primary">Order History</div>
    <div class="text-h6 q-mt-lg text-positive">{{ state.status }}</div>
  </div>

  <q-card class="q-ma-md" v-if="state.orders.length > 0">
    <q-item separator>
      <q-item-section class="col-5 text-primary">
        <strong>#</strong>
      </q-item-section>
      <q-item-section class="col-10 text-primary">
        <strong>Date Created</strong>
      </q-item-section>
    </q-item>
    <q-item
      separator
      clickable
      v-for="order in state.orders"
      :key="order.id"
      @click="selectOrder(order.id)"
    >
      <q-item-section class="col-5">
        {{ order.id }}
      </q-item-section>
      <q-item-section class="col-10">
        {{ formatDate(order.orderDate) }}
      </q-item-section>
      <q-item-section> </q-item-section>
    </q-item>
  </q-card>

  <q-dialog
    v-model="state.orderSelected"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card>
      <q-card-actions algin="right">
        <q-btn flat label="X" color="primary" v-close-popup class="text-h5" />
      </q-card-actions>

      <q-card-section>
        <div class="text-h5 text-center text-primary">
          Order # {{ state.selectedOrder[0].orderId }}
        </div>
        <div class="text-subtitle2 text-center">
          {{ state.selectedOrder[0].orderDate }}
        </div>
      </q-card-section>

      <q-card-section
        style="display: flex; justify-content: center; align-items: center"
      >
        <img :src="`/img/logo.png`" class="q-mt-xsm" style="max-width: 35%; max-height: 35%" />
      </q-card-section>

        <q-card class="q-ma-md">
      <q-list separator>
        <q-item class="text-primary">
          <q-item-section class="col-3">
            <strong>Name</strong>
          </q-item-section>
          <q-item-section class="col-6">
            <div class="text-center">
              <strong>Quantities</strong>
              <div class="row">
                <div class="col-4 text-center"><strong>S</strong></div>
                <div class="col-4 text-center"><strong>O</strong></div>
                <div class="col-4 text-center"><strong>B</strong></div>
              </div>
            </div>
          </q-item-section>
          <q-item-section class="col-2 text-right">
            <strong>Extended</strong>
          </q-item-section>
        </q-item>
           <q-item v-for="item in state.selectedOrder" :key="item.productId">
          <q-item-section class="col-3">{{ item.name }}</q-item-section>
          <q-item-section class="col-6">
            <div class="row">
              <div class="col-4 text-center">{{ item.qtySold }}</div>
              <div class="col-4 text-center">{{ item.qtyOrdered }}</div>
              <div class="col-4 text-center">{{ item.qtyBackOrder }}</div>
            </div>
            </q-item-section>
          <q-item-section class="col-2 text-right">
            {{ formatCurrency(item.qtySold * item.sellingPrice) }}
          </q-item-section>
        </q-item>
        </q-list>
        <q-item>
          <q-item-section class="col-8 text-right">
            <strong>Sub:</strong>
          </q-item-section>
          <q-item-section class="col-4 text-right">
            {{ formatCurrency(state.selectedOrder[0].orderAmount) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-8 text-right">
            <strong>Tax (13%):</strong>
          </q-item-section>
          <q-item-section class="col-4 text-right">
            {{ formatCurrency(state.selectedOrder[0].orderAmount * 0.13) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col-8 text-right text-primary">
            <strong>Total:</strong>
          </q-item-section>
          <q-item-section class="col-4 text-right text-primary">
            <strong>{{ formatCurrency(state.selectedOrder[0].orderAmount * 1.13) }}</strong>
          </q-item-section>
        </q-item>
      </q-card>
       <q-card-section>
        <div class="text-h6 text-center text-positive">
          Details for Order {{ state.selectedOrder[0].orderId }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, onMounted } from "vue";
import { formatDate, formatCurrency } from "../utils/formatutils";
import { fetcher } from "../utils/apiutil";

export default {
  setup() {
    let state = reactive({
      status: "",
      orders: [],
      orderSelected: false,
      selectedOrder: [],
    });

    onMounted(() => {
      loadOrders();
    });

    const loadOrders = async () => {
      try {
        let customer = JSON.parse(sessionStorage.getItem("customer"));
        state.status = "Finding Orders ...";
        state.orders = await fetcher(`order/${customer.email}`);
        state.status = `Loaded ${state.orders.length} Order(s)`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const selectOrder = async (orderId) => {
      try {
        let customer = JSON.parse(sessionStorage.getItem("customer"));
        const payload = await fetcher(`order/${orderId}/${customer.email}`);

        state.orderSelected = true;
        state.dialogStatus = "";
        state.selectedOrder = payload;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    return {
      state,
      formatDate,
      formatCurrency,
      loadOrders,
      selectOrder,
    };
  },
};
</script>

<template>
  <div class="text-center">
    <div class="text-h2 q-mt-xsm">Our Brands</div>

    <div class="status q-mt-md text-subtitle2 text-primary" text-color="red">
      {{ state.status }}
    </div>
    <p></p>
    <q-select
      class="q-mt-lg q-ml-lg"
      v-if="state.brands.length > 0"
      style="width: 50vw; margin-bottom: 4vh; background-color: #fff"
      :option-value="'id'"
      :option-label="'name'"
      model-value=""
      :options="state.brands"
      label="Select a Brand"
      v-model="state.selectedBrandId"
      @update:model-value="getProducts()"
      emit-value
      map-options
    />

    <div
      class="text-h6 text-bold text-center text-primary"
      v-if="state.products.length > 0"
    >
      {{ state.selectedBrand.name }} Products
    </div>
    <q-scroll-area style="height: 55vh">
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item
            clickable
            v-for="product in state.products"
            :key="product.id"
            @click="selectProduct(product.id)"
          >
            <q-item-section avatar>
              <q-avatar style="height: 125px; width: 90px" square>
                <img :src="`/img/${product.graphicName}`" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-top">
              {{ product.productName }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>
  </div>

  <q-dialog
    v-model="state.productSelected"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card>
      <q-card-actions align="right">
        <q-btn flat label="X" color="primary" v-close-popup class="text-h5" />
      </q-card-actions>

      <q-card-section style="text-align: center">
        <img
          :src="`/img/${state.selectedProduct.graphicName}`"
          style="height: 70%; width: 70%"
        />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2 text-center">
          {{ state.selectedProduct.productName }} -
          {{ formatCurrency(state.selectedProduct.msrp) }}
        </div>
      </q-card-section>

      <q-card-section style="text-align: center">
        <q-chip icon="bookmark" color="primary" text-color="white"
          >Details
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            text-color="white"
          >
            {{ state.selectedProduct.description }}
          </q-tooltip>
        </q-chip>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <q-input
            v-model.number="state.qty"
            type="number"
            filled
            placeholder="qty"
            hint="Qty"
            dense
            style="max-width: 12vw"
          />&nbsp;
          <q-btn
            color="primary"
            label="Add To Cart"
            :disable="state.qty < 0"
            @click="addToCart()"
            style="max-width: 25vw; margin-left: 3vw"
          />
          <q-btn
            color="primary"
            label="View Cart"
            :disable="state.qty < 0"
            @click="viewCart()"
            style="max-width: 25vw; margin-left: 3vw"
          />
        </div>
      </q-card-section>

      <q-card-section class="text-center text-positive">
        {{ state.dialogStatus }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { formatCurrency } from "../utils/formatutils";
import { reactive, onMounted } from "vue";
import { fetcher } from "../utils/apiutil";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    onMounted(() => {
      loadBrands();
    });

    let state = reactive({
      status: "",
      brands: [],
      products: [],
      selectedBrand: {},
      selectedBrandId: "",
      selectedProduct: {},
      dialogStatus: "",
      productSelected: false,
      qty: 0,
      cart: [],
    });

    const loadBrands = async () => {
      try {
        state.status = "Finding brands ...";
        state.brands = await fetcher(`Brand`);
        state.status = `Found ${state.brands.length} brands`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const getProducts = async () => {
      try {
        state.selectedBrand = state.brands.find(
          (brand) => brand.id === state.selectedBrandId
        );
        state.status = `Finding products for brand ${state.selectedBrand}...`;
        state.products = await fetcher(`Product/${state.selectedBrand.id}`);
        state.status = `Loaded ${state.products.length} products for ${state.selectedBrand.name}`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const selectProduct = async (productid) => {
      try {
        // q-item click sends us the id, so we need to find the object
        state.selectedProduct = state.products.find(
          (item) => item.id === productid
        );
        state.productSelected = true;
        state.dialogStatus = "";
        if (sessionStorage.getItem("cart")) {
          state.cart = JSON.parse(sessionStorage.getItem("cart"));
        }
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const addToCart = () => {
      let index = -1;
      if (state.cart.length > 0) {
        index = state.cart.findIndex(
          // is item already on the cart
          (item) => item.id === state.selectedProduct.id
        );
      }
      if (state.qty > 0) {
        index === -1 // add
          ? state.cart.push({
              id: state.selectedProduct.id,
              qty: state.qty,
              item: state.selectedProduct,
            })
          : (state.cart[index] = {
              // replace
              id: state.selectedProduct.id,
              qty: state.qty,
              item: state.selectedProduct,
            });
        state.dialogStatus = `${state.qty} product(s) added`;
      } else {
        index === -1 ? null : state.cart.splice(index, 1); // remove
        state.dialogStatus = `product(s) removed`;
      }
      sessionStorage.setItem("cart", JSON.stringify(state.cart));
      state.qty = 0;
    };

    const viewCart = () => {
      router.push("cart");
    };

    return {
      loadBrands,
      getProducts,
      selectProduct,
      addToCart,
      formatCurrency,
      viewCart,
      state,
    };
  },
};
</script>

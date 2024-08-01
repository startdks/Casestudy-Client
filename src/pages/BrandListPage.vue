<template>
  <div class="text-center">
    <q-avatar class="q-mb-md" size="xl" square>
      <img :src="`/img/airplane.jpg`" />
    </q-avatar>
    <div class="text-h2 q-mt-lg">Brand</div>
    <div class="status q-mt-md text-subtitle2 text-negative" text-color="red">
      {{ state.status }}
    </div>
    <q-select
      class="q-mt-lg q-ml-lg"
      v-if="state.brands.length > 0"
      style="width: 50vw; margin-bottom: 4vh; background-color: #fff"
      :option-value="'id'"
      :option-label="'name'"
      model-value=""
      :options="state.brands"
      label="Select a Brands"
      v-model="state.selectedBrandId"
      @update:model-value="getProducts()"
      emit-value
      :map-options="true"
    />
    <div
      class="text-h6 text-bold text-center text-primary"
      v-if="state.products.length > 0"
    >
      {{ state.selectedBrand.name }} ITEMS
    </div>
    <q-scroll-area style="height: 55vh">
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item
            clickable
            v-for="item in state.products"
            :key="item.id"
            @click="selectProducts(item.id)"
          >
            <q-item-section avatar>
              <q-avatar style="height: 125px; width: 90px" square>
                <img :src="`/img/${item.graphicName}.jpg`" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
              {{ item.productName }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>
  </div>
  <q-dialog
    v-model="state.itemSelected"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card>
      <q-card-actions align="right">
        <q-btn flat label="X" color="primary" v-close-popup class="text-h5" />
      </q-card-actions>
      <q-card-section>
        <q-item-section avatar class="flex-center">
          <q-avatar style="height: 125px; width: 90px; margin: 15px" square>
            <img :src="`/img/${state.selectedProducts.graphicName}.jpg`" />
          </q-avatar>
        </q-item-section>
        <div class="text-subtitle2 text-center">
          <b
            >{{ state.selectedProducts.productName }} -
            {{ formatCurrency(state.selectedProducts.msrp) }}</b
          >
        </div>
      </q-card-section>
      <q-card-section class="text-center text-positive">
        <q-chip icon="bookmark" color="primary" text-color="white"
          >Details
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            text-color="white"
          >
            {{ state.selectedProducts.description }}
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
        <q-card-section class="text-center text-positive">
          {{ state.dialogStatus }}
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../utils/apiutil";
import { formatCurrency } from "../utils/formatutils";
import { useRouter } from "vue-router";

export default {
  setup() {
    let state = reactive({
      status: "",
      brands: [],
      products: [],
      selectedBrand: {},
      selectedBrandId: "",
      selectedProducts: {},
      dialogStatus: "",
      itemSelected: false,
      qty: 0,
      cart: [],
    });
    onMounted(() => {
      getBrands();
    });
    const router = useRouter();
    const getBrands = async () => {
      try {
        state.status = "fetching Brands...";
        const fetchedBrands = await fetcher("Brand");
        state.status = `Found ${fetchedBrands.length} result`;
        state.brands = [...fetchedBrands];
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
        state.status = `finding products for brand ${state.selectedBrand}...`;
        state.products = await fetcher(`Products/${state.selectedBrand.id}`);
        state.status = `loaded ${state.products.length} products for
${state.selectedBrand.name}`;
      } catch (err) {
        console.log(err);
        state.status = `Error has occured: ${err.message}`;
      }
    };

    const selectProducts = async (productid) => {
      try {
        // q-item click sends us the id, so we need to find the object
        state.selectedProducts = state.products.find(
          (item) => item.id === productid
        );
        state.itemSelected = true;
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
          (item) => item.id === state.selectedProducts.id
        );
      }
      if (state.qty > 0) {
        index === -1 // add
          ? state.cart.push({
              id: state.selectedProducts.id,
              qty: state.qty,
              item: state.selectedProducts,
            })
          : (state.cart[index] = {
              // replace
              id: state.selectedProducts.id,
              qty: state.qty,
              item: state.selectedProducts,
            });
        state.dialogStatus = `${state.qty} item(s) added`;
      } else {
        index === -1 ? null : state.cart.splice(index, 1); // remove
        state.dialogStatus = `item(s) removed`;
      }
      sessionStorage.setItem("cart", JSON.stringify(state.cart));
      state.qty = 0;
    };

    const viewCart = () => {
      router.push("cart");
    };

    return {
      getBrands,
      getProducts,
      selectProducts,
      formatCurrency,
      addToCart,
      viewCart,
      state,
    };
  },
};
</script>

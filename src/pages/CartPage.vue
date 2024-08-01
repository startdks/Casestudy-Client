<template>
  <div class="text-center">
    <q-avatar class="q-mt-md" size="xl" square>
      <img :src="`/img/airplane.jpg`" />
    </q-avatar>
    <div class="text-h4 q-mt-md text-primary">Cart Contents</div>
    <q-avatar class="q-mt-md" size="xl" square>
      <img :src="`/img/cart.png`" />
    </q-avatar>
    <div class="text-blue text-h6 text-positive">{{ state.status }}</div>
    <q-scroll-area style="height: 55vh" v-show="!state.isHidden">
      <q-card class="q-ma-md">
        <q-list separator>
          <q-item>
            <q-item-section class="text-bold"> Name </q-item-section>
            <q-item-section class="text-bold"> Qty </q-item-section>
            <q-item-section class="text-bold"> MSRP </q-item-section>
            <q-item-section class="text-bold"> Extended </q-item-section>
          </q-item>
          <q-item v-for="cartItem in state.cart" :key="cartItem.id">
            <q-item-section class="col-3 q-ml-sm">
              {{ cartItem.item.productName }}
            </q-item-section>
            <q-item-section class="col-2 q-ml-sm">
              {{ cartItem.qty }}
            </q-item-section>
            <q-item-section class="col-3 q-ml-sm">
              {{ formatCurrency(cartItem.item.msrp) }}
            </q-item-section>
            <q-item-section class="q-ml-sm">
              {{ formatCurrency(cartItem.item.msrp * cartItem.qty) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="col-3 q-ml-sm"> </q-item-section>
            <q-item-section class="col-3 q-ml-sm"> </q-item-section>
            <q-item-section class="col-2 text-bold"> Sub: </q-item-section>
            <q-item-section class="q-ml-sm">
              {{ formatCurrency(state.msrpTotal) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="col-3 q-ml-sm"> </q-item-section>
            <q-item-section class="col-3 q-ml-sm"> </q-item-section>
            <q-item-section class="col-2 text-bold"> Tax(13%): </q-item-section>
            <q-item-section class="q-ml-sm">
              {{ formatCurrency(state.msrpTotal * 0.13) }}
            </q-item-section>
          </q-item>
          <q-item class="text-subtitle1 text-blue text-bold">
            <q-item-section class="col-3 q-ml-sm"> </q-item-section>
            <q-item-section class="col-3 q-ml-sm"> </q-item-section>
            <q-item-section class="col-2 q-ml-sm"> Total: </q-item-section>
            <q-item-section class="q-ml-sm">
              {{ formatCurrency(state.msrpTotal * 1.13) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
      <div class="text-left">
        <q-btn
          color="primary"
          label="Save Cart"
          :disable="state.cart.length < 1"
          @click="saveCart()"
          style="max-width: 40vw; margin-bottom: 3vw; margin-left: 3vw"
        />
        <q-btn
          icon="autorenew"
          color="primary"
          label=" Empty Cart"
          :disable="state.qty < 0"
          @click="emptyCart()"
          style="max-width: 40vw; margin-bottom: 3vw; margin-left: 3vw"
        />
      </div>
    </q-scroll-area>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { formatCurrency } from "../utils/formatutils";
import { poster } from "../utils/apiutil";

export default {
  setup() {
    let state = reactive({
      status: "",
      cart: [],
      msrpTotal: 0,
    });

    onMounted(() => {
      if (JSON.parse(sessionStorage.getItem("cart")) == null) {
        return;
      }
      const fetchedCart = JSON.parse(sessionStorage.getItem("cart"));
      fetchedCart.forEach((item) => {
        state.msrpTotal += item.qty * item.item.msrp;
      });
      state.cart = fetchedCart;
    });

    const emptyCart = () => {
      state.isHidden = true;
      sessionStorage.removeItem("cart");
      state.cart = [];
      state.status = "Cart emptied";
      state.msrpTotal = 0;
    };

    var addUp = (cartItem) => {
      const msrp = cartItem.qty * cartItem.item.msrp;
      console.log(cartItem.qty * cartItem.item.msrp);
      state.msrpTotal += msrp;
      return state.msrpTotal;
    };

    const saveCart = async () => {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      let cart = JSON.parse(sessionStorage.getItem("cart"));
      try {
        state.status = "sending cart info to server";
        let cartHelper = { email: customer.email, selections: cart };
        let payload = await poster("order", cartHelper);
        if (payload.indexOf("not") > 0) {
          state.status = payload;
        } else {
          emptyCart();
          state.status = payload;
        }
      } catch (err) {
        console.log(err);
        state.status = `Error add cart: ${err}`;
      }
    };

    return {
      formatCurrency,
      emptyCart,
      saveCart,
      addUp,
      state,
    };
  },
};
</script>

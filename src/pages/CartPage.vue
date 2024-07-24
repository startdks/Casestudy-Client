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
          <q-item v-for="trayItem in state.tray" :key="trayItem.id">
            <q-item-section class="col-3 q-ml-sm">
              {{ trayItem.item.productName }}
            </q-item-section>
            <q-item-section class="col-2 q-ml-sm">
              {{ trayItem.qty }}
            </q-item-section>
            <q-item-section class="col-3 q-ml-sm">
              {{ formatCurrency(trayItem.item.msrp) }}
            </q-item-section>
            <q-item-section class="q-ml-sm">
              {{ formatCurrency(trayItem.item.msrp * trayItem.qty) }}
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
export default {
  setup() {
    let state = reactive({
      status: "",
      tray: [],
      msrpTotal: 0,
    });

    onMounted(() => {
      if (JSON.parse(sessionStorage.getItem("tray")) == null) {
        return;
      }
      const fetchedTray = JSON.parse(sessionStorage.getItem("tray"));
      fetchedTray.forEach((item) => {
        state.msrpTotal += item.qty * item.item.msrp;
      });
      state.tray = fetchedTray;
    });

    const emptyCart = () => {
      state.isHidden = true;
      sessionStorage.removeItem("tray");
      state.tray = [];
      state.status = "Cart emptied";
      state.msrpTotal = 0;
    };

    var addUp = (trayItem) => {
      const msrp = trayItem.qty * trayItem.item.msrp;
      console.log(trayItem.qty * trayItem.item.msrp);
      state.msrpTotal += msrp;
      return state.msrpTotal;
    };

    return {
      formatCurrency,
      emptyCart,
      addUp,
      state,
    };
  },
};
</script>

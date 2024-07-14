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
          <q-item clickable v-for="item in state.products" :key="item.id">
            <q-item-section avatar>
              <q-avatar style="height: 125px; width: 90px" square>
                <img :src="`/img/${item.graphicName}.jpg`" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-left">
              {{ item.description }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-scroll-area>
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
import { fetcher } from "../utils/apiutil";
export default {
  setup() {
    let state = reactive({
      status: "",
      brands: [],
      products: [],
      selectedBrand: {},
      selectedBrandId: "",
    });
    onMounted(() => {
      getBrands();
    });
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

    return {
      getBrands,
      getProducts,
      state,
    };
  },
};
</script>

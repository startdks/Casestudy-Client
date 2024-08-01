<template>
  <div class="text-h4 text-center q-mt-md q-mb-md text-primary">
    Customer has logged out
  </div>
</template>
<script>
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      sessionStorage.clear();
    });
  },
};
</script>

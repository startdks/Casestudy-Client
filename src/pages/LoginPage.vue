<template>
  <div class="text-h4 text-center q-mt-md q-mb-md text-primary">Login</div>
  <div class="text-title2 text-center text-negative text-bold q-mt-sm">
    {{ state.status }}
  </div>
  <q-card class="q-ma-md q-pa-md">
    <q-form
      ref="myForm"
      class="q-gutter-md"
      greedy
      @submit="login"
      @reset="resetFields"
    >
      <q-input
        outlined
        placeholder="Email Input"
        id="email"
        v-model="state.email"
        :rules="[isRequired, isValidEmail]"
      />
      <q-input
        type="password"
        outlined
        placeholder="Password Input"
        id="password"
        v-model="state.password"
        :rules="[isRequired]"
      />
      <q-btn label="Login" type="submit" />
      <q-btn label="Reset" type="reset" />
    </q-form>
  </q-card>
</template>
<script>
import { onMounted, reactive } from "vue";
import { poster } from "../utils/apiutil";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    onMounted(() => {
      sessionStorage.clear();
    });

    let state = reactive({
      status: "",
      example: "",
    });

    const isRequired = (val) => {
      return !!val || "field is required";
    };

    const router = useRouter();
    const route = useRoute();

    const login = async () => {
      let customerHelper = {
        email: state.email,
        password: state.password,
      };

      let payload = await poster("customer/login", customerHelper);
      try {
        state.status = payload.token;
      } catch (err) {
        state.status = err.message;
      }
      if (!payload.token.includes("failed")) {
        sessionStorage.setItem("customer", JSON.stringify(payload));
        state.status = "login successful";
        route.query.nextUrl
          ? router.push({ path: route.query.nextUrl })
          : router.push({ path: "/" });
      }
    };

    const resetFields = () => {
      state.email = "";
      state.password = "";
      state.status = "";
    };
    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    };

    return {
      state,
      login,
      isRequired,
      resetFields,
      isValidEmail,
    };
  },
};
</script>

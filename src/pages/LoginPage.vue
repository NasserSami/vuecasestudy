<template>
  <div class="text-center">
      <div class="text-h2 q-mt-xsm">Login</div>
    </div>
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
        placeholder="Enter Email"
        id="email"
        v-model="state.email"
        :rules="[isRequired, isValidEmail]"
      />
      <q-input
        outlined
        placeholder="Enter Password"
        id="password"
        type="password"
        v-model="state.password"
        :rules="[isRequired]"
      />
      <q-btn label="Login" type="submit" />
      <q-btn label="Reset" type="reset" />
    </q-form>
  </q-card>
</template>

<script>
import { reactive } from "vue";
import { poster } from "../utils/apiutil";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    let state = reactive({
      status: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    });

    const isRequired = (val) => {
      return !!val || "field is required";
    };

    const login = async () => {
      let customerHelper = {
        email: state.email,
        lastname: state.lastname,
        firstname:state.firstname,
        password: state.password,
      };
      try {
        let payload = await poster("customer/login", customerHelper);
        if (!payload.token.includes("no such customer - login failed") && (!payload.token.includes("username or password invalid - login failed")))  {
          sessionStorage.setItem("customer", JSON.stringify(payload));
          state.status = "login successful";
          route.query.nextUrl
            ? router.push({ path: route.query.nextUrl })
            : router.push({ path: "/" });
        }
        else
        {
          state.status = payload.token
        }
      } catch (err) {
        state.status = err.message;
      }
    };

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    };

    const resetFields = () => {
      state.email = "";
      state.password = "";
      state.status = "";
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

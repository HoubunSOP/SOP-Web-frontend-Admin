<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { SHA256 } from "crypto-js";
import { setAccessTokenCookie, post } from "@/stores/api.js";
import { useToast } from "vue-toastification";

const toast = useToast();
const form = reactive({
  login: "",
  pass: "",
  remember: false,
});

const router = useRouter();

const submit = async () => {
  const hashedPassword = SHA256(form.pass).toString();
  try {
    const endpoint = "/auth";
    const { response, status } = await post(endpoint, {
      user_name: form.login,
      password: hashedPassword,
    });

    if (status.completed) {
      if (response.status === "error") {
        toast.error("登录失败，请检查用户名与密码");
      } else {
        const access_token = response.access_token; // 假设access_token是从响应中获取的字段
        setAccessTokenCookie(access_token, form.remember); // 将access_token保存到Cookies中
        toast.success(`登录成功`);
        router.push("/dashboard");
      }
    } else {
      toast.error("登录失败");
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="用户名" help="请输入您的账户名">
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="密码" help="请输入您的密码">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="记住我"
          :input-value="true"
        />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="登录" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

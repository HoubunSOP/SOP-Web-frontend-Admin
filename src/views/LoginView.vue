<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { setAccessTokenCookie, post } from "@/stores/api.js";
import { useToast } from "vue-toastification";

const toast = useToast();
const form = reactive({
  login: "",
  pass: "",
  remember: false,
});

const router = useRouter();
const AES_KEY = "?D}mznE=g^MW-i45";

const submit = async () => {
  const { encrypted_text: hashedPassword, iv: iv } = encrypt(
    form.pass,
    AES_KEY
  );
  try {
    const endpoint = "/login";
    const { response, status } = await post(endpoint, {
      username: form.login,
      password: hashedPassword,
      aes: true,
      iv: iv,
    });

    if (status.completed) {
      if (response.status !== 200) {
        toast.error(response.message);
      } else {
        const access_token = response.detail.access_token;
        setAccessTokenCookie(access_token, form.remember); // 将access_token保存到Cookies中
        toast.success(`登录成功`);
        router.push("/dashboard");
      }
    } else {
      toast.error("登录失败");
    }
  } catch (error) {
    toast.error("登录失败:" + error.message);
  }
};

function encrypt(plain_text, key) {
  const iv = CryptoJS.lib.WordArray.random(16); // 生成随机IV进行偏移
  const cipher = CryptoJS.AES.encrypt(
    plain_text,
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: iv, //将编码IV解码进行填充
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return {
    encrypted_text: cipher.toString(),
    iv: iv.toString(CryptoJS.enc.Base64),
  }; //返回加密文本及base64编码IV
}
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

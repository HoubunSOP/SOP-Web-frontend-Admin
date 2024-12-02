<script setup>
import { reactive } from "vue";
import { mdiBookEdit, mdiFormatTitle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { useToast } from "vue-toastification";

import { put } from "@/stores/api.js";

const toast = useToast();

const form = reactive({
  username: "",
  password: "",
  user_avatar: "",
  user_bio: "",
  user_position: 0,
});

const submit = async () => {
  try {
    const endpoint = `/users/me`;
    const { response, status } = await put(endpoint, form);

    if (status.completed) {
      if (response.status !== 200) {
        toast.error(`保存出错！${response.message}`);
      } else {
        toast.success("保存成功！");
      }
    } else {
      toast.error("无法保存，可能是网络问题");
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBookEdit" title="设置" main>
      </SectionTitleLineWithButton>

      <CardBox is-form @submit.prevent="submit">
        <FormField label="修改账号">
          <FormControl
            v-model="form.username"
            :icon="mdiFormatTitle"
            placeholder="用户名"
          />
          <FormControl
            v-model="form.password"
            :icon="mdiFormatTitle"
            placeholder="密码"
          />
          <FormControl
            v-model="form.user_avatar"
            :icon="mdiFormatTitle"
            placeholder="用户头像(url链接)"
          />
          <FormControl
            v-model="form.user_bio"
            :icon="mdiFormatTitle"
            placeholder="用户简介"
          />
        </FormField>
        <template #footer>
          <BaseButton type="submit" color="info" label="保存" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

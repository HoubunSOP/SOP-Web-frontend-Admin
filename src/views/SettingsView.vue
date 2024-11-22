<script setup>
import { reactive, onMounted } from "vue";
import { mdiBookEdit, mdiFormatTitle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { useToast } from "vue-toastification";

import { get, post } from "@/stores/api.js";

const toast = useToast();

onMounted(async () => {
  try {
    const endpoint = `/index/settings`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      if (response.status !== 200) {
        toast.error(response.message);
      } else {
        form.topswiper = response.message.topswiper;
      }
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
});
const form = reactive({
  topswiper: "",
});

const submit = async () => {
  try {
    const endpoint = `/index/settings`;
    const { response, status } = await post(endpoint, form);

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
        <FormField label="轮播图设置" help="输入文章id，每个id以半角逗号隔开">
          <FormControl
            v-model="form.topswiper"
            :icon="mdiFormatTitle"
            placeholder="1,2,3,4"
          />
        </FormField>
        <template #footer>
          <BaseButton type="submit" color="info" label="保存" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

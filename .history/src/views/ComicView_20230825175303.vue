<script setup>
import { reactive, ref } from "vue";
import { mdiBookEdit, mdiFormatTitle, mdiCalendarClock，mdiPalette  } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const form = reactive({
  name: "",
  time: getCurrentDate(),
  content: "",
  author: "",
  cover: "",
  magazine: "",
});

const submit = () => {
  if (form.magazine == "" || form.name) {
    formStatusCurrent.value = 4;
    return;
  }
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
  console.log(form);
};

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = [
  { color: "info", title: "请填写/修改下面的字段后点击保存按钮" },
  { color: "success", title: "保存成功!" },
  { color: "danger", title: "保存失败! 请检查网络以及权限问题" },
  { color: "warning", title: "正在保存至服务器中..." },
  { color: "danger", title: "保存失败! 请检查是否参数有遗漏" },
];
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBookEdit"
        title="添加/修改漫画"
        main
      >
      </SectionTitleLineWithButton>

      <CardBox is-form @submit.prevent="submit">
        <NotificationBarInCard
          :color="formStatusOptions[formStatusCurrent].color"
          :is-placed-with-header="formStatusWithHeader"
        >
          <span>{{ formStatusOptions[formStatusCurrent].title }}</span>
        </NotificationBarInCard>
        <FormField
          label="标题以及日期"
          help="第一个为漫画标题，第二个为漫画发布日期"
        >
          <FormControl
            v-model="form.name"
            :icon="mdiFormatTitle"
            placeholder="漫画标题"
          />
          <FormControl
            v-model="form.time"
            type="date"
            :icon="mdiCalendarClock"
            placeholder="选择日期"
          />
        </FormField>
        <FormField label="漫画简介">
          <mavon-editor v-model="form.content" />
        </FormField>
        <BaseDivider />

        <FormField label="漫画封面与作者">
          <FormControl
            v-model="form.author"
            :icon="mdiFormatTitle"
            placeholder="漫画作者"
          />
          <FormControl
            v-model="form.cover"
            type="url"
            :icon="mdiCalendarClock"
            placeholder="漫画封面(图片链接)"
          />
        </FormField>
        <FormField label="刊物类型">
          <FormCheckRadioGroup
            v-model="form.magazine"
            name="magazine"
            type="radio"
            :options="{
              kirara: 'Kirara',
              max: 'MAX',
              carat: 'Carat',
              forward: 'Forward',
            }"
          />
        </FormField>
        <template #footer>
          <BaseButton type="submit" color="info" label="Submit" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

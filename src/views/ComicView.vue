<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  mdiBookEdit,
  mdiFormatTitle,
  mdiCalendarClock,
  mdiPalette,
  mdiImage,
} from "@mdi/js";
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
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

import { useRouter } from "vue-router";
import { get, post } from "@/stores/api.js";
const toast = useToast();

const router = useRouter();
const route = useRoute();
const id = route.params.id;
let isNewComic = false;
if (id == null) {
  isNewComic = true;
}
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
onMounted(async () => {
  if (!isNewComic) {
    try {
      const endpoint = `/comic/${route.params.id}?md=1`;
      const { response, status } = await get(endpoint);

      if (status.completed) {
        if (response.status === "error") {
          router.push("/");
          toast.error(response.message);
        } else {
          form.name = response.message.comic_name;
          form.time = response.message.comic_date;
          form.content = response.message.comic_intro;
          form.cover = response.message.comic_cover;
          form.author = response.message.comic_author;
          form.magazine = response.message.category_id;
        }
      }
    } catch (error) {
      // 处理请求错误的逻辑
    }
  }
});
const form = reactive({
  comic_id: isNewComic ? 0 : route.params.id,
  name: "",
  time: getCurrentDate(),
  content: "",
  author: "",
  cover: "https://houbunsha.co.jp/img/mv_img/con_item_nPrn_1.png",
  magazine: 0,
  auto: 0,
});

const submit = async () => {
  if (form.magazine == "" || form.name == "") {
    formStatusCurrent.value = 4;
    return;
  }
  formStatusCurrent.value = 3;
  try {
    const endpoint = `/comic/new`;
    const { response, status } = await post(endpoint, form);

    if (status.completed) {
      if (response.status === "error") {
        formStatusCurrent.value = 2;
      } else {
        formStatusCurrent.value = 1;
        toast.success("保存成功！");
        router.push("/list/comic");
      }
    } else {
      formStatusCurrent.value = 2;
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = [
  {
    color: "info",
    title: isNewComic
      ? "请填写下面的字段后点击保存按钮"
      : "请修改下面的字段后点击保存按钮",
  },
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
        :title="isNewComic ? '添加漫画' : '修改漫画'"
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

        <FormField label="漫画封面与作者" help="默认封面为芳文社官网的默认封面">
          <FormControl
            v-model="form.author"
            :icon="mdiPalette"
            placeholder="漫画作者"
          />
          <FormControl
            v-model="form.cover"
            type="url"
            :icon="mdiImage"
            placeholder="漫画封面(图片链接)"
          />
        </FormField>
        <FormField label="刊物类型">
          <FormCheckRadioGroup
            v-model="form.magazine"
            name="magazine"
            type="radio"
            :options="{
              1: 'Kirara',
              2: 'MAX',
              3: 'Carat',
              4: 'Forward',
            }"
          />
        </FormField>
        <template #footer>
          <BaseButton type="submit" color="info" label="保存" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

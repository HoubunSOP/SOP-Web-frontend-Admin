<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  mdiBookEdit,
  mdiFormatTitle,
  mdiCalendarClock,
  mdiPalette,
  mdiImage,
  mdiRenameBox,
} from "@mdi/js";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { get, post, put } from "@/stores/api.js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import CardBox from "@/components/CardBox.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import BaseButton from "@/components/BaseButton.vue";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const isNewComic = id == null;

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const form = reactive({
  name: "",
  original_name: "",
  date: getCurrentDate(),
  intro: "",
  author_name: "",
  cover: "https://www.dokidokivisual.com/wordpress/wp-content/themes/kiraraweb/assets/images/common/common/img_nowprinting.png",
  auto: 0,
  cid:'',
  isbn:0,
  volume:1,
  category: {
    id: 0,
    name: "",
  },
});

const formStatusCurrent = ref(0);
const formStatusWithHeader = ref(true);
const GetStatus = ref(true);
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

onMounted(async () => {
  if (!isNewComic) {
    GetStatus.value = false;
    try {
      const endpoint = `/comics/${route.params.id}?edit=true`;
      const { response, status } = await get(endpoint);

      if (status.completed) {
        if (response.status !== 200) {
          toast.error(response?.message || "无法获取漫画详情");
          router.push("/");
        } else {
          GetStatus.value = true;
          form.name = response.detail.name;
          form.original_name = response.detail.original_name;
          form.date = response.detail.date;
          form.intro = response.detail.intro;
          form.cover = response.detail.cover;
          form.author_name = response.detail.author.name;
          form.category = response.detail.categories[0];
          console.log(form);
        }
      }
    } catch (error) {
      toast.error(error || "无法获取漫画详情");
      router.push("/");
    }
  }
});

const submit = async () => {
  if (!form.category.id || !form.name) {
    formStatusCurrent.value = 4;
    return;
  }

  formStatusCurrent.value = 3;

  try {
    const endpoint = `/comics`;
    console.log(form);
    let status;

    if (isNewComic) {
      const { status: responseStatus } = await post(endpoint, form);

      status = responseStatus;
    } else {
      const { status: responseStatus } = await put(
        `${endpoint}/${route.params.id}`,
        form
      );
      status = responseStatus;
    }

    if (status.completed) {
      formStatusCurrent.value = 1;
      toast.success("保存成功！");
      router.push("/list/comic");
    } else {
      formStatusCurrent.value = 2;
    }
  } catch (error) {
    console.error("保存数据失败：", error);
    formStatusCurrent.value = 2;
  }
};
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

      <CardBox v-if="GetStatus" is-form @submit.prevent="submit">
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
            v-model="form.date"
            type="date"
            :icon="mdiCalendarClock"
            placeholder="选择日期"
          />
        </FormField>
        <FormField label="漫画简介">
          <mavon-editor v-model="form.intro" />
        </FormField>
        <BaseDivider />

        <FormField label="漫画作者与漫画原名" help="漫画作者和原名应与同系列/同作者的字符串相同来更好的让后端链接">
          <FormControl
            v-model="form.author_name"
            :icon="mdiPalette"
            placeholder="漫画作者"
          />
          <FormControl
            v-model="form.original_name"
            :icon="mdiRenameBox"
            placeholder="漫画原名"
          />
        </FormField>
        <FormField
          label="漫画封面与刊物类型"
          help="默认封面为芳文社官网的默认封面"
        >
          <FormControl
            v-model="form.cover"
            type="url"
            :icon="mdiImage"
            placeholder="漫画封面(图片链接)"
          />
          <FormCheckRadioGroup
            v-model="form.category.id"
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
        <FormField
          label="漫画其他信息"
          help="漫画官网链接、ISBN号和卷数等信息"
        >
          <FormControl
            v-model="form.cid"
            :icon="mdiRenameBox"
            placeholder="漫画原链接(指向官网)"
          />
          <FormControl
            v-model="form.isbn"
            :icon="mdiRenameBox"
            type="number"
            placeholder="漫画ISBN"
          />
          <FormControl
            v-model="form.volume"
            :icon="mdiRenameBox"
            type="number"
            placeholder="漫画卷数"
          />
        </FormField>

        <template #footer>
          <BaseButton type="submit" color="info" label="保存" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  mdiBookEdit,
  mdiFormatTitle,
  mdiCalendarClock,
  mdiImage,
  mdiMinus,
  mdiPlus,
  mdiBook,
  mdiLink,
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
const isNewMangazine = id == null;

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const form = reactive({
  name: "",
  link: "",
  publish_date: getCurrentDate(),
  intro: "",
  cover: "https://houbunsha.co.jp/img/mv_img/con_item_nPrn_1.png",
  category: {
    id: 0,
    name: "",
  },
  comics: [""],
});

const formStatusCurrent = ref(0);
const formStatusWithHeader = ref(true);
const GetStatus = ref(true);
const formStatusOptions = [
  {
    color: "info",
    title: isNewMangazine
      ? "请填写下面的字段后点击保存按钮"
      : "请修改下面的字段后点击保存按钮",
  },
  { color: "success", title: "保存成功!" },
  { color: "danger", title: "保存失败! 请检查网络以及权限问题" },
  { color: "warning", title: "正在保存至服务器中..." },
  { color: "danger", title: "保存失败! 请检查是否参数有遗漏" },
];

onMounted(async () => {
  if (!isNewMangazine) {
    GetStatus.value = false;
    try {
      const endpoint = `/magazines/${route.params.id}?edit=true`;
      const { response, status } = await get(endpoint);

      if (status.completed) {
        if (response.status !== 200) {
          toast.error(response?.message || "无法获取杂志详情");
          router.push("/");
        } else {
          GetStatus.value = true;
          form.name = response.detail.magazine.name;
          form.link = response.detail.magazine.link;
          form.publish_date = response.detail.magazine.publish_date;
          form.intro = response.detail.magazine.intro;
          form.cover = response.detail.magazine.cover;
          form.category = response.detail.categories[0];
          form.comics = response.detail.comics;
          console.log(form);
        }
      }
    } catch (error) {
      toast.error(error || "无法获取杂志详情");
      router.push("/");
    }
  }
});

const submit = async () => {
  if (!form.category.id || !form.name || !form.category.id) {
    formStatusCurrent.value = 4;
    return;
  }
  // 过滤掉空值
  form.comics = form.comics.filter((comic) => comic.trim() !== "");
  formStatusCurrent.value = 3;

  try {
    const endpoint = `/magazines`;
    console.log(form);
    let status;

    if (isNewMangazine) {
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
      router.push("/list/mangazine");
    } else {
      formStatusCurrent.value = 2;
    }
  } catch (error) {
    console.error("保存数据失败：", error);
    formStatusCurrent.value = 2;
  }
};

const addMangazine = (index) => {
  // 在指定索引后插入一个新项
  form.comics.splice(index + 1, 0, "");
};

const removeMangazine = (index) => {
  // 删除指定索引项
  if (form.comics.length > 1) {
    form.comics.splice(index, 1);
  } else {
    toast.warning("至少需要一个关联漫画");
  }
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBookEdit"
        :title="isNewMangazine ? '添加杂志' : '修改杂志'"
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
          help="第一个为杂志标题，第二个为杂志发布日期"
        >
          <FormControl
            v-model="form.name"
            :icon="mdiFormatTitle"
            placeholder="杂志标题"
          />
          <FormControl
            v-model="form.publish_date"
            type="date"
            :icon="mdiCalendarClock"
            placeholder="选择日期"
          />
        </FormField>
        <FormField label="杂志简介">
          <mavon-editor v-model="form.intro" />
        </FormField>
        <BaseDivider />

        <FormField
          label="杂志原链接、封面与分类"
          help="杂志原链接应填写芳文社官方链接。默认封面为芳文社官网的默认封面"
        >
          <FormControl
            v-model="form.link"
            type="url"
            :icon="mdiLink"
            placeholder="杂志链接"
          />
          <FormControl
            class="w-full"
            v-model="form.cover"
            type="url"
            :icon="mdiImage"
            placeholder="杂志封面(图片链接)"
          />
          <FormCheckRadioGroup
            v-model="form.category.id"
            name="magazine"
            type="radio"
            :options="{
              7: 'Kirara',
              8: 'MAX',
              9: 'Carat',
              10: 'Forward',
            }"
          />
        </FormField>
        <FormField
          label="关联漫画原名"
          help="为了方便后端查询，请填写漫画数据中的原名部分以便用户搜索"
        >
          <div
            v-for="(comic, index) in form.comics"
            :key="index"
            class="flex w-full mb-4"
          >
            <FormControl
              class="w-full"
              v-model="form.comics[index]"
              :icon="mdiBook"
              placeholder="杂志关联漫画原名"
            />
            <BaseButton
              color="info"
              class="mx-4 my-auto"
              :icon="mdiPlus"
              small
              @click="addMangazine(index)"
            />
            <BaseButton
              color="danger"
              class="my-auto"
              :icon="mdiMinus"
              small
              @click="removeMangazine(index)"
            />
          </div>
        </FormField>
        <template #footer>
          <BaseButton type="submit" color="info" label="保存" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

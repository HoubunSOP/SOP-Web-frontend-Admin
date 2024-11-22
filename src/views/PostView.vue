<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  mdiBookEdit,
  mdiFormatTitle,
  mdiCalendarClock,
  mdiImage,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
import { useRoute } from "vue-router";
import { get, post, put } from "@/stores/api.js";
import { useToast } from "vue-toastification";

const toast = useToast();
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const id = route.params.id;
let isNewPost = false;
let categoryId = 0;
if (id == null) {
  isNewPost = true;
} else {
  isNewPost = false;
}
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const submit = async () => {
  if (!form.content || !form.title) {
    formStatusCurrent.value = 4;
    return;
  }
  formStatusCurrent.value = 3;
  try {
    const endpoint = `/articles`;
    console.log(form);
    let status;

    if (isNewPost) {
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
      router.push("/list/post");
    } else {
      formStatusCurrent.value = 2;
    }
  } catch (error) {
    console.error("保存数据失败：", error);
    formStatusCurrent.value = 2;
  }
};

const selectOptions = ref([]);

onMounted(async () => {
  if (!isNewPost) {
    try {
      const endpoint = `/articles/${route.params.id}?edit=true`;
      const { response, status } = await get(endpoint);

      if (status.completed) {
        if (response.status !== 200) {
          router.push("/");
          toast.error(response.message);
        } else {
          form.title = response.detail.title;
          form.date = response.detail.date;
          form.content = response.detail.content;
          form.cover = response.detail.cover;
          categoryId = response.detail.categories[0].id;
          form.recommended = response.detail.recommended ? 1 : 0;
        }
      }
    } catch (error) {
      console.error("获取文章数据失败：", error);
    }
  }
  try {
    const endpoint = `/categories?category_type_id=2`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      selectOptions.value = response.detail.map((item) => {
        return { id: item.id, label: `${item.id} - ${item.name}` };
      });
      const catIndex = selectOptions.value.findIndex(
        (item) => item.id === parseInt(categoryId)
      );
      form.categories = selectOptions.value[catIndex];
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
});

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = [
  {
    color: "info",
    title: isNewPost
      ? "请填写下面的字段后点击保存按钮"
      : "请修改下面的字段后点击保存按钮",
  },
  { color: "success", title: "保存成功!" },
  { color: "danger", title: "保存失败! 请检查网络以及权限问题" },
  { color: "warning", title: "正在保存至服务器中..." },
  { color: "danger", title: "保存失败! 请检查是否参数有遗漏" },
];

const form = reactive({
  title: "",
  date: getCurrentDate(),
  content: "",
  cover: "",
  categories: selectOptions.value[0],
  recommended: "",
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBookEdit"
        :title="isNewPost ? '添加文章' : '修改文章'"
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
          help="第一个为文章标题，第二个为文章发布日期"
        >
          <FormControl
            v-model="form.title"
            :icon="mdiFormatTitle"
            placeholder="文章标题"
          />
          <FormControl
            v-model="form.date"
            type="date"
            :icon="mdiCalendarClock"
            placeholder="选择日期"
          />
        </FormField>
        <FormField label="文章内容">
          <mavon-editor v-model="form.content" />
        </FormField>
        <BaseDivider />

        <FormField label="文章封面与文章分类">
          <FormControl
            v-model="form.cover"
            type="url"
            :icon="mdiImage"
            placeholder="文章封面(图片链接)"
          />
          <FormControl v-model="form.categories" :options="selectOptions" />
        </FormField>
        <FormField label="是否为推荐文章">
          <FormCheckRadioGroup
            v-model="form.recommended"
            name="recommended"
            type="radio"
            :options="{
              0: '否',
              1: '是',
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

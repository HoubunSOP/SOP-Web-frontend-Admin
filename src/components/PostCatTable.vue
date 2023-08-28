<script setup>
import { ref } from "vue";
import { mdiEye, mdiPencil, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import { get, put } from "@/stores/api.js";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
const toast = useToast();
const items = ref({ message: { articles: [] } });
const perPage = ref(15);
const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const catId = ref(0);
const articleCount = ref(0);
const rename = ref("");

const fetchData = async () => {
  try {
    const endpoint = `/category/list?type=%E6%96%87%E7%AB%A0`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      if (response.status === "error") {
        toast.error("无法get数据:" + response.message);
      }
      items.value = response;
      perPage.value = response.message.length;
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};

fetchData();

const redirectToExternalSite = (id) => {
  const url = `https://www.fwgxt.top/list/post?c=${id}`;
  window.open(url, "_blank");
};

const delhandleConfirm = async () => {
  try {
    const endpoint = `/category/del/${catId.value}`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      if (response.status === "error") {
        toast.error("无法进行删除:" + response.message);
      } else {
        toast.success("删除分类成功！");
        fetchData();
      }
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};
const renamehandleConfirm = async () => {
  try {
    const data = {
      new_name: rename.value,
      category_id: catId.value,
    };
    console.log(data);
    const endpoint = `/category/rename/`;
    const { response, status } = await put(endpoint, data);

    if (status.completed) {
      if (response.status === "error") {
        toast.error("无法进行重命名:" + response.message);
      } else {
        toast.success("重命名分类成功！");
        fetchData();
      }
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};
</script>
<template>
  <CardBoxModal
    v-model="isModalActive"
    title="重命名分类"
    button="warning"
    button-label="确定"
    has-cancel
    @confirm="renamehandleConfirm"
  >
    <FormField label="重命名分类" help="请输入重命名后的名称">
      <FormControl v-model="rename" :icon="mdiPencil" />
    </FormField>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="您确定要删除此分类吗"
    button="danger"
    button-label="确定"
    has-cancel
    @confirm="delhandleConfirm"
  >
    <p>请注意，这个操作是 <b>不可撤销的</b></p>
    <p v-if="articleCount > 0">
      检测到此分类下还有{{
        articleCount
      }}篇文章，这大概率在后端是被禁止删除的，请将所有文章都移至其他分类后再点击确定
    </p>
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>名称</th>
        <th>文章数量</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in items.message" :key="client.id">
        <td data-label="id">
          {{ client.id }}
        </td>
        <td data-label="name">
          {{ client.name }}
        </td>
        <td data-label="article_count" class="lg:w-[6rem] whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.article_count"
            >{{ client.article_count }}</small
          >
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="redirectToExternalSite(client.id)"
            ></BaseButton>
            <BaseButton
              color="warning"
              :icon="mdiPencil"
              small
              @click="
                isModalActive = true;
                catId = client.id;
                rename = client.name;
              "
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="
                isModalDangerActive = true;
                catId = client.id;
                articleCount = client.article_count;
              "
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
</template>

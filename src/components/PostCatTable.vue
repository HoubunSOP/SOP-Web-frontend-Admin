<script setup>
import { ref } from "vue";
import { mdiEye, mdiPencil, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { get } from "@/stores/api.js";

const items = ref({ message: { articles: [] } });
const perPage = ref(15);
const isModalActive = ref(false);
const isModalDangerActive = ref(false);

const fetchData = async () => {
  try {
    const endpoint = `/category/list?type=%E6%96%87%E7%AB%A0`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      items.value = response;
      perPage.value = response.message.length;
    } else {
      // 处理请求错误的逻辑
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
</script>
<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
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
              @click="isModalActive = true"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
</template>

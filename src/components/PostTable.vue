<script setup>
import { ref, computed } from "vue";
import { mdiEye, mdiPencil, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { deleter, get } from "@/stores/api.js";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const items = ref([]);
const currentPage = ref(0);
const perPage = ref(15);
const numPages = ref(0);
const postId = ref(0);
const isModalDangerActive = ref(false);

const fetchData = async () => {
  try {
    const endpoint = `/list/articles?limit=${perPage.value}&page=${
      currentPage.value + 1
    }`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      items.value = response.detail.items;
      numPages.value = response.detail.total_pages;
    } else {
      // 处理请求错误的逻辑
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};

fetchData();
const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const visiblePagesList = computed(() => {
  const visiblePages = [];
  const totalVisiblePages = 5; // 可见页码的总数
  const currentPageIndex = currentPage.value;
  const totalPages = numPages.value;

  if (totalPages <= totalVisiblePages) {
    visiblePages.push(...pagesList.value);
  } else {
    const halfVisiblePages = Math.floor(totalVisiblePages / 2);
    const startPage = Math.max(0, currentPageIndex - halfVisiblePages);
    const endPage = Math.min(
      totalPages - 1,
      currentPageIndex + halfVisiblePages
    );

    const hasStartEllipsis = startPage > 1;
    const hasEndEllipsis = endPage < totalPages - 2;

    if (hasStartEllipsis) {
      visiblePages.push(0, "...");
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    if (hasEndEllipsis) {
      visiblePages.push("...", totalPages - 1);
    }
  }

  return visiblePages;
});

const formatPageLabel = (page) => {
  if (typeof page === "number") {
    return String(page + 1);
  } else {
    return page;
  }
};

const handlePageClick = (page) => {
  if (page === "...") {
    const increment = currentPage.value < numPages.value - 1 ? 1 : -1;
    currentPage.value += increment;
  } else {
    currentPage.value = page;
  }
};

const redirectToExternalSite = (id) => {
  const url = `http://127.0.0.1:3000/post/${id}`;
  window.open(url, "_blank");
};
const redirectToEdit = (id) => {
  router.push(`/post/${id}`);
};
const delhandleConfirm = async () => {
  try {
    const endpoint = `/articles/${postId.value}`;
    const { response, status } = await deleter(endpoint);

    if (status.completed) {
      if (response.status !== 200) {
        toast.error("无法进行删除:" + response.message);
      } else {
        toast.success("删除文章成功！");
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
    v-model="isModalDangerActive"
    title="您确定要删除此文章吗"
    button="danger"
    button-label="确定"
    has-cancel
    @confirm="delhandleConfirm"
  >
    <p>请注意，这个操作是 <b>不可撤销的</b></p>
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>名称</th>
        <th>分类</th>
        <th>是否为推荐文章</th>
        <th>时间</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in items" :key="client.id">
        <td data-label="id">
          {{ client.id }}
        </td>
        <td data-label="title">
          {{ client.title }}
        </td>
        <td data-label="category">
          {{ client.categories[0].name }}
        </td>
        <td class="text-center" data-label="recommended">
          <span v-if="client.recommended == 1">✅</span>
          <span v-else>⛔</span>
        </td>
        <td data-label="date" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.date"
            >{{ client.date }}</small
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
              @click="redirectToEdit(client.id)"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="
                isModalDangerActive = true;
                postId = client.id;
              "
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in visiblePagesList"
          :key="page"
          :active="page === currentPage"
          :label="formatPageLabel(page)"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="handlePageClick(page)"
        />
      </BaseButtons>
      <small>第 {{ currentPage + 1 }} 页/共 {{ numPages }} 页</small>
    </BaseLevel>
  </div>
</template>

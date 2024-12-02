<script setup>
import { onMounted, reactive } from "vue";
import { mdiBook, mdiNote, mdiFormatListBulletedTriangle } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useToast } from "vue-toastification";
import { get } from "@/stores/api.js";

const toast = useToast();
const form = reactive({
  comic_count: 0,
  article_count: 0,
  category_count: 0,
  comic_author_count: 0,
  magazine_count: 0,
  auto_comic_count: 0,
});
onMounted(async () => {
  try {
    const endpoint = `/counts`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      if (response.status !== 200) {
        toast.error(response.message);
      } else {
        form.comic_count = response.detail.comics;
        form.article_count = response.detail.articles;
        form.category_count = response.detail.categories;
        form.comic_author_count = response.detail.comic_authors;
        form.magazine_count = response.detail.magazines;
        form.auto_comic_count = response.detail.auto_comics;
      }
    }
  } catch (error) {
    // 无需处理
  }
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiBook"
          :number="form.comic_count"
          suffix="本"
          label="漫画"
        />
        <CardBoxWidget
          color="text-yellow-500"
          :icon="mdiBook"
          :number="form.magazine_count"
          suffix="本"
          label="杂志"
        />
        <CardBoxWidget
          color="text-blue-500"
          :icon="mdiNote"
          :number="form.article_count"
          suffix="篇"
          label="文章"
        />
        <CardBoxWidget
          color="text-red-500"
          :icon="mdiBook"
          :number="form.auto_comic_count"
          suffix="本"
          label="需校对漫画"
        />
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiBook"
          :number="form.comic_author_count"
          suffix="位"
          label="漫画作者"
        />
        <CardBoxWidget
          color="text-blue-500"
          :icon="mdiFormatListBulletedTriangle"
          :number="form.category_count"
          suffix="个"
          label="文章分类"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

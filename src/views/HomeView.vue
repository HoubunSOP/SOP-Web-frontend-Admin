<script setup>
import { ref, onMounted, reactive } from "vue";
import { mdiBook, mdiNote, mdiFormatListBulletedTriangle } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useToast } from "vue-toastification";
import { get } from "@/stores/api.js";

const toast = useToast();
const chartData = ref(null);
const form = reactive({
  comic_count: 0,
  article_count: 0,
  category_count: 0,
});
const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(async () => {
  try {
    const endpoint = `/index/stats`;
    const { response, status } = await get(endpoint);

    if (status.completed) {
      if (response.status !== 200) {
        toast.error(response.message);
      } else {
        form.comic_count = response.message.comic_count;
        form.article_count = response.message.article_count;
        form.category_count = response.message.category_count;
      }
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
  fillChartData();
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
          color="text-blue-500"
          :icon="mdiNote"
          :number="form.article_count"
          suffix="篇"
          label="文章"
        />
        <CardBoxWidget
          color="text-red-500"
          :icon="mdiFormatListBulletedTriangle"
          :number="form.category_count"
          suffix="个"
          label="文章分类"
        />
      </div>

      <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="flex flex-col justify-between">
          <CardBoxTransaction
            amount="1"
            date="2022.2.2"
            business="test"
            type="invoice"
            name="同步芳文社官网漫画信息"
          />
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

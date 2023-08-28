<script setup>
import SectionMain from "@/components/SectionMain.vue";
import PostCatTable from "@/components/PostCatTable.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import PostCatTitle from "@/components/PostCatTitle.vue";
import { mdiFormatListBulletedTriangle } from "@mdi/js";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <PostCatTitle
        :icon="mdiFormatListBulletedTriangle"
        title="文章分类列表"
        main
      >
      </PostCatTitle>
      <CardBox class="mb-6" has-table>
        <PostCatTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

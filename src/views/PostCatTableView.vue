<script setup>
import SectionMain from "@/components/SectionMain.vue";
import PostCatTable from "@/components/PostCatTable.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { mdiFormatListBulletedTriangle } from "@mdi/js";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFormatListBulletedTriangle"
        title="文章分类列表"
        main
      >
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <PostCatTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

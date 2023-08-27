<script setup>
import SectionMain from "@/components/SectionMain.vue";
import PostTable from "@/components/PostTable.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { mdiFormatListBulletedSquare } from "@mdi/js";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFormatListBulletedSquare"
        title="文章列表"
        main
      >
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <PostTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

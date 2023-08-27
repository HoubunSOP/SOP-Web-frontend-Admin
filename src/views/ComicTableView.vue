<script setup>
import SectionMain from "@/components/SectionMain.vue";
import ComicTable from "@/components/ComicTable.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { mdiFormatListText } from "@mdi/js";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFormatListText"
        title="漫画列表"
        main
      >
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <ComicTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

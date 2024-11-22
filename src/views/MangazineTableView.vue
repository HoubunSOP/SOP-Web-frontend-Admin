<script setup>
import SectionMain from "@/components/SectionMain.vue";

import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { mdiFormatListText } from "@mdi/js";
import MangazineTable from "@/components/MangazineTable.vue";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiFormatListText"
        title="杂志列表"
        main
      >
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <MangazineTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

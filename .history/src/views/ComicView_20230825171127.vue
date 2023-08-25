<script setup>
import { reactive, ref } from "vue";
import { mdiBallotOutline, mdiAccount, mdiCalendarClock } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";

const selectOptions = [
  { id: 1, label: "Business development" },
  { id: 2, label: "Marketing" },
  { id: 3, label: "Sales" },
];

const form = reactive({
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "",
  department: selectOptions[0],
  subject: "",
  question: "",
});

const customElementsForm = reactive({
  checkbox: ["lorem"],
  radio: "one",
  switch: ["one"],
  file: null,
});

const submit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = [
  { color: "info", title: "请填写/修改下面的字段后点击保存按钮" },
  { color: "success", title: "保存成功!" },
  { color: "danger", title: "保存失败! 请检查网络以及权限问题" },
  { color: "warning", title: "正在保存至服务器中..." },
];

const color = formStatusOptions[formStatusCurrent.value].color);
const title = formStatusOptions[formStatusCurrent.value].title);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        title="Forms example"
        main
      >
      </SectionTitleLineWithButton>

      <CardBox is-form @submit.prevent="submit">
        <NotificationBarInCard
          :color="formStatusOptions[formStatusCurrent['color']]"
          :is-placed-with-header="formStatusWithHeader"
        >
          <span>{{ formStatusOptions[formStatusCurrent.title] }}</span>
        </NotificationBarInCard>
        <FormField label="Grouped with icons">
          <FormControl v-model="form.name" :icon="mdiAccount" />
          <FormControl
            v-model="form.email"
            type="email"
            :icon="mdiCalendarClock"
          />
        </FormField>

        <FormField label="With help line" help="Do not enter the leading zero">
          <FormControl
            v-model="form.phone"
            type="tel"
            placeholder="Your phone number"
          />
        </FormField>

        <FormField label="Dropdown">
          <FormControl v-model="form.department" :options="selectOptions" />
        </FormField>

        <BaseDivider />

        <FormField label="Question" help="Your question. Max 255 characters">
          <FormControl
            type="textarea"
            placeholder="Explain how we can help you"
          />
        </FormField>
        <FormField label="Radio">
          <FormCheckRadioGroup
            v-model="customElementsForm.radio"
            name="sample-radio"
            type="radio"
            :options="{ one: 'One', two: 'Two' }"
          />
        </FormField>
        <template #footer>
          <BaseButton type="submit" color="info" label="Submit" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

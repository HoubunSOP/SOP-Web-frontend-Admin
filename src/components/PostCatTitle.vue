<script setup>
import { mdiPlus, mdiPencil } from "@mdi/js";
import { useSlots, computed, ref } from "vue";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import IconRounded from "@/components/IconRounded.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import { post } from "@/stores/api.js";
import { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

const toast = useToast();
defineProps({
  icon: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  main: Boolean,
});
const newCat = ref("");
const isDangerActive = ref(false);
const hasSlot = computed(() => useSlots().default);

const newCathandleConfirm = async () => {
  try {
    const data = {
      name: newCat.value,
      type: "文章",
    };
    const endpoint = `/category/new/`;
    const { response, status } = await post(endpoint, data);

    if (status.completed) {
      if (response.status === "error") {
        toast.error("无法创建:" + response.message);
      } else {
        toast.success("分类创建成功！请刷新此页面");
      }
    }
  } catch (error) {
    // 处理请求错误的逻辑
  }
};
</script>

<template>
  <section
    :class="{ 'pt-6': !main }"
    class="mb-6 flex items-center justify-between"
  >
    <div class="flex items-center justify-start">
      <IconRounded
        v-if="icon && main"
        :icon="icon"
        color="light"
        class="mr-3"
        bg
      />
      <BaseIcon v-else-if="icon" :path="icon" class="mr-2" size="20" />
      <h1 :class="main ? 'text-3xl' : 'text-2xl'" class="leading-tight">
        {{ title }}
      </h1>
    </div>
    <slot v-if="hasSlot" />
    <BaseButton
      v-else
      :icon="mdiPlus"
      color="whiteDark"
      @click="isDangerActive = true"
    />
    <CardBoxModal
      v-model="isDangerActive"
      title="新建分类"
      button="info"
      button-label="确定"
      has-cancel
      @confirm="newCathandleConfirm"
    >
      <FormField label="新建分类" help="请输入新分类的名称">
        <FormControl v-model="newCat" :icon="mdiPencil" />
      </FormField>
    </CardBoxModal>
  </section>
</template>

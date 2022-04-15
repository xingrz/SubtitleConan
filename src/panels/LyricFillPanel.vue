<template>
  <panel-unit title="填充">
    <a-form-item label="颜色">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="7em">
          <a-input v-model:value="props.fill.color" prefix="#" class="monospace" />
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import PanelUnit from '@/components/PanelUnit.vue';

export interface FillAttrs {
  color: string;
}

const props = defineProps<{
  fill: FillAttrs;
}>();
</script>

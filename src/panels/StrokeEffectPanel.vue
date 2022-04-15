<template>
  <panel-unit title="描边">
    <a-form-item label="颜色">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="7em">
          <a-input v-model:value="props.stroke.color" prefix="#" class="monospace" />
        </a-col>
        <a-col flex="8em">
          <a-input-number v-model:value="props.stroke.opacity" addon-before="%" :min="0" :max="100" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '100px' }">
          <a-slider v-model:value="props.stroke.opacity" :min="0" :max="100" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="宽度">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.stroke.width" addon-after="px" :min="0" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.stroke.width" :min="0" :max="20" />
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import PanelUnit from '@/components/PanelUnit.vue';

export interface StrokeAttrs {
  color: string;
  opacity: number;
  width: number;
}

const props = defineProps<{
  stroke: StrokeAttrs;
}>();
</script>

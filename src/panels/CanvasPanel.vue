<template>
  <panel-unit title="画布大小">
    <a-form-item label="宽度">
      <a-row type="flex" :gutter="[8]" align="middle">
        <a-col flex="10em">
          <a-input-number v-model:value="props.canvas.width" :disabled="props.canvas.clipWidth && !backgroundEnabled"
            addon-after="px" class="monospace" />
        </a-col>
        <a-col>
          <a-checkbox v-model:checked="props.canvas.clipWidth" :disabled="backgroundEnabled">
            裁切
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="高度">
      <a-row type="flex" :gutter="[8]" align="middle">
        <a-col flex="10em">
          <a-input-number v-model:value="props.canvas.height" :disabled="props.canvas.clipHeight && !backgroundEnabled"
            addon-after="px" class="monospace" />
        </a-col>
        <a-col>
          <a-checkbox v-model:checked="props.canvas.clipHeight" :disabled="backgroundEnabled">
            裁切
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import PanelUnit from '@/components/PanelUnit.vue';

export interface CanvasAttrs {
  width: number;
  height: number;
  clipWidth: boolean;
  clipHeight: boolean;
}

const props = defineProps<{
  canvas: CanvasAttrs;
  backgroundEnabled: boolean;
}>();
</script>

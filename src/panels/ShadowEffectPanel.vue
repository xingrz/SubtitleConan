<template>
  <panel-unit title="阴影">
    <a-form-item label="颜色">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="7em">
          <a-input v-model:value="props.shadow.color" prefix="#" class="monospace" />
        </a-col>
        <a-col flex="8em">
          <a-input-number v-model:value="props.shadow.opacity" addon-before="%" :min="0" :max="100" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '100px' }">
          <a-slider v-model:value="props.shadow.opacity" :min="0" :max="100" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="偏移">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.shadow.offsetX" addon-after="px" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.shadow.offsetX" :min="-10" :max="10" />
        </a-col>
      </a-row>
      <a-row type="flex" :gutter="[8]" :style="{ marginTop: '8px' }">
        <a-col flex="8em">
          <a-input-number v-model:value="props.shadow.offsetY" addon-after="px" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.shadow.offsetY" :min="-10" :max="10" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="模糊">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.shadow.blur" addon-after="px" :min="0" :max="100" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.shadow.blur" :min="0" :max="100" />
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import PanelUnit from '@/components/PanelUnit.vue';

export interface ShadowAttrs {
  color: string;
  opacity: number;
  blur: number;
  offsetX: number;
  offsetY: number;
}

const props = defineProps<{
  shadow: ShadowAttrs;
}>();
</script>

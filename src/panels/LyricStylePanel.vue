<template>
  <panel-unit :title="title">
    <a-form-item label="字体">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="auto">
          <a-input v-model:value="props.font.family" />
        </a-col>
        <a-col flex="8em">
          <a-select v-model:value="props.font.weight" :options="fontWeightOptions" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="字号">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.font.size" :min="0" addon-after="px" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.font.size" :min="0" :max="100" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="间距">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.attrs.spacing" :min="-10" addon-after="px" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.attrs.spacing" :min="-10" :max="10" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="缩放">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.attrs.scale" :min="1" addon-before="%" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.attrs.scale" :min="50" :max="150" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="边距">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="8em">
          <a-input-number v-model:value="props.attrs.bottom" :min="-20" addon-after="px" class="monospace" />
        </a-col>
        <a-col flex="auto" :style="{ maxWidth: '200px' }">
          <a-slider v-model:value="props.attrs.bottom" :min="props.bottomMin" :max="props.bottomMax" />
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { SelectProps } from 'ant-design-vue';

import PanelUnit from '@/components/PanelUnit.vue';

import { Font, FontWeightNames } from '@/utils/font';

export interface TextAttrs {
  spacing: number;
  scale: number;
  bottom: number;
}

const props = defineProps<{
  title: string;
  font: Font;
  attrs: TextAttrs;
  bottomMin: number;
  bottomMax: number;
}>();

const fontWeightOptions = ref<SelectProps['options']>(FontWeightNames
  .map(({ weight, name }) => ({ value: weight, label: name })));
</script>

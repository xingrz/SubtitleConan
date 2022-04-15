<template>
  <panel-unit title="预览">
    <a-form-item label="缩放">
      <a-row type="flex" :gutter="[8]">
        <a-col flex="auto" :style="{ maxWidth: '300px' }">
          <a-slider v-model:value="props.preview.scale" :min="10" :max="100"
            :marks="{ 10: '10%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }" />
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="背景">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-radio-group v-model:value="props.preview.backgroundEnabled">
            <a-radio-button :value="false">透明</a-radio-button>
            <a-radio-button :value="true">视频</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col flex="auto" v-show="props.preview.backgroundEnabled">
          <a-upload :customRequest="loadPreview" :showUploadList="false">
            <a-button type="primary" :loading="preview.loading">选择视频</a-button>
          </a-upload>
        </a-col>
      </a-row>
      <a-row type="flex" :gutter="[8]" :style="{ marginTop: '8px' }"
        v-if="props.preview.backgroundEnabled && preview.duration > 0">
        <a-col flex="auto">
          <a-slider v-model:value="preview.current" :min="0" :max="preview.duration" />
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, watch } from 'vue';
import { once } from 'events';
import captureFrame from '@/utils/captureFrame';

import PanelUnit from '@/components/PanelUnit.vue';

export interface PreviewAttrs {
  scale: number;
  backgroundEnabled: boolean;
  backgroundImage?: string;
}

export interface BackgroundSize {
  width: number;
  height: number;
}

const props = defineProps<{
  preview: PreviewAttrs;
}>();

const emit = defineEmits<{
  (e: 'background-ready', size: BackgroundSize): void;
}>();

const preview = reactive({
  loading: false,
  duration: 0,
  current: 0,
});

const video = document.createElement('video');
video.defaultMuted = true;

async function loadPreview({ file }: { file: File }): Promise<void> {
  preview.loading = true;
  video.src = URL.createObjectURL(file);
  await once(video, 'canplaythrough');

  emit('background-ready', { width: video.videoWidth, height: video.videoHeight });

  preview.duration = video.duration;
  preview.current = 0;
  await seekPreview(0);

  preview.loading = false;
}

async function seekPreview(time: number): Promise<void> {
  video.currentTime = time;
  await once(video, 'seeked');
  props.preview.backgroundImage = captureFrame(video);
}

watch(preview, ({ current }) => seekPreview(current));
</script>

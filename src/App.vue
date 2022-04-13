<template>
  <div id="main-nav">
    <a-tabs type="card">
      <a-tab-pane key="lyrics" tab="文本">
        <a-textarea :style="{ fontFamily: 'monospace', height: '200px' }" v-model:value="lyricsText" />
      </a-tab-pane>
      <a-tab-pane key="style" tab="样式">
        <a-form :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 14, style: { maxWidth: '600px' } }">
          <h4>汉字</h4>
          <a-form-item label="字体">
            <a-input-group>
              <a-input v-model:value="kanjiFontFamily" class="monospace" :style="{ width: '16em' }" />
              <a-input-number v-model:value="kanjiFontSize" addon-after="px" class="monospace"
                :style="{ marginLeft: '8px', width: '8em' }" />
              <a-select v-model:value="kanjiFontWeight" :options="fontWeightOptions"
                :style="{ marginLeft: '8px', width: '8em' }" />
            </a-input-group>
          </a-form-item>
          <a-form-item label="边距">
            <a-slider :min="0" :max="200" v-model:value="kanjiBottom" />
          </a-form-item>
          <h4>注音</h4>
          <a-form-item label="字体">
            <a-input-group>
              <a-input v-model:value="hinagaraFontFamily" class="monospace" :style="{ width: '16em' }" />
              <a-input-number v-model:value="hinagaraFontSize" addon-after="px" class="monospace"
                :style="{ marginLeft: '8px', width: '8em' }" />
              <a-select v-model:value="hinagaraFontWeight" :options="fontWeightOptions"
                :style="{ marginLeft: '8px', width: '8em' }" />
            </a-input-group>
          </a-form-item>
          <a-form-item label="边距">
            <a-slider :min="0" :max="200" v-model:value="hinagaraBottom" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="canvas" tab="画布">
        <a-form :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 14 }">
          <a-form-item label="宽度">
            <a-input-group>
              <a-input-number v-model:value="canvasWidth" :disabled="canvasWidthAuto" addon-after="px" class="monospace"
                :style="{ width: '10em' }" />
              <a-checkbox v-model:checked="canvasWidthAuto" :style="{ marginLeft: '24px', lineHeight: '32px' }">
                裁切
              </a-checkbox>
            </a-input-group>
          </a-form-item>
          <a-form-item label="高度">
            <a-input-group>
              <a-input-number v-model:value="canvasHeight" :disabled="canvasHeightAuto" addon-after="px"
                class="monospace" :style="{ width: '10em' }" />
              <a-checkbox v-model:checked="canvasHeightAuto" :style="{ marginLeft: '24px', lineHeight: '32px' }">
                裁切
              </a-checkbox>
            </a-input-group>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div id="lyrics">
    <div v-for="lyric in lyrics" :style="{ margin: '10px' }">
      <lyric :canvas-width="canvasWidthAuto ? undefined : canvasWidth"
        :canvas-height="canvasHeightAuto ? undefined : canvasHeight" :kanji-font="kanjiFont"
        :kanji-height="kanjiFontSize" :kanji-bottom="kanjiBottom" :hinagara-font="hinagaraFont"
        :hinagara-height="hinagaraFontSize" :hinagara-bottom="hinagaraBottom" :sentence="lyric" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { SelectProps } from 'ant-design-vue';

import Lyric from '@/components/Lyric.vue';
import parseLyrics from '@/utils/parseLyrics';

const canvasWidth = ref(1920);
const canvasWidthAuto = ref(true);
const canvasHeight = ref(1080);
const canvasHeightAuto = ref(true);

const fontWeightOptions = ref<SelectProps['options']>([
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
])

const kanjiFontFamily = ref('A-OTF Shin Go Pro');
const kanjiFontSize = ref(40);
const kanjiFontWeight = ref(400);
const kanjiFont = computed(() => `${kanjiFontWeight.value} ${kanjiFontSize.value}px "${kanjiFontFamily.value}"`);

const hinagaraFontFamily = ref('A-OTF Shin Go Pro');
const hinagaraFontSize = ref(20);
const hinagaraFontWeight = ref(600);
const hinagaraFont = computed(() => `${hinagaraFontWeight.value} ${hinagaraFontSize.value}px "${hinagaraFontFamily.value}"`);

const kanjiBottom = ref(10);
const hinagaraBottom = ref(0);

const lyricsText = ref('[君|きみ]と[僕|ぼく]とは[別|べつ]の[人間|いきもの]だから');
const lyrics = computed(() => parseLyrics(lyricsText.value));
</script>

<style lang="scss">
body {
  background: #283237;
}

#main-nav {
  padding: 8px;

  >.ant-tabs-card {
    .ant-tabs-content {
      margin-top: -16px;

      >.ant-tabs-tabpane {
        padding: 32px;
        background: #fff;
      }
    }

    .ant-tabs-tab {
      background: transparent;
      border: none;

      >.ant-tabs-tab-btn {
        color: white;
      }
    }

    .ant-tabs-tab-active {
      background: #fff;

      >.ant-tabs-tab-btn {
        color: black;
      }
    }
  }

  .ant-form-item:last-of-type {
    margin-bottom: 0;
  }
}

.monospace {
  font-family: monospace;
}
</style>

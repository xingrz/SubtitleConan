<template>
  <div id="main-nav">
    <a-tabs type="card">
      <template #rightExtra>
        <a-row :gutter="[8]">
          <a-col>
            <a-button type="primary" :loading="exporting" @click="exportImages">
              <template #icon>
                <ExportOutlined />
              </template>
              导出
            </a-button>
          </a-col>
        </a-row>
      </template>

      <a-tab-pane key="lyrics" tab="文本">
        <a-textarea :style="{ fontFamily: 'monospace', height: '200px' }" v-model:value="lyricsText" />
      </a-tab-pane>

      <a-tab-pane key="style" tab="样式">
        <panel>
          <lyric-style-panel title="汉字" :font="kanjiFont" :attrs="kanjiAttrs" :bottom-min="-20" :bottom-max="300" />
          <lyric-style-panel title="注音" :font="hinagaraFont" :attrs="hinagaraAttrs" :bottom-min="-20"
            :bottom-max="100" />
          <lyric-fill-panel :fill="fillAttrs" />
        </panel>
      </a-tab-pane>

      <a-tab-pane key="effects" tab="效果">
        <panel>
          <shadow-effect-panel :shadow="shadowAttrs" />
          <stroke-effect-panel :stroke="strokeAttrs" />
        </panel>
      </a-tab-pane>

      <a-tab-pane key="canvas" tab="画布">
        <panel>
          <canvas-panel :canvas="canvasAttrs" :background-enabled="previewAttrs.backgroundEnabled" />
          <preview-panel :preview="previewAttrs" @background-ready="onPreviewReady" />
        </panel>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div id="lyrics">
    <div v-for="(lyric, index) in lyrics" :style="{ margin: '10px' }">
      <lyric :canvas-width="canvasStyle.width" :canvas-height="canvasStyle.height" :canvas-scale="previewStyle.scale"
        :color="color" :shadow="shadowStyle" :stroke="strokeStyle" :kanji="kanjiStyle" :hinagara="hinagaraStyle"
        :sentence="lyric" :background="previewStyle.background" @render="(image) => images[index] = image" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ExportOutlined } from '@ant-design/icons-vue';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import Panel from '@/components/Panel.vue';
import Lyric, { LyricStyle } from '@/components/Lyric.vue';

import LyricStylePanel, { TextAttrs } from '@/panels/LyricStylePanel.vue';
import LyricFillPanel, { FillAttrs } from '@/panels/LyricFillPanel.vue';
import ShadowEffectPanel, { ShadowAttrs } from '@/panels/ShadowEffectPanel.vue';
import StrokeEffectPanel, { StrokeAttrs } from '@/panels/StrokeEffectPanel.vue';
import CanvasPanel, { CanvasAttrs } from '@/panels/CanvasPanel.vue';
import PreviewPanel, { BackgroundSize, PreviewAttrs } from '@/panels/PreviewPanel.vue';

import { Shadow } from '@/utils/shadow';
import { Stroke } from '@/utils/stroke';
import parseLyrics from '@/utils/parseLyrics';
import rgba from '@/utils/rgba';
import { Font, FontWeight, toFontStyle } from '@/utils/font';

const lyricsText = ref('[君|きみ]と[僕|ぼく]とは[別|べつ]の[人間|いきもの]だから');
const lyrics = computed(() => parseLyrics(lyricsText.value));

const kanjiFont = reactive<Font>({
  family: 'A-OTF Shin Go Pro',
  size: 40,
  weight: FontWeight.REGULAR,
});

const kanjiAttrs = reactive<TextAttrs>({
  spacing: -2,
  scale: 110,
  bottom: 10,
});

const kanjiStyle = computed<LyricStyle>(() => ({
  font: toFontStyle(kanjiFont),
  height: kanjiFont.size,
  spacing: kanjiAttrs.spacing,
  scale: kanjiAttrs.scale / 100,
  bottom: kanjiAttrs.bottom,
}));

const hinagaraFont = reactive<Font>({
  family: 'A-OTF Shin Go Pro',
  size: 20,
  weight: FontWeight.SEMI_BOLD,
});

const hinagaraAttrs = reactive<TextAttrs>({
  spacing: -2,
  scale: 110,
  bottom: 0,
});

const hinagaraStyle = computed<LyricStyle>(() => ({
  font: toFontStyle(hinagaraFont),
  height: hinagaraFont.size,
  spacing: hinagaraAttrs.spacing,
  scale: hinagaraAttrs.scale / 100,
  bottom: hinagaraAttrs.bottom,
}));

const fillAttrs = reactive<FillAttrs>({
  color: 'FFFFFF',
});

const color = computed(() => `#${fillAttrs.color}`);

const shadowAttrs = reactive<ShadowAttrs>({
  color: '000000',
  opacity: 100,
  blur: 2,
  offsetX: 2,
  offsetY: 2,
});

const shadowStyle = computed<Shadow>(() => ({
  color: rgba(shadowAttrs.color, shadowAttrs.opacity / 100),
  blur: shadowAttrs.blur,
  offsetX: shadowAttrs.offsetX,
  offsetY: shadowAttrs.offsetY,
}));

const strokeAttrs = reactive<StrokeAttrs>({
  color: '000000',
  opacity: 0,
  width: 0,
});

const strokeStyle = computed<Stroke>(() => ({
  color: rgba(strokeAttrs.color, strokeAttrs.opacity / 100),
  width: strokeAttrs.width,
}));

const canvasAttrs = reactive<CanvasAttrs>({
  width: 1920,
  height: 1080,
  clipWidth: false,
  clipHeight: true,
});

const canvasStyle = computed(() => ({
  width: canvasAttrs.clipWidth && !previewAttrs.backgroundEnabled ? undefined : canvasAttrs.width,
  height: canvasAttrs.clipHeight && !previewAttrs.backgroundEnabled ? undefined : canvasAttrs.height,
}));

const previewAttrs = reactive<PreviewAttrs>({
  scale: 100,
  backgroundEnabled: false,
});

const previewStyle = computed(() => ({
  scale: previewAttrs.scale / 100,
  background: previewAttrs.backgroundEnabled ? previewAttrs.backgroundImage : undefined,
}));

function onPreviewReady({ width, height }: BackgroundSize) {
  canvasAttrs.width = width;
  canvasAttrs.height = height;
  canvasAttrs.clipWidth = false;
  canvasAttrs.clipHeight = false;
}

const images: string[] = [];
const exporting = ref(false);
async function exportImages() {
  exporting.value = true;

  const zip = new JSZip();
  const suffix = 'data:image/png;base64,';
  for (let i = 0; i < lyrics.value.length; i++) {
    if (images[i] && images[i].startsWith(suffix)) {
      zip.file(`${i}.png`, images[i].substring(suffix.length), { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'lyrics.zip');

  exporting.value = false;
}
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
      padding-bottom: 12px;

      >.ant-tabs-tab-btn {
        color: white;
      }
    }

    .ant-tabs-extra-content {
      align-self: flex-start;
    }

    .ant-tabs-tab-active {
      background: #fff;

      >.ant-tabs-tab-btn {
        color: black;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.monospace {
  font-family: monospace;
}
</style>

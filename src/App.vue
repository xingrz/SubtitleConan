<template>
  <div id="main-nav">
    <a-tabs type="card">
      <template #rightExtra>
        <a-button type="primary" :loading="exporting" @click="exportImages">
          <template #icon>
            <DownloadOutlined />
          </template>
          保存所有图片
        </a-button>
      </template>

      <a-tab-pane key="lyrics" tab="文本">
        <a-textarea :style="{ fontFamily: 'monospace', height: '200px' }" v-model:value="lyricsText" />
      </a-tab-pane>

      <a-tab-pane key="style" tab="样式">
        <a-row :gutter="[32, 16]">
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>汉字</h4>
              <a-form-item label="字体">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="auto">
                    <a-input v-model:value="kanjiFont.family" />
                  </a-col>
                  <a-col flex="8em">
                    <a-select v-model:value="kanjiFont.weight" :options="fontWeightOptions" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="字号">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="kanjiFont.size" :min="0" addon-after="px" class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="kanjiFont.size" :min="0" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="边距">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="kanjiAttrs.bottom" :min="-20" addon-after="px" class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="kanjiAttrs.bottom" :min="-20" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>注音</h4>
              <a-form-item label="字体">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="auto">
                    <a-input v-model:value="hinagaraFont.family" />
                  </a-col>
                  <a-col flex="8em">
                    <a-select v-model:value="hinagaraFont.weight" :options="fontWeightOptions" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="字号">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="hinagaraFont.size" :min="0" addon-after="px" class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="hinagaraFont.size" :min="0" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="边距">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="hinagaraAttrs.bottom" :min="-20" addon-after="px"
                      class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="hinagaraAttrs.bottom" :min="-20" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>填充</h4>
              <a-form-item label="颜色">
                <a-input v-model:value="colorValue" prefix="#" class="monospace" :style="{ width: '7em' }" />
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key="effects" tab="效果">
        <a-row :gutter="[32, 16]">
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>阴影</h4>
              <a-form-item label="颜色">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="6em">
                    <a-input v-model:value="shadow.color" class="monospace" :style="{ width: '7em' }" prefix="#" />
                  </a-col>
                  <a-col flex="8em">
                    <a-input-number v-model:value="shadow.opacity" addon-before="%" :min="0" :max="100"
                      class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '100px' }">
                    <a-slider v-model:value="shadow.opacity" :min="0" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="偏移">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="shadow.offsetX" addon-after="px" class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="shadow.offsetX" :min="-10" :max="10" />
                  </a-col>
                </a-row>
                <a-row type="flex" :gutter="[8]" :style="{ marginTop: '8px' }">
                  <a-col flex="8em">
                    <a-input-number v-model:value="shadow.offsetY" addon-after="px" class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="shadow.offsetY" :min="-10" :max="10" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="模糊">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="shadow.blur" addon-after="px" :min="0" :max="100"
                      class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="shadow.blur" :min="0" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>描边</h4>
              <a-form-item label="颜色">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="6em">
                    <a-input v-model:value="stroke.color" class="monospace" :style="{ width: '7em' }" prefix="#" />
                  </a-col>
                  <a-col flex="8em">
                    <a-input-number v-model:value="stroke.opacity" addon-before="%" :min="0" :max="100"
                      class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '100px' }">
                    <a-slider v-model:value="stroke.opacity" :min="0" :max="100" />
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item label="宽度">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="8em">
                    <a-input-number v-model:value="stroke.width" addon-after="px" :min="0" class="monospace" />
                  </a-col>
                  <a-col flex="auto" :style="{ maxWidth: '200px' }">
                    <a-slider v-model:value="stroke.width" :min="0" :max="20" />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key="canvas" tab="画布">
        <a-row :gutter="[32, 16]">
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>画布大小</h4>
              <a-form-item label="宽度">
                <a-input-group>
                  <a-input-number v-model:value="canvasWidth" :disabled="canvasWidthAuto" addon-after="px"
                    class="monospace" :style="{ width: '10em' }" />
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
          </a-col>
          <a-col :span="12">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
              <h4>预览</h4>
              <a-form-item label="缩放">
                <a-row type="flex" :gutter="[8]">
                  <a-col flex="auto" :style="{ maxWidth: '300px' }">
                    <a-slider v-model:value="canvasScale" :min="10" :max="100"
                      :marks="{ 10: '10%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }" />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div id="lyrics">
    <div v-for="(lyric, index) in lyrics" :style="{ margin: '10px' }">
      <lyric :canvas-width="canvasWidthAuto ? undefined : canvasWidth"
        :canvas-height="canvasHeightAuto ? undefined : canvasHeight" :canvas-scale="canvasScale" :color="color"
        :shadow="shadowStyle" :stroke="strokeStyle" :kanji="kanjiStyle" :hinagara="hinagaraStyle" :sentence="lyric"
        @render="(image) => images[index] = image" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { SelectProps } from 'ant-design-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import Lyric, { Shadow, Stroke, Style } from '@/components/Lyric.vue';
import parseLyrics from '@/utils/parseLyrics';
import rgba from '@/utils/rgba';
import { Font, FontWeight, toFontStyle } from '@/utils/font';

const labelCol = { style: { width: '60px', textAlign: 'left' } };
const wrapperCol = { span: 24, style: { maxWidth: '400px' } };

const canvasWidth = ref(1920);
const canvasWidthAuto = ref(false);
const canvasHeight = ref(1080);
const canvasHeightAuto = ref(true);
const canvasScale = ref(100);

const fontWeightOptions = ref<SelectProps['options']>([
  { value: FontWeight.THIN, label: 'Thin' },
  { value: FontWeight.EXTRA_LIGHT, label: 'Extra Light' },
  { value: FontWeight.LIGHT, label: 'Light' },
  { value: FontWeight.REGULAR, label: 'Regular' },
  { value: FontWeight.MEDIUM, label: 'Medium' },
  { value: FontWeight.SEMI_BOLD, label: 'Semi Bold' },
  { value: FontWeight.BOLD, label: 'Bold' },
  { value: FontWeight.EXTRA_BOLD, label: 'Extra Bold' },
  { value: FontWeight.BLACK, label: 'Black' },
]);

const kanjiFont = reactive<Font>({
  family: 'A-OTF Shin Go Pro',
  size: 40,
  weight: FontWeight.REGULAR,
});

const kanjiAttrs = reactive({
  bottom: 10,
});

const kanjiStyle = computed<Style>(() => ({
  font: toFontStyle(kanjiFont),
  height: kanjiFont.size,
  bottom: kanjiAttrs.bottom,
}));

const hinagaraFont = reactive<Font>({
  family: 'A-OTF Shin Go Pro',
  size: 20,
  weight: FontWeight.SEMI_BOLD,
});

const hinagaraAttrs = reactive({
  bottom: 0,
});

const hinagaraStyle = computed<Style>(() => ({
  font: toFontStyle(hinagaraFont),
  height: hinagaraFont.size,
  bottom: hinagaraAttrs.bottom,
}));

const colorValue = ref('FFFFFF');
const color = computed(() => `#${colorValue.value}`);

const shadow = reactive({
  color: '000000',
  opacity: 100,
  blur: 2,
  offsetX: 2,
  offsetY: 2,
});

const shadowStyle = computed<Shadow>(() => ({
  color: rgba(shadow.color, shadow.opacity / 100),
  blur: shadow.blur,
  offsetX: shadow.offsetX,
  offsetY: shadow.offsetY,
}));

const stroke = reactive({
  color: '000000',
  opacity: 0,
  width: 0,
});

const strokeStyle = computed<Stroke>(() => ({
  color: rgba(stroke.color, stroke.opacity / 100),
  width: stroke.width,
}));

const lyricsText = ref('[君|きみ]と[僕|ぼく]とは[別|べつ]の[人間|いきもの]だから');
const lyrics = computed(() => parseLyrics(lyricsText.value));

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
      padding-bottom: 8px;

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

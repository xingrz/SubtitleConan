<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="12">
      <preview :kanji-font="kanjiFont" :kanji-top="kanjiTop" :hinagara-font="hinagaraFont" :hinagara-top="hinagaraTop"
        :line-height="lineHeight" :lyrics-text="lyricsText" />
    </a-col>
    <a-col :span="12">
      <a-card>
        <a-row :gutter="[16, 16]">
          <a-col :span="24" :style="{ fontFamily: 'monospace' }">
            <a-input v-model:value="kanjiFont" />
          </a-col>
          <a-col :span="24" :style="{ fontFamily: 'monospace' }">
            <a-input v-model:value="hinagaraFont" />
          </a-col>
          <a-col :span="24">
            <a-slider :min="0" :max="200" v-model:value="kanjiTop" />
          </a-col>
          <a-col :span="24">
            <a-slider :min="0" :max="200" v-model:value="hinagaraTop" />
          </a-col>
          <a-col :span="24">
            <a-slider :min="0" :max="200" v-model:value="lineHeight" />
          </a-col>
          <a-col :span="24">
            <a-textarea :style="{ fontFamily: 'monospace', height: '400px' }" v-model:value="lyricsText" />
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Preview from '@/components/Preview.vue';

const kanjiFont = ref('400 40px "A-OTF Shin Go Pro"');
const hinagaraFont = ref('400 20px "A-OTF Shin Go Pro"');
const kanjiTop = ref(60);
const hinagaraTop = ref(20);
const lineHeight = ref(70);
const lyricsText = ref('[君|きみ]と[僕|ぼく]とは[別|べつ]の[人間|いきもの]だから');
</script>

<style lang="scss">
#app {
  padding: 20px;
}
</style>

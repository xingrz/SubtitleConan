<template>
  <div :style="{ width: '100%', textAlign: 'center' }">
    <img :src="image" :style="{ background: `url('${background}')` }" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import { Sentence } from '@/utils/parseLyrics';
import generateCanvas from '@/utils/generateCanvas';

const props = defineProps<{
  canvasWidth?: number;
  canvasHeight?: number;

  kanjiFont: string;
  kanjiHeight: number;
  kanjiBottom: number;

  hinagaraFont: string;
  hinagaraHeight: number;
  hinagaraBottom: number;

  sentence: Sentence;
}>();

const background = generateCanvas(10, '#EEE');

const image = computed(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  function measure(text: string, font: string) {
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  const measurement = props.sentence.map(({ kanji, hinagara }) => {
    const kanjiWidth = measure(kanji, props.kanjiFont);
    const hinagaraWidth = hinagara ? measure(hinagara, props.hinagaraFont) : undefined;
    return { kanji, hinagara, kanjiWidth, hinagaraWidth };
  });

  const realWidth = measurement.reduce((width, { kanjiWidth }) => {
    return width + kanjiWidth;
  }, 0);

  const realHeight = props.hinagaraHeight + props.hinagaraBottom + props.kanjiHeight + props.kanjiBottom * 2;

  canvas.width = props.canvasWidth || realWidth;
  canvas.height = props.canvasHeight || realHeight;

  measurement.reduce((offset, { kanji, kanjiWidth, hinagara, hinagaraWidth }) => {
    ctx.font = props.kanjiFont;
    ctx.fillText(kanji, offset, canvas.height - props.kanjiBottom);
    if (hinagara && hinagaraWidth) {
      const x = offset + kanjiWidth / 2 - hinagaraWidth / 2;
      const y = canvas.height - props.kanjiBottom - props.kanjiHeight - props.hinagaraBottom;
      ctx.font = props.hinagaraFont;
      ctx.fillText(hinagara, x, y);
    }
    return offset + kanjiWidth;
  }, canvas.width / 2 - realWidth / 2);

  return canvas.toDataURL();
});
</script>

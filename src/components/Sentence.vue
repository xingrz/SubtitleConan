<template>
  <div :style="{ textAlign: 'center' }">
    <img :src="image" />
  </div>
</template>

<script lang="ts" setup>
import { Sentence } from '@/utils/parseLyrics';
import { computed, defineProps } from 'vue';

const props = defineProps<{
  kanjiFont: string;
  kanjiTop: number;
  hinagaraFont: string;
  hinagaraTop: number;
  lineHeight: number;
  sentence: Sentence;
}>();

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

  canvas.width = measurement.reduce((width, { kanjiWidth }) => {
    return width + kanjiWidth;
  }, 0);
  canvas.height = props.lineHeight;

  measurement.reduce((offset, { kanji, kanjiWidth, hinagara, hinagaraWidth }) => {
    ctx.font = props.kanjiFont;
    ctx.fillText(kanji, offset, props.kanjiTop);
    if (hinagara && hinagaraWidth) {
      ctx.font = props.hinagaraFont;
      ctx.fillText(hinagara, offset + kanjiWidth / 2 - hinagaraWidth / 2, props.hinagaraTop);
    }
    return offset + kanjiWidth;
  }, 0);

  return canvas.toDataURL();
});
</script>

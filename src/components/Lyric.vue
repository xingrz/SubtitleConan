<template>
  <div :style="{ width: '100%', textAlign: 'center' }">
    <img :src="image" :style="{ background: `url('${background}')` }" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import { Sentence } from '@/utils/parseLyrics';
import generateCanvas from '@/utils/generateCanvas';

export interface Shadow {
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface Stroke {
  color?: string;
  width?: number;
}

export interface Style {
  font: string;
  height: number;
  bottom: number;
}

const props = defineProps<{
  canvasWidth?: number;
  canvasHeight?: number;

  color: string;
  shadow?: Shadow;
  stroke?: Stroke;

  kanji: Style;
  hinagara: Style;

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
    const kanjiWidth = measure(kanji, props.kanji.font);
    const hinagaraWidth = hinagara ? measure(hinagara, props.hinagara.font) : undefined;
    return { kanji, hinagara, kanjiWidth, hinagaraWidth };
  });

  const realWidth = measurement.reduce((width, { kanjiWidth }) => {
    return width + kanjiWidth;
  }, 0);

  const realHeight = props.hinagara.height + props.hinagara.bottom + props.kanji.height + props.kanji.bottom * 2;

  canvas.width = props.canvasWidth || realWidth;
  canvas.height = props.canvasHeight || realHeight;

  ctx.fillStyle = props.color;

  if (props.shadow) {
    ctx.shadowColor = props.shadow.color || 'transparent';
    ctx.shadowBlur = props.shadow.blur || 0;
    ctx.shadowOffsetX = props.shadow.offsetX || 0;
    ctx.shadowOffsetY = props.shadow.offsetY || 0;
  }

  if (props.stroke) {
    ctx.strokeStyle = props.stroke.color || 'transparent';
    ctx.lineWidth = props.stroke.width || 0;
  }

  measurement.reduce((offset, { kanji, kanjiWidth, hinagara, hinagaraWidth }) => {
    const x = offset;
    const y = canvas.height - props.kanji.bottom;
    ctx.font = props.kanji.font;
    if (props.stroke?.width) ctx.strokeText(kanji, x, y);
    ctx.fillText(kanji, x, y);
    if (hinagara && hinagaraWidth) {
      const x = offset + kanjiWidth / 2 - hinagaraWidth / 2;
      const y = canvas.height - props.kanji.bottom - props.kanji.height - props.hinagara.bottom;
      ctx.font = props.hinagara.font;
      if (props.stroke?.width) ctx.strokeText(hinagara, x, y);
      ctx.fillText(hinagara, x, y);
    }
    return offset + kanjiWidth;
  }, canvas.width / 2 - realWidth / 2);

  return canvas.toDataURL();
});
</script>

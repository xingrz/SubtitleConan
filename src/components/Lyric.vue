<template>
  <div class="lyric">
    <img :src="image" :style="{ background: `url('${background}')` }" :width="scaledSize.width"
      :height="scaledSize.height" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, watch } from 'vue';

import { Sentence } from '@/utils/parseLyrics';
import generateCanvas from '@/utils/generateCanvas';
import { applyShadow, Shadow } from '@/utils/shadow';
import { applyStroke, Stroke } from '@/utils/stroke';

export interface Style {
  font: string;
  height: number;
  bottom: number;
}

interface CharacterBox {
  kanjiWidth: number;
  hinagaraWidth?: number;
}

const props = defineProps<{
  canvasWidth?: number;
  canvasHeight?: number;
  canvasScale: number;

  color: string;
  shadow?: Shadow;
  stroke?: Stroke;

  kanji: Style;
  hinagara: Style;

  sentence: Sentence;
}>();

const emit = defineEmits<{
  (e: 'render', image: string): void;
}>();

const background = generateCanvas(10, '#EEE');

const canvas = document.createElement('canvas');

const measurement = computed(() => {
  const ctx = canvas.getContext('2d')!;

  function measure(text: string, font: string) {
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  const characters: CharacterBox[] = props.sentence.map(({ kanji, hinagara }) => {
    const kanjiWidth = measure(kanji, props.kanji.font);
    const hinagaraWidth = hinagara ? measure(hinagara, props.hinagara.font) : undefined;
    return { kanjiWidth, hinagaraWidth };
  });

  const realWidth = characters.reduce((width, { kanjiWidth }) => {
    return width + kanjiWidth;
  }, 0);

  const realHeight = props.hinagara.height + props.hinagara.bottom + props.kanji.height + props.kanji.bottom * 2;

  const targetWidth = props.canvasWidth || realWidth;
  const targetHeight = props.canvasHeight || realHeight;

  return { characters, realWidth, realHeight, targetWidth, targetHeight };
});

const scaledSize = computed(() => ({
  width: measurement.value.targetWidth * (props.canvasScale / 100),
  height: measurement.value.targetHeight * (props.canvasScale / 100),
}));

const image = computed(() => {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { characters, realWidth, targetWidth, targetHeight } = measurement.value;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.textBaseline = 'bottom';

  applyShadow(ctx, props.shadow);
  applyStroke(ctx, props.stroke);

  // Draw shadow
  if (props.shadow?.color) {
    ctx.fillStyle = props.shadow.color;
    drawText(ctx, ctx.fillText, props.sentence, characters, realWidth);
    drawText(ctx, ctx.strokeText, props.sentence, characters, realWidth);
  }

  // Draw outline
  if (props.stroke?.color) {
    ctx.shadowColor = 'transparent';
    drawText(ctx, ctx.strokeText, props.sentence, characters, realWidth);
  }

  // Draw fill
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'transparent';
  ctx.fillStyle = props.color;
  drawText(ctx, ctx.fillText, props.sentence, characters, realWidth);

  return canvas.toDataURL();
});

watch(image, (image) => emit('render', image));
emit('render', image.value);

type FillTextFn = typeof CanvasRenderingContext2D.prototype.fillText;
type StrokeTextFn = typeof CanvasRenderingContext2D.prototype.strokeText;
function drawText(ctx: CanvasRenderingContext2D, drawFn: FillTextFn | StrokeTextFn,
  sentence: Sentence, characters: CharacterBox[], realWidth: number) {
  sentence.reduce((offset, { kanji, hinagara }, i) => {
    const { kanjiWidth, hinagaraWidth } = characters[i];
    const x = offset;
    const y = ctx.canvas.height - props.kanji.bottom;
    ctx.font = props.kanji.font;
    drawFn.apply(ctx, [kanji, x, y]);
    if (hinagara && hinagaraWidth) {
      const x = offset + kanjiWidth / 2 - hinagaraWidth / 2;
      const y = ctx.canvas.height - props.kanji.bottom - props.kanji.height - props.hinagara.bottom;
      ctx.font = props.hinagara.font;
      drawFn.apply(ctx, [hinagara, x, y]);
    }
    return offset + kanjiWidth;
  }, ctx.canvas.width / 2 - realWidth / 2);
}
</script>

<style lang="scss" scoped>
.lyric {
  width: 100%;
  text-align: center;

  img {
    box-shadow: rgba(0, 0, 0, 1.0) 0px 4px 8px;
  }
}
</style>

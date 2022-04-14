<template>
  <div :style="{ width: '100%', textAlign: 'center' }">
    <img :src="image" :style="{ background: `url('${background}')` }" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, watch } from 'vue';

import { Character, Sentence } from '@/utils/parseLyrics';
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

interface MeasuredCharacter extends Character {
  kanjiWidth: number;
  hinagaraWidth?: number;
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

const emit = defineEmits<{
  (e: 'render', image: string): void;
}>();

const background = generateCanvas(10, '#EEE');

const canvas = document.createElement('canvas');

const image = computed(() => {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  function measure(text: string, font: string) {
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  const measurement: MeasuredCharacter[] = props.sentence.map(({ kanji, hinagara }) => {
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

  ctx.textBaseline = 'bottom';

  applyShadow(ctx, props.shadow);
  applyStroke(ctx, props.stroke);

  // Draw shadow
  if (props.shadow?.color) {
    ctx.fillStyle = props.shadow.color;
    drawText(ctx, ctx.fillText, measurement, realWidth);
    drawText(ctx, ctx.strokeText, measurement, realWidth);
  }

  // Draw outline
  if (props.stroke?.color) {
    ctx.shadowColor = 'transparent';
    drawText(ctx, ctx.strokeText, measurement, realWidth);
  }

  // Draw fill
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'transparent';
  ctx.fillStyle = props.color;
  drawText(ctx, ctx.fillText, measurement, realWidth);

  return canvas.toDataURL();
});

watch(image, (image) => emit('render', image));
emit('render', image.value);

type FillTextFn = typeof CanvasRenderingContext2D.prototype.fillText;
type StrokeTextFn = typeof CanvasRenderingContext2D.prototype.strokeText;
function drawText(ctx: CanvasRenderingContext2D, drawFn: FillTextFn | StrokeTextFn,
  measurement: MeasuredCharacter[], realWidth: number) {
  measurement.reduce((offset, { kanji, kanjiWidth, hinagara, hinagaraWidth }) => {
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

function applyShadow(ctx: CanvasRenderingContext2D, shadow?: Shadow) {
  if (shadow) {
    ctx.shadowColor = shadow.color || 'transparent';
    ctx.shadowBlur = shadow.blur || 0;
    ctx.shadowOffsetX = shadow.offsetX || 0;
    ctx.shadowOffsetY = shadow.offsetY || 0;
  }
}

function applyStroke(ctx: CanvasRenderingContext2D, stroke?: Stroke) {
  if (stroke) {
    ctx.strokeStyle = stroke.color || 'transparent';
    ctx.lineWidth = stroke.width || 0;
  }
}
</script>

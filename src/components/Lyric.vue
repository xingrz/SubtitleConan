<template>
  <div class="lyric">
    <div class="layers" :style="{ width: `${scaledSize.width}px`, height: `${scaledSize.height}px` }">
      <img v-if="background" :src="background" :width="scaledSize.width" :height="scaledSize.height" />
      <img :src="image" :style="{ background: background ? 'transparent' : `url('${transparent}')` }"
        :width="scaledSize.width" :height="scaledSize.height" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, watch } from 'vue';

import { Sentence } from '@/utils/parseLyrics';
import generateCanvas from '@/utils/generateCanvas';
import { applyShadow, Shadow } from '@/utils/shadow';
import { applyStroke, Stroke } from '@/utils/stroke';

export interface LyricStyle {
  font: string;
  height: number;
  spacing: number;
  scale: number;
  bottom: number;
}

interface SliceMeasurement {
  kanjiWidths: number[];
  kanjiSliceWidth: number;
  hinagaraWidths?: number[];
  hinagaraSliceWidth?: number;
}

const props = defineProps<{
  canvasWidth?: number;
  canvasHeight?: number;
  canvasScale: number;

  background?: string;

  color: string;
  shadow?: Shadow;
  stroke?: Stroke;

  kanji: LyricStyle;
  hinagara: LyricStyle;

  sentence: Sentence;
}>();

const emit = defineEmits<{
  (e: 'render', image: string): void;
}>();

const transparent = generateCanvas(10, '#EEE');

const canvas = document.createElement('canvas');

const measurement = computed(() => {
  const ctx = canvas.getContext('2d')!;

  function measure(text: string, font: string) {
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  const slices: SliceMeasurement[] = props.sentence.map(({ kanjis, hinagaras }) => {
    const kanjiWidths = kanjis.map((kanji) => measure(kanji, props.kanji.font) * props.kanji.scale);
    const kanjiSliceWidth = kanjiWidths.reduce((sliceWidth, width) => sliceWidth + width,
      props.kanji.spacing * (kanjiWidths.length - 1));

    const hinagaraWidths = hinagaras?.map((hinagara) => measure(hinagara, props.hinagara.font) * props.hinagara.scale);
    const hinagaraSliceWidth = hinagaraWidths?.reduce((sliceWidth, width) => sliceWidth + width,
      props.hinagara.spacing * (hinagaraWidths.length - 1));

    return { kanjiWidths, kanjiSliceWidth, hinagaraWidths, hinagaraSliceWidth };
  });

  const realWidth = slices.reduce((width, { kanjiSliceWidth }) => width + kanjiSliceWidth,
    props.kanji.spacing * (slices.length - 1));

  const realHeight = props.hinagara.height + props.hinagara.bottom + props.kanji.height + props.kanji.bottom * 2;

  const targetWidth = props.canvasWidth || realWidth;
  const targetHeight = props.canvasHeight || realHeight;

  return { slices, realWidth, realHeight, targetWidth, targetHeight };
});

const scaledSize = computed(() => ({
  width: measurement.value.targetWidth * props.canvasScale,
  height: measurement.value.targetHeight * props.canvasScale,
}));

const image = computed(() => {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { slices, realWidth, targetWidth, targetHeight } = measurement.value;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.textBaseline = 'bottom';

  applyShadow(ctx, props.shadow);
  applyStroke(ctx, props.stroke);

  // Draw shadow
  if (props.shadow?.color) {
    ctx.fillStyle = props.shadow.color;
    if (props.shadow.type == 'continious') {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      const { offsetX, offsetY } = props.shadow || {};
      const steps = Math.max(Math.abs(offsetX || 0), Math.abs(offsetY || 0)) * 2;
      for (let i = 0; i <= steps; i++) {
        const x = (offsetX || 0) * (i / steps);
        const y = (offsetY || 0) * (i / steps);
        ctx.save();
        ctx.translate(x, y);
        drawText(ctx, ctx.fillText, props.sentence, slices, realWidth);
        drawText(ctx, ctx.strokeText, props.sentence, slices, realWidth);
        ctx.restore();
      }
    } else {
      drawText(ctx, ctx.fillText, props.sentence, slices, realWidth);
      drawText(ctx, ctx.strokeText, props.sentence, slices, realWidth);
    }
  }

  // Draw outline
  if (props.stroke?.color) {
    ctx.shadowColor = 'transparent';
    drawText(ctx, ctx.strokeText, props.sentence, slices, realWidth);
  }

  // Draw fill
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'transparent';
  ctx.fillStyle = props.color;
  drawText(ctx, ctx.fillText, props.sentence, slices, realWidth);

  return canvas.toDataURL();
});

watch(image, (image) => emit('render', image));
emit('render', image.value);

type FillTextFn = typeof CanvasRenderingContext2D.prototype.fillText;
type StrokeTextFn = typeof CanvasRenderingContext2D.prototype.strokeText;
function drawText(ctx: CanvasRenderingContext2D, drawFn: FillTextFn | StrokeTextFn,
  sentence: Sentence, slices: SliceMeasurement[], realWidth: number) {
  sentence.reduce((offset, { kanjis, hinagaras }, i) => {
    const { kanjiWidths, kanjiSliceWidth, hinagaraWidths, hinagaraSliceWidth } = slices[i];

    // draw kanji
    ctx.save();
    ctx.scale(props.kanji.scale, 1);
    ctx.font = props.kanji.font;
    const y = ctx.canvas.height - props.kanji.bottom;
    kanjis.reduce((x, kanji, j) => {
      const width = kanjiWidths[j];
      drawFn.apply(ctx, [kanji, x / props.kanji.scale, y]);
      return x + width + props.kanji.spacing;
    }, offset);
    ctx.restore();

    // draw hinagara
    if (hinagaras && hinagaraWidths && hinagaraSliceWidth) {
      ctx.save();
      ctx.scale(props.hinagara.scale, 1);
      ctx.font = props.hinagara.font;
      const y = ctx.canvas.height - props.kanji.bottom - props.kanji.height - props.hinagara.bottom;
      hinagaras.reduce((x, hinagara, j) => {
        const width = hinagaraWidths[j];
        drawFn.apply(ctx, [hinagara, x / props.hinagara.scale, y]);
        return x + width + props.hinagara.spacing;
      }, offset + kanjiSliceWidth / 2 - hinagaraSliceWidth / 2);
      ctx.restore();
    }

    return offset + kanjiSliceWidth + props.kanji.spacing;
  }, ctx.canvas.width / 2 - realWidth / 2);
}
</script>

<style lang="scss" scoped>
.lyric {
  width: 100%;
  text-align: center;

  .layers {
    display: inline-block;
    position: relative;
    box-shadow: rgba(0, 0, 0, 1.0) 0px 4px 8px;

    >* {
      position: absolute;
      left: 0;
    }
  }
}
</style>

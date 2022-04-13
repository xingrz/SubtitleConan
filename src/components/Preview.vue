<template>
  <a-list size="small" bordered :data-source="lyrics">
    <template #renderItem="{ item }">
      <a-list-item>
        <sentence :kanji-font="props.kanjiFont" :kanji-top="props.kanjiTop" :hinagara-font="props.hinagaraFont"
          :hinagara-top="props.hinagaraTop" :line-height="props.lineHeight" :sentence="item" />
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import Sentence from '@/components/Sentence.vue';
import parseLyrics from '@/utils/parseLyrics';

const props = defineProps<{
  kanjiFont: string;
  kanjiTop: number;
  hinagaraFont: string;
  hinagaraTop: number;
  lineHeight: number;
  lyricsText: string;
}>();

const lyrics = computed(() => parseLyrics(props.lyricsText));
</script>

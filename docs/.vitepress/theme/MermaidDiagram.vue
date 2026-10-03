<script setup lang="ts">
import { onMounted, ref, useId, watch } from 'vue';

const props = defineProps<{ source: string; sourcePath: string; diagramId: string }>();
const output = ref('');
const error = ref(false);
const copying = ref('Copy diagram source');
const instanceId = useId().replace(/[^a-zA-Z0-9]/g, '');
let generation = 0;

async function renderDiagram() {
  const current = ++generation;
  error.value = false;
  output.value = '';
  try {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
    });
    const rendered = await mermaid.render(`mermaid-${instanceId}-${current}`, props.source);
    if (current === generation) output.value = rendered.svg;
  } catch {
    if (current === generation) error.value = true;
  }
}

async function copySource() {
  try {
    await globalThis.navigator.clipboard.writeText(props.source);
    copying.value = 'Source copied';
  } catch {
    copying.value = 'Select and copy the source below';
  }
}

onMounted(renderDiagram);
watch(() => props.source, renderDiagram);
</script>

<template>
  <figure class="mermaid-diagram">
    <p v-if="error" role="alert">Diagram did not render. Read the explanation and source below.</p>
    <p v-else-if="!output" role="status">Rendering diagram…</p>
    <!-- Mermaid is pinned, locally loaded and runs with securityLevel: strict. -->
    <!-- eslint-disable vue/no-v-html -- Only SVG returned by pinned Mermaid in strict mode enters this sink. -->
    <div
      v-else
      class="mermaid-output"
      role="img"
      aria-label="System relationship diagram"
      v-html="output"
    />
    <!-- eslint-enable vue/no-v-html -->
    <figcaption><a :href="`#${diagramId}-source`">Original diagram source</a></figcaption>
    <details :id="`${diagramId}-source`" :open="error">
      <summary>Read or copy diagram source</summary>
      <p>
        Markdown source: <code>{{ sourcePath }}</code>
      </p>
      <button type="button" @click="copySource">{{ copying }}</button>
      <pre><code>{{ source }}</code></pre>
    </details>
  </figure>
</template>

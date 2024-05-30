# Embedding Vue Flow in Vitpress markdown file

- [Vue Flow](https://vueflow.dev)
- [Using Vue in Markdown](https://vitepress.dev/guide/using-vue)

## Install Dependencies

```bash
npm add @vue-flow/core
```

## Embedding vue code in markdown

```vue
<script setup>
  import { ref } from 'vue';
  import { VueFlow } from '@vue-flow/core';
  import "@vue-flow/core/dist/style.css";
  import "@vue-flow/core/dist/theme-default.css";

  const nodes = ref([
    { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 50 } },
    { id: '2', label: 'Node 2', position: { x: 100, y: 200 } },
    { id: '3', label: 'Node 3', position: { x: 400, y: 200 } }
  ]);

  const edges = ref([
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
  ]);

</script>

<div class="w-full h-80 border border-gray-200 rounded-md">
  <VueFlow v-model:nodes="nodes" v-model:edges="edges"></VueFlow>
</div>
```

### Vue Composition API

- script: 用法與 Vue 3 的 Composition API 相同
- style: 透過 `<style module>` 定義的樣式會套用在當前頁面
- template: 所有在 frontmatter 底下的 markdown 內容皆會渲染於頁面，不需要透過 template tag 來定義

### Vue Flow Basic Sample

- 定義 Vue Flow 的 nodes 與 edges，以及定義父容器寬高

<script setup>
import { ref } from 'vue';
import { VueFlow } from '@vue-flow/core';
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

const nodes = ref([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 50 } },
  { id: '2', label: 'Node 2', position: { x: 100, y: 200 } },
  { id: '3', label: 'Node 3', position: { x: 400, y: 200 } }
]);
  
const edges = ref([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
]);

</script>

<div class="w-full h-80 border border-gray-200 rounded-md">
<VueFlow v-model:nodes="nodes" v-model:edges="edges"></VueFlow>
</div>








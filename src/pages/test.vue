<template>
  <draggable
    v-model="list"
    @start="dragging = true"
    @end="dragging = false"
    :options="{group: 'items', sort: false, put: false}"
  >
    <template #item="{ element, index }">
      <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
        <div
        v-for="(item, index) in list"
        :key="index"
        :class="{ 'no-drop': !item.canDrop }"
        >
        {{ item.text }}
      </div>
      </transition-group>
    </template>
  </draggable>
</template>

<script setup>
import { ref, reactive } from 'vue';
import draggable from 'vuedraggable';

const list = reactive([
  { text: 'Item 1', canDrop: true },
  { text: 'Item 2', canDrop: false }, // This item can't be dropped into another list
  { text: 'Item 3', canDrop: true },
]);

const dragging = ref(false);
</script>

<style scoped>
.no-drop {
  background-color: #ffcccc;
  cursor: not-allowed;
}

.flip-list-move {
  transition: transform 0.5s ease;
}
</style>
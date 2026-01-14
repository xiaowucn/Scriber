<template>
  <p class="project-summary-item">
    <span class="label">{{ label }}:&ensp;</span>
    <span class="value"><slot></slot></span>
  </p>
</template>

<script>
export default {
  name: 'project-summary-item',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.label {
  color: rgba(0, 0, 0, 0.5);
}
.value {
  font-weight: bold;
}
</style>

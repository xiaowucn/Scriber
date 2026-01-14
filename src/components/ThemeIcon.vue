<template>
  <span v-if="!$platform.isDefaultEnv()">
    <img v-if="oldIconUrl" :src="oldIconUrl" />
    <i v-else :class="iconClass"></i>
  </span>
  <img v-else :src="svgSrc" :class="imgClass" />
</template>

<script>
export default {
  name: 'theme-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    iconClass: {
      type: String,
      required: false,
      default: '',
    },
    imgClass: {
      type: String,
      required: false,
      default: '',
    },
    oldIconUrl: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    svgSrc() {
      return new URL(`../assets/svg-icons/${this.name}.svg`, import.meta.url)
        .href;
    },
  },
};
</script>

<style scoped lang="scss"></style>

<template>
  <div class="pdf-viewer-thumbnail">
    <ul class="file-thumbnail" @click.stop="thumbnailPageClicked($event)">
      <li
        v-for="({ page, url }, index) in thumbnailList"
        :key="index"
        :class="{ active: page === thumbnailPageActived }">
        <img :src="url" :alt="index" :data-page="page" class="page-image" />
        <span class="page-number">{{ index + 1 }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'viewer-thumbnail',
  props: {
    thumbnailList: {
      type: Array,
      required: false,
      default: () => [],
    },
    thumbnailPageActived: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    thumbnailPageClicked(event) {
      const page = Number(event.target.dataset.page);
      if (isNaN(page)) {
        return;
      }
      this.$emit('thumbnail-page-clicked', page + 1);
    },
    scrollIntoView(page = 0) {
      const imageElement = this.$el.querySelector(
        `.page-image[data-page="${page}"]`,
      );
      if (imageElement) {
        imageElement.scrollIntoView({ block: 'center' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pdf-viewer-thumbnail {
  flex-shrink: 0;
  padding: 40px;
  width: 260px;
  box-sizing: border-box;
  height: calc(100vh - 40px);
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0 0 5px #ccc;
  z-index: 280;
  .file-thumbnail {
    list-style: none;
    li {
      padding: 10px;
      width: 160px;
      min-width: 160px;
      margin-bottom: 20px;
      border: 1px solid #eee;

      &.active {
        background-color: #eee;

        img {
          box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
        }
      }
    }

    .page-image {
      width: 100%;
      min-width: 100%;
      min-height: 225px;
      background-color: #fff;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    }

    .page-number {
      display: block;
      margin-top: 10px;
      width: 100%;
      line-height: 16px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div
    v-if="isShowAnnouncementNameBanner"
    class="announcement-name-banner-container">
    <div class="announcement-name-banner">
      <div class="banner">
        <span class="label">{{ announcementNameSchema }} :</span>
        <span class="name" :title="announcementName">
          {{ announcementName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'announcement-name-banner',
  data() {
    return { announcementNameSchema: '公告名称' };
  },
  computed: {
    ...mapGetters('remarkModule', ['answer', 'remarkTaskTypes']),

    isShowAnnouncementNameBanner() {
      return this.remarkTaskTypes.includes('remark');
    },
    announcementName() {
      const announcementData = this.answer.items.find(
        (item) => item.schema.data.label === this.announcementNameSchema,
      )?.data[0];
      if (announcementData) {
        return (
          announcementData.text ||
          announcementData.boxes.map((box) => box.text).join('')
        );
      } else {
        return '--';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.announcement-name-banner-container {
  .announcement-name-banner {
    position: absolute;
    top: 9px;
    z-index: 200;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 100%;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    background-color: #005bac99;
    overflow: hidden;
    .banner {
      padding: 0 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .label {
      margin-right: 10px;
    }
  }
}
</style>

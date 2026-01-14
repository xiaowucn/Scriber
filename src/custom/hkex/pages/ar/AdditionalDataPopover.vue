<template>
  <div class="additional-data-popover">
    <div class="summary">
      <div class="item">
        <label>Last updated:</label>
        <span>{{ formatDate(data.new_directors.last_updated) }}</span>
      </div>
      <div class="item">
        <label>Beginning of the current reporting period:</label>
        <span>{{ formatDate(data.new_directors.year_start) }}</span>
      </div>
      <div class="item">
        <label>Annual report release date:</label>
        <span>{{ formatDate(data.new_directors.published_at) }}</span>
      </div>
    </div>
    <div v-if="data.new_directors.items.length > 0" class="list">
      <ul>
        <li v-for="(item, index) in data.new_directors.items" :key="index">
          <p class="name">{{ item.english_name }} {{ item.chinese_name }}</p>
          <p class="date">
            Appointment Date: {{ formatDate(item.appointment_date) }}
          </p>
        </li>
      </ul>
    </div>
    <div v-else class="empty">No Data</div>
  </div>
</template>

<script>
import { date } from '@/utils/filters';

export default {
  name: 'ar-additional-data-popover',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(datetime) {
      if (!datetime) {
        return '-';
      }
      return date(new Date(datetime).getTime());
    },
  },
};
</script>

<style lang="scss" scoped>
.additional-data-popover {
  .summary {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ffffff2e;
    .item {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
      color: #d5d5d5;
    }
    label {
      color: #43d6dd;
    }
  }
  .list {
    max-height: 60vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #606060;
      border-radius: 5px;
      &:hover {
        background-color: #6f6f6f;
      }
    }
    &::-webkit-scrollbar-track {
      display: none;
    }
    ul {
      padding-left: 13px;
      li {
        position: relative;
        margin: 5px 0;
        color: #43d6dd;
        list-style: none;
        &::before {
          content: '';
          position: absolute;
          top: 6px;
          left: -10px;
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #43d6dd;
        }
        .name {
          font-size: 12px;
          color: #fff;
        }
        .date {
          font-size: 12px;
          color: #d5d5d5;
        }
      }
    }
  }
  .empty {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
}
</style>

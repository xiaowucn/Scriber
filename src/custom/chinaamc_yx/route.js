import _ from 'lodash';
import store from '@/store';
import VueRouter from 'vue-router';
import { defaultRoutes, defaultRouterBeforeHook } from '@/router';

import Index from './Index.vue';
import Tasks from './pages/Tasks.vue';
import TaskDiff from './pages/TaskDiff.vue';
import FileDiff from './pages/FileDiff.vue';
import ChapterDiff from './pages/ChapterDiff.vue';

const chinaamcYxRoutes = [
  {
    path: '/',
    redirect: () => {
      const config = store.getters['configuration'];
      return config.default_page || '/project';
    },
  },
  {
    path: '/chinaamc_yx',
    name: 'chinaamcYX',
    redirect: '/chinaamc_yx/tasks',
    component: Index,
    meta: {
      customHeader: true,
    },
    children: [
      {
        path: 'tasks',
        name: 'compareTasks',
        component: Tasks,
        meta: {
          customHeader: true,
        },
      },
      {
        path: 'tasks/:taskId/diff',
        name: 'taskDiff',
        component: TaskDiff,
        meta: {
          customHeader: true,
          hideHeader: true,
        },
      },
      {
        path: 'tasks/:taskId/files/:fileId/diff',
        name: 'fileDiff',
        component: FileDiff,
        meta: {
          customHeader: true,
          hideHeader: true,
        },
      },
      {
        path: 'tasks/:taskId/chapter-diff',
        name: 'chapterDiff',
        component: ChapterDiff,
        meta: {
          customHeader: true,
          hideHeader: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes: _.uniqBy(chinaamcYxRoutes.concat(defaultRoutes), 'path'),
});

router.beforeEach(defaultRouterBeforeHook);

export default router;

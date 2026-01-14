import { Message } from 'element-ui';

const baseUrl = `${window.location.origin}${window.location.pathname}`;

const versionFile = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}v`;

export default {
  data() {
    return {
      interval: null,
      message: null,
    };
  },
  mounted() {
    this.checkVersionInterval();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkVersionInterval();
      } else {
        this.clearCheck();
      }
    });
  },
  methods: {
    async checkVersionInterval() {
      this.clearCheck();

      await this.checkVersion();

      this.interval = setTimeout(async () => {
        this.checkVersionInterval();
      }, 60e3);
    },
    async checkVersion() {
      try {
        const serverVersionRes = await fetch(
          `${versionFile}?_t=${Date.now()}`,
        ).then((res) => {
          if (!res.ok) {
            throw new Error('Response was not ok');
          }
          return res.text();
        });

        const serverVersion = serverVersionRes;

        const currentVersionEl = document.getElementById('git-commit-hash');
        const currentVersion = currentVersionEl.innerText;

        if (currentVersion !== serverVersion) {
          this.clearCheck();
          this.message = Message({
            customClass: 'check-version-message',
            dangerouslyUseHTMLString: true,
            message: `${this.$t(
              `message['检测到新版本']`,
            )}, <a href="${baseUrl}">${this.$t(`message['点击更新']`)}</a>`,
            duration: 0,
            offset: 50,
            showClose: true,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    clearCheck() {
      if (this.interval) {
        clearTimeout(this.interval);
      }
      if (this.message) {
        this.message.close();
      }
    },
  },
};

import { mapGetters } from 'vuex';
import { hkexReportType } from '@/store/constants';

export default {
  name: 'report-type-mixin',
  data() {
    return {};
  },
  computed: {
    ...mapGetters('hkexModule', ['auditType']),
    isQrReport() {
      return this.auditType === hkexReportType.qr.value;
    },
    isArReport() {
      return this.auditType === hkexReportType.ar.value;
    },
    isEsgReport() {
      return this.auditType === hkexReportType.esg.value;
    },
    isCgReport() {
      return this.auditType === hkexReportType.cg.value;
    },
    isAgmReport() {
      return this.auditType === hkexReportType.agm.value;
    },
    isPollReport() {
      return this.auditType === hkexReportType.poll.value;
    },
  },
  methods: {},
};

import { configure, getLogger } from 'log4js';
import Instance from './models/Instance';
import db from './models/db';
import api from './api';
import env from './models/env';
import posthog from './models/posthog';
import OicqClient from './client/OicqClient';

(async () => {
  configure({
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { level: env.LOG_LEVEL, appenders: ['console'] },
    },
  });
  const log = getLogger('Main');

  process.on('unhandledRejection', error => {
    log.error('UnhandledRejection: ', error);
    posthog.capture('UnhandledRejection', { error });
  });

  process.on('uncaughtException', error => {
    log.error('UncaughtException: ', error);
    posthog.capture('UncaughtException', { error });
  });

  api.startListening();

  const instanceEntries = await db.instance.findMany();

  if (!instanceEntries.length) {
    await Instance.start(0);
  }
  else {
    for (const instanceEntry of instanceEntries) {
      await Instance.start(instanceEntry.id);
    }
  }

  posthog.capture('启动完成', { instanceCount: instanceEntries.length });

  setTimeout(async () => {
    for (const instance of Instance.instances.filter(it => it.workMode === 'group')) {
      if (!(instance.oicq instanceof OicqClient)) continue;
      try {
        await instance.forwardPairs.initMapInstance(Instance.instances.filter(it => it.workMode === 'personal'));
      }
      catch {
      }
    }
  }, 15 * 1000);
})();

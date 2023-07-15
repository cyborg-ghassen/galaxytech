from __future__ import absolute_import

import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'galaxytech.settings')
app = Celery('galaxytech')
app.conf.enable_utc = False
app.conf.update(timezone='Africa/Tunis')
app.config_from_object('django.conf:settings', namespace='CELERY')

# celery beat settings
# app.conf.beat_schedule = {
#     'create_notification_1m': {
#         'task': 'deadline_event_notification',
#         # 'schedule':timedelta(seconds=30) ,
#         # 'args': (16, 16),
#         'schedule':crontab(hour=15, minute=14) ,
#     },
# }

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))

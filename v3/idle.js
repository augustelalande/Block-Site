/* make sure timers are synced */

{
  const validate = async () => {
    const now = Date.now();
    for (const o of await chrome.alarms.getAll()) {
      if (o.scheduledTime < now) {
        console.info('outdated timer', o);
        chrome.alarms.create(o.name, {
          when: now + Math.round(Math.random() * 1000),
          periodInMinutes: o.periodInMinutes
        });
      }
    }
  };

  chrome.idle.onStateChanged.addListener(state => {
    if (state === 'active') {
      validate();
    }
  });
  // Firefox does not reliably fire "locked -> active" state so we check whenever possible
  // https://github.com/ray-lothian/Block-Site/pull/165
  if (navigator.userAgent.includes('Firefox')) {
    validate();
  }
}

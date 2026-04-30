/* update prefs from the managed storage */
{
  const once = async () => {
    if (once.done) {
      return;
    }
    once.done = true;

    try {
      let rps = await chrome.storage.managed.get({
        json: ''
      });
      if (rps.json) {
        rps = JSON.parse(rps.json);
        const prefs = await chrome.storage.local.get(null);

        if (prefs.guid !== rps.guid || rps['managed.storage.overwrite.on.start'] === true) {
          Object.assign(prefs, rps);
          chrome.storage.local.set(prefs);
          console.info('Your preferences are configured by the admin');
        }
      }
    }
    catch (e) {
      console.error('cannot parse the managed JSON string', e);
    }
  };
  chrome.runtime.onStartup.addListener(once);
  chrome.runtime.onInstalled.addListener(once);
}

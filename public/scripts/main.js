import { loadPage } from './pageLoader.js';
import { loadPageList } from './pageList.js';
import { setupFormHandler } from './formHandler.js';
import color from './color.js';

window.onload = async function () {
  // initialize theme/color switcher
  try { color(); } catch (e) { console.warn('color() init failed', e); }

  await loadPage('./form.html');
  await loadPageList();
  setupFormHandler();
};

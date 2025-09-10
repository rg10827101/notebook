import { loadPage } from './pageLoader.js';
import { loadPageList } from './pageList.js';
import { setupFormHandler } from './formHandler.js';

window.onload = async function () {
  await loadPage('./form.html');
  await loadPageList();
  setupFormHandler();
};

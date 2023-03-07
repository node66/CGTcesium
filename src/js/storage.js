import {addBody, addHeader} from './table.js';

window.addEventListener('load', () => {
  const items = {...localStorage};
  for (let itemsKey in items) {
    if (itemsKey.includes("geojson")) {
      const data = JSON.parse(localStorage.getItem(itemsKey));
      addHeader(data.filename, data);
      addBody(data);
    }
  }
});
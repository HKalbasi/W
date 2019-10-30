(W) => ({
  run: async (url) => {
    const nurl = url.slice(1).join('/');
    const wurl = `wiki/${nurl}`;
    const x = (await W.read(wurl)) || "";
    const ta = document.createElement('textarea');
    ta.style = `
      background-color: black;
      color: white;
      width: 100%;
      height: 100%;
      border: none;
      font: inherit;
    `;
    ta.value = x;
    const div = document.createElement('div');
    div.appendChild(ta);
    return {
      type: 'dom',
      data: div,
      button: [{
        name: 'ذخیره',
        onclick: async () => {
          await (W.write(wurl,ta.value));
          alert('با موفقیت ذخیره شد.');
        },
      },
      {
        name: 'خروج',
        href: `/${wurl}`,
      }],
    };
  },
})
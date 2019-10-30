(W) => ({
  run: async (url) => {
    const nurl = url.slice(1).join('/');
    const name = decodeURI(nurl);
    const wurl = `wiki/${nurl}`;
    const x = await W.read(wurl);
    if (!x) return { 
      type: 'text',
      data: `${name} وجود ندارد`,
      button: [{
        name: 'ایجاد',
        href: `/wikiedit/${nurl}`,
      }],
    };
    return {
      type: 'markdown',
      data: x,
      button: [{
        name: 'ویرایش',
        href: `/wikiedit/${nurl}`,
      }],
    } 
  },
})
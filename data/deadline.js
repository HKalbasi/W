(W) => ({
  run: async (url) => {
    const monthName = ["فروردین", "اردیبهشت", "خرداد",
      "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    const dateFtoL = (x) => {
      if (typeof x !== "string") return "zart";
      const a = x.split('-');
      a[1] = Number.parseInt(a[1])-1;
      return `${a[2]} ${monthName[a[1]]} ${a[0]}`;
    };
    const x = JSON.parse(await W.read('deadline/data') || '[]');
    const dom = document.createElement('div');
    if (x.length === 0) {
      const txt = document.createElement('p');
      txt.innerText = 'آفرین همه کاراتو انجام دادی';
      dom.appendChild(txt);
    }
    else {
      const table = document.createElement('table');
      x.forEach((e,i) => {
        const tr = document.createElement('tr');
        const add = (x) => {
          const td = document.createElement('td');
          td.appendChild(x);
          tr.appendChild(td);
        };
        const nm = document.createElement('span');
        nm.innerText = e.name;
        const dt = document.createElement('span');
        dt.innerText = dateFtoL(e.date);
        const btn = document.createElement('button');
        btn.innerText = 'انجام شد';
        btn.onclick = async () => {
          const xn = [...x.slice(0,i), ...x.slice(i+1)];
          await W.write('deadline/data', JSON.stringify(xn));
          await W.reload();
        };
        add(nm);add(dt);add(btn);
        table.appendChild(tr);
      });
      dom.appendChild(table);
    }
    const nw = ((()=>{
      const div = document.createElement('div');
      const nm = document.createElement('input');
      const dt = document.createElement('input');
      const btn = document.createElement('button');
      btn.onclick = async () => {
        x.push({name: nm.value, date: dt.value});
        await W.write('deadline/data', JSON.stringify(x));
        await W.reload();
      };
      btn.innerText = 'ثبت کار جدید';
      div.appendChild(nm);
      div.appendChild(dt);
      div.appendChild(btn);
      return div;
    })());
    dom.appendChild(nw);
    return {
      type: 'dom',
      data: dom,
    } 
  },
})
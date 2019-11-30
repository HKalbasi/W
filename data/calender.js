(W) => ({
  run: async (url) => {
    const templat = await ((async ()=>{
      const data = (await W.read('wiki/calenderTemplate')).split('\n');
      const ar = [];
      let cur;
      for (const x of data) {
        if (x[0] === '*') {
          cur = [];
          ar.push({
            name: x.substring(2),
            data: cur,
          });
        }
        else {
          cur.push(x);
        }
      }
      return ar;
    })());
    const msToDur = (ms) => {
      ms = Math.round(ms/1000);
      let div = (x,y)=>Math.floor(x/y);
      let s = ms%60;
      ms = div(ms,60);
      let m = ms%60;
      ms = div(ms,60);
      let h = ms%24;
      let d = div(ms,24);
      s = (s === 0?'':`${s} ثانیه`);
      m = (m === 0?'':`${m} دقیقه`);
      h = (h === 0?'':`${h} ساعت`);
      d = (d === 0?'':`${d} روز`);
      return `${d} ${h} ${m} ${s}`;
    };
    const dateF = (x) => {
      const a = x.toLocaleDateString(
        "en-u-ca-persian",
        {year: "2-digit",month:"2-digit",day:"2-digit"},
      ).split('/');
      return `${a[2]}-${a[0]}-${a[1]}`;
    };
    const monthName = ["فروردین", "اردیبهشت", "خرداد",
      "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    const monthLength = [31,31,31,31,31,31,30,30,30,30,30,30,29];
    const dateFtoL = (x) => {
      const a = x.split('-');
      a[1] = Number.parseInt(a[1])-1;
      return `${a[2]} ${monthName[a[1]]} ${a[0]}`;
    };
    const dateFnext = (x) => {
      const a = x.split('-').map(x=>Number.parseInt(x));
      a[2]++;
      if (a[2] === monthLength[a[1]-1]+1){
        a[2]=1;a[1]++;
      }
      if (a[1] === 13){
        a[1]=1;a[0]++;
      }
      return a.map(x=>(x+"").padStart(2,'0')).join('-');
    };
    const dateFprev = (x) => {
      const a = x.split('-').map(x=>Number.parseInt(x));
      a[2]--;
      if (a[2] === 0){
        a[1]--;
        if (a[1] === 0){
          a[0]--;
          a[1] = 12;
        }
        a[2] = monthLength[a[1]];
      }
      return a.map(x=>(x+"").padStart(2,'0')).join('-');
    };
    const nurl = url[1];
    const tltable = await ((async ()=>{
      const tlurl = `calender/timeline/${nurl}`;
      const x = await W.read(tlurl);
      if (!x) { 
        const div = document.createElement('div');
        div.innerText = `شما در این روز کاری نکردید.`;
        return div;
      };
      const tltb = document.createElement('tbody');
      JSON.parse(x).map(d => {
        const tr = document.createElement('tr');
        const tdnam = document.createElement('td');
        const tdstt = document.createElement('td');
        const tdend = document.createElement('td');
        const tddur = document.createElement('td');
        const start = new Date(d.start);
        const end = new Date(d.end);
        const toTime = (x) => x.toLocaleTimeString(undefined,{hour12:false});
        tdnam.innerText = d.name;
        tdstt.innerText = toTime(start);
        tdend.innerText = toTime(end);
        tddur.innerText = msToDur(end-start);
        tr.appendChild(tdnam);
        tr.appendChild(tdstt);
        tr.appendChild(tdend);
        tr.appendChild(tddur);
        return tr;
      }).forEach(f => tltb.appendChild(f));
      const res = document.createElement('table');
      res.appendChild(tltb);
      return res;
    })());
    const navigatior = document.createElement('table');
    navigatior.innerHTML = `${dateFtoL(nurl)} <a href="/calender/${
      dateFnext(nurl)
    }">روز بعد</a> <a href="/calender/${dateFprev(nurl)}">روز قبل</a>`;
    const tasktable = await ((async ()=>{
      const tlurl = `calender/tasks/${nurl}`;
      const x = await W.read(tlurl);
      if (!x) { 
        const div = document.createElement('div');
        const select = document.createElement('select');
        templat.forEach((x, i)=>{
          const op = document.createElement('option');
          op.innerText = x.name;
          op.value = i;
          select.appendChild(op);
        });
        const btn = document.createElement('button');
        btn.innerText = 'بساز';
        btn.onclick = async () => {
          await W.write(tlurl, JSON.stringify(templat[select.value].data));
          await W.reload();
        };
        div.appendChild(select);
        div.appendChild(btn);
        return div;
      };
      const res = document.createElement('div');
      const xx = JSON.parse(x);
      xx.map(d => {
        const me = document.createElement('div');
        const span = document.createElement('span');
        span.innerText = d;
        const btnDo = document.createElement('button');
        btnDo.innerText = 'الان دارم انجامش می دم';
        btnDo.onclick = async () => {
          const checkRace = await W.read('calender/timeline-now');
          if (checkRace !== 'none') {
            alert(`شما در حال ${JSON.parse(checkRace).name} هستید. ابتدا آن را تمام کنید.`);
            return W.reload();
          }
          await W.write('calender/timeline-now', JSON.stringify({
            name: d,
            time: new Date(),
          }));
          await W.reload();
        };
        const btnDone = document.createElement('button');
        btnDone.innerText = 'انجامش دادم'; 
        btnDone.onclick = async () => {
          const nextx = xx.filter(k => k !== d);
          await W.write(tlurl, JSON.stringify(nextx));
          await W.reload();
        };
        me.appendChild(span);
        me.appendChild(btnDo);
        me.appendChild(btnDone);
        return me;
      }).forEach(f => res.appendChild(f));
      const nn = document.createElement('input');
      nn.type = 'text';
      const btn = document.createElement('button');
      btn.innerText = 'اضافه کن';
      btn.onclick = async () => {
        xx.push(nn.value);
        await W.write(tlurl, JSON.stringify(xx));
        await W.reload();
      };
      const addDiv = document.createElement('div');
      addDiv.appendChild(nn);
      addDiv.appendChild(btn);
      res.appendChild(addDiv);
      return res;
    })());
    const div = document.createElement('div');
    div.appendChild(navigatior);
    div.appendChild(tltable);
    div.appendChild(tasktable);
    return { type: 'dom', data: div };
  },
})
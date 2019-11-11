(W) => ({
  run: async (url) => {
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
    const div = document.createElement('div');
    div.append(navigatior);
    div.append(tltable);
    return { type: 'dom', data: div };
  },
})
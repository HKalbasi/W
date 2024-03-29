(W) => ({
  run: async () => {
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
    const urlDiv = (()=>{
      const inp = document.createElement('input');
      const but = document.createElement('button');
      but.innerText = 'برو';
      but.onclick = () => W.goto(inp.value);
      const div = document.createElement('div');
      div.appendChild(inp);
      div.appendChild(but);
      return div;
    })();
    const wikiDiv = (()=>{
      const homeLink = document.createElement('a');
      homeLink.href = "/wiki/خانه";
      homeLink.innerText = `خانه ویکی`;
      const inp = document.createElement('input');
      const but = document.createElement('button');
      but.innerText = 'برو به صفحه ویکی';
      but.onclick = () => W.goto(`/wiki/${inp.value}`);
      const div = document.createElement('div');
      div.appendChild(homeLink);
      div.appendChild(document.createElement('br'));
      div.appendChild(inp);
      div.appendChild(but);
      return div;
    })();
    const backupDiv = (()=>{
      const link = document.createElement('a');
      link.href = "/backuper";
      link.innerText = `پشتیبان گیری`;
      const div = document.createElement('div');
      div.appendChild(link);
      return div;
    })();
    const nowWorkDiv = await ((async ()=>{
      const dateF = (x) => {
        const a = x.toLocaleDateString(
          "en-u-ca-persian",
          {year: "2-digit",month:"2-digit",day:"2-digit"},
        ).split('/');
        return `${a[2]}-${a[0]}-${a[1]}`;
      };
      const todayLink = document.createElement('div');
      todayLink.innerHTML = `امروز <a href="/calender/${dateF(new Date)}">${
        (new Date).toLocaleDateString("fa",{year: "numeric",month:"long",day:"numeric"})
      }</a> است.`;
      const nowWork = await W.read('calender/timeline-now');
      if (!nowWork || nowWork === 'none') {
        const inp = document.createElement('input');
        inp.type = 'text';
        const button = document.createElement('button');
        button.innerText = 'کار را شروع کن';
        button.onclick = async () => {
          const checkRace = await W.read('calender/timeline-now');
          if (checkRace !== nowWork) {
            alert('شما قبلا کار دیگری را شروع کرده اید. لطفا مجددا سعی کنید.');
            return W.reload();
          }
          await W.write('calender/timeline-now', JSON.stringify({
            name: inp.value,
            time: new Date(),
          }));
          await W.reload();
        };
        const div = document.createElement('div');
        div.appendChild(inp);
        div.appendChild(button);
        div.appendChild(todayLink);
        return div;  
      }
      const nwo = JSON.parse(nowWork);
      const lbl = document.createElement('span');
      lbl.innerText = `شما در حال ${nwo.name} هستید به مدت: `;
      const timeX = document.createElement('span');
      timeX.innerText = msToDur(new Date() - new Date(nwo.time));
      setInterval(()=>timeX.innerText = msToDur(new Date() - new Date(nwo.time)), 1000);
      const btn = document.createElement('button');
      btn.innerText = 'پایان';
      btn.onclick = async () => {
        const checkRace = await W.read('calender/timeline-now');
        if (checkRace !== nowWork) {
          alert('شما قبلا این کار را تمام کرده اید. لطفا مجددا سعی کنید.');
          return W.reload();
        }
        const todayUrl = `calender/timeline/${dateF(new Date)}`;
        const today = JSON.parse((await W.read(todayUrl)) || "[]");
        today.push({
          name: nwo.name,
          start: nwo.time,
          end: new Date(),
        });
        await Promise.all([
          W.write(todayUrl, JSON.stringify(today)),
          W.write('calender/timeline-now','none'),
        ]);
        await W.reload();
      };
      const div = document.createElement('div');
      div.appendChild(lbl);
      div.appendChild(timeX);
      div.appendChild(btn);
      div.appendChild(todayLink);
      return div;
    })());
    const deadlineDiv = (()=>{
      const link = document.createElement('a');
      link.href = "/deadline";
      link.innerText = `مشاهده ددلاین ها`;
      const div = document.createElement('div');
      div.appendChild(link);
      return div;
    })();
    const div = document.createElement('div');
    div.appendChild(urlDiv);
    div.appendChild(wikiDiv);
    div.appendChild(backupDiv);
    div.appendChild(nowWorkDiv);
    div.appendChild(deadlineDiv);
    return {type:'dom', data: div};
  },
})
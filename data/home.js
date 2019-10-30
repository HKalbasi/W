(W) => ({
  run: () => {
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
    const div = document.createElement('div');
    div.appendChild(urlDiv);
    div.appendChild(wikiDiv);
    div.appendChild(backupDiv);
    return {type:'dom', data: div};
  },
})
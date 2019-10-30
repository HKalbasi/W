(W) => ({
  run: async () => {
    const click = (elem) => {
      if(elem && document.createEvent) {
          var evt = document.createEvent("MouseEvents");
          evt.initEvent("click", true, false);
          elem.dispatchEvent(evt);
      }
    };
    const triggerDownload = (json) => {
      const blob = new Blob([json],{type: 'text/json'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "backup.json";
      click(link);
    };
    const backup = async () => {
      const l = await Promise.all((await W.list()).map(x=>W.read(x).then(y=>[x,y])));
      triggerDownload(
        JSON.stringify(
          l.filter(
            ([x,y])=>y!=null
          )
        )
      );  
    };
    const openFile = async () => {
      return new Promise((res,rej) => {
        const domInput = document.createElement('input');
        domInput.type = 'file';
        domInput.onchange = async (e) => {
          const file = e.target.files[0];
          var reader = new FileReader();
          reader.onload = function(){
            res(reader.result);
          };
          reader.readAsText(file);
        }
        click(domInput);
      });
    };
    const recover = async () => {
      const d = JSON.parse(await openFile());
      await Promise.all(d.map(([x,y]) => W.write(x,y)));
      alert('done');
    };
    const createButton = (caption, onclick) => {
      const x = document.createElement('button');
      x.innerText = caption;
      x.onclick = onclick;
      return x;
    };
    const div = document.createElement('div');
    div.appendChild(createButton('recover', recover));
    div.appendChild(createButton('backup', backup));
    return {type: 'dom', data: div};
  },
})
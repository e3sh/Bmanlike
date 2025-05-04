function stageGen(layer, w, h, blocktype){

    //const maze  = {init:()=>{}, draw:()=>{}, step:()=>{}, BG:blocktype, ready:true
    //, blockposlist:()=>{return []}};//{x:10,y:10},{x:11,y:11},{x:12,y:12}]}};//new mazemake( layer, w, h, blocktype);
    //const dangeon = {mapdata:[[]], create:()=>{}};//new Dangeon(w, h);

    //const MAP_W = w;
    //const MAP_H = h;

    const BG = blocktype;

    this.ready = true;
    
    this.BG = BG;

    this.MW = w;
    this.MH = h;
    //this.create = create;
    //this.init = create;
    //this.MZ = maze;
    //this.DG = dangeon;

    //this.draw = maze.draw;
    //this.blockposlist = () =>{ return []};//maze.blockposlist;
    //this.blockmap = maze.blockmap;

    this.deplist = [];

    const create = ()=>{

      for (let i=0; i<this.MH; i++){
        for (let j=0; j<this.MW; j++){

          layer.putTileAt( BG.FLOOR, j,i);
          if (((i%2==1)||(j%2==1)) &&
            (Phaser.Math.Between(0,100) <10)) layer.putTileAt( BG.BLOCK, j,i);

          if (((i%2==0)&&(j%2==0)) ||
            (i==0 || i==this.MH-1 || j==0 || j==this.MW-1)) layer.putTileAt( BG.WALL, j,i);
        }
      }

      this.ready = true;
      this.deplist = [];
    }
    this.init = create;

    const roomcheck = (layer, x, y )=>{

      return false;
    }
    this.roomlamp = roomcheck;

    const droot =(layer)=>{

      for (let i in dangeon.mapdata){
        for (let j in dangeon.mapdata[i]){
          if (dangeon.mapdata[i][j]){
            layer.removeTileAt(i,j);
          }
        }
      }
    }

    this.droot = droot;

    function blockposlist(blocktype=BG.BLOCK){

      let list = [];
      for (let i=1; i<this.MH-1; i++){
          for (let j=1; j<this.MW-1; j++){
              if (layer.getTileAt(j,i).index == blocktype){
                  list.push({x:j, y:i});
              }
          }
      }
      return list;
  }
  this.blockposlist = blockposlist; 

}
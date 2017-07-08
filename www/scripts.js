var todo={
    filterFlag: 'all',
    events:[]
};//todo

document.addEventListener('init',function(event){
    var view=event.target.id;
    if(view==='menu'||view==='list'){
        todo[view+'Init'](event.target);
    }//if
}//fu

,false);

todo.listInit=function(target){
    this.list=document.querySelector("#todo-list");
    
    target.querySelector('#splitter-toggle')
      .addEventListener('click', function(){
          document.querySelector("#splitter-menu").open();
      });//query
      
      target.querySelector("#add")
       .addEventListener('click', this.addItemPrompt.bind(this));
       
      todoStorage.init();
      
      this.refresh();
       
};//listinit

todo.addItemPrompt=function(){
    ons.notification.prompt("agrega tu tarea a hacer, aqui:",
      {title: "nueva tarea",
      cancelable:true,
      callback:function(label){
          if(label===''||label===null){
              return;
          }//if
          if(todoStorage.add(label)){
              this.refresh();
          }//if add
          else{
              ons.notification.alert("fallo, no se agrego");
          }//else
      }.bind(this)//callback
      }//title
    );//notification
};//additemprompt


todo.refresh=function(){
    var items=todoStorage.filter(this.filterFlag);
    
    this.list.innerHTML=items.map(function(item){
        return document.querySelector('#todo-list-item').innerHTML
          .replace('{{label}}',item.label)
          .replace('{{checked}}', item.status==='completed'?'checked' : '');
    }).join('');
    
    var children=this.list.children;
    
    this.events.forEach(function(event,i){
        event.element.removeEventListener('click',event.function);
    });//forEach events
    
    this.events=[];
    var event={};
    
    items.forEach(function(item,i){
        event={
            element: children[i].querySelector('ons-input'),
            function:this.toggleStatus.bind(this,item.label)
        };
        this.events.push(event);
        event.element.addEventListener('click',event.function);
        
        event={
            element:children[i].querySelector('ons-icon'),
            function:this.removeItemPrompt.bind(this,item.label)
        };
        this.events.push(event);
        event.element.addEventListener('click',event.function);
        
    }.bind(todo)
    );//forEach items
};//refresh

todo.toggleStatus=function(label){
    if(todoStorage.toggleStatus(label)){
        this.refresh();
    }else{
        ons.notification.alert('fallo en cambiar el estado de la tarea');
    }
};//toggleStatus

todo.removeItemPrompt=function(label){
    ons.notification.confirm('quisieras remover la tarea \"'+label+'\" de la lista?',
    {title:'eliminar item?',
      callback:function(answer){
          if(answer===1){
              if(todoStorage.remove(label)){
                  this.refresh();
              }else{
                  ons.notification.alert('fallo en eliminar el item');
              }
          }//if
      }.bind(this)//callback
    }//title
    );//notification
};//removeitemprompt


todo.menuInit=function(target){
    target.querySelector('ons-list').addEventListener('click',
     this.filter.bind(this) );
};//menuinit

todo.filter=function(evt){
    this.filterFlag=evt.target.parentElement.getAttribute('data-filter') || 'all';
    this.refresh();
};//filter



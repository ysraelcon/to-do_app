var todoStorage={
  collection:[]  
};

todoStorage.init=function(){
    this.collection=JSON.parse(localStorage.getItem('todo')||'[]');
};//td init

todoStorage.hasItem=function(label){
    return this.collection.some(function(item){
        return item.label===label;
    }) ;  
};//td hasItem


todoStorage.save=function(){
    localStorage.setItem('todo', JSON.stringify(this.collection))
};//td save

todoStorage.add=function(label){
    if(this.hasItem(label)){
        return false;
    }
    
    this.collection.push({
        label:label,
        status:"uncompleted"
    }); //push
    
    this.save();
    return true;
};//td add

todoStorage.remove=function(label){
    if(!this.hasItem(label)){
        return false;
    }
    
    this.collection.forEach(function(item, i){
        if(item.label===label){
            this.collection.splice(i,1);
        }
    }.bind(this));//forEach
    
    this.save();
    return true;
    
};//td remove

todoStorage.toggleStatus=function(label){
    if(!this.hasItem(label)){
        return false;
    }
    
    this.collection.forEach(function(item){
        if(item.label===label){
            item.status=item.status==='completed'?'uncompleted':'completed';
        }
    });//forEach
    
    this.save();
    return true;
    
};// td togglestatus

todoStorage.filter=function(status){
    if(status==='all'){
        return this.collection;
    }
    
    return this.collection.filter(function(item){
        return item.status===status;
    });//filter
    
};//td filter


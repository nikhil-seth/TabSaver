let query = { active: true, currentWindow: true };
let counter=0;
let currentactive=[];
const currTab={
    title:"",
    url:"",
    cid:0,
    initialize(Tab){
        this.title=Tab.title;
        this.url=Tab.url;
        counter+=1;
        this.cid=counter;
        currentactive.push(this.cid);
    },
    retobj(){
        let obj={};
        obj[this.cid]=this;
        return obj;
    },
    run(){
        console.log(this.cid);
    },
    saveTabToStorage(){
        chrome.storage.local.set(this.retobj());
    },
    outputTab(){
        // Will Output HTML for tab.
        x=document.getElementById('title-col');
        y=document.createElement('div');
        y.className=`text-light title-text c${this.cid}`;
        y.textContent=`${this.title}`;
        x.insertBefore(y,x.firstChild);
        x=document.getElementById('add-col');
        y=document.createElement('div');
        y.className=`addbtncls c${this.cid}`;
        y.innerHTML=`<button type="button" value ="${this.cid}" class="btn btn-light add-btn">
                    <object class="add-btn-obj" type="image/svg+xml" data="icons/add.svg">
                    </object></button>`
        x.insertBefore(y,x.firstChild);
        x=document.getElementById(`rem-col`);
        y=document.createElement('div');
        y.className=`rembtncls c${this.cid}`;
        y.innerHTML=`<button type="button" value ="${this.cid}" class="btn btn-light rem-btn">
                    <object class="rem-btn-obj" type="image/svg+xml" data="icons/close.svg">
                    </object></button>`
        x.insertBefore(y,x.firstChild);
        
    }
};
// Remove Tab from Storage Function
removeTabFromStorage=function(id){
    chrome.storage.local.remove(`${id}`);
}
// Remove Tab Functionality ( Remove tab from storage + html, given id of tab)
removeTabButton=document.getElementById('rem-col');
removeTab=function(e){
    console.log("Tab Removal Called");
    let id=e.toElement.value;
    x=`c${id}`;
    x=document.getElementsByClassName(x);
    while(x.length>0){
        x[0].remove();
    }
    removeTabFromStorage(id);
}
removeTabButton.addEventListener('click',removeTab);



// Add Tab Functionality.
addTabcol=document.getElementById('add-col');
addTab=function(e){
    console.log("Tab Add Function");
    let id=e.toElement.value;
    chrome.storage.local.get([id],function(Tab){
        console.log(Tab);
        currTab.initialize(Tab[id]);
        chrome.tabs.create({"url":currTab.url});
        removeTab(e);
    });
}
addTabcol.addEventListener("click",addTab);

// Loading Script
/*window.onload=function(){
    for(let i=0;i<currentactive.length;i++){
        chrome.storage.local.get(currentactive[i],function(Tab){
            currTab.initialize(Tab[i]);
            currTab.outputTab();
        });
    }
};*/
// Save Tab Functionality.
saveTabButton=document.getElementById('addBtn');
saveTab=function(tabs){
    Tab=tabs[0];
    if(Tab!=undefined && Tab!=null){
        currTab.initialize(Tab);
        currTab.saveTabToStorage();
        currTab.outputTab();
    }
};
saveTabButton.addEventListener('click',function(){
    chrome.tabs.query(query,saveTab);
});

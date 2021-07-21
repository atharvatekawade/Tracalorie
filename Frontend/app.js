// Storage Controller
const StorageCtrl=(function(){

    return {
        getToday:function() {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;

            let currentDate=localStorage.getItem('date');
            let oldItems=null;
            let currentItems=JSON.parse(localStorage.getItem('items'));
            if(!currentItems) {
                currentItems=[];
            }
            if(!currentDate) {
                localStorage.setItem('date',today);
            }
            if(today!=currentDate && currentDate) {
                oldItems=currentItems;
                localStorage.setItem('date',today);
                localStorage.setItem('items',JSON.stringify([]));
                currentItems=[];
            }
            return {oldItems,oldDate:currentDate,currentItems};
        },
        addItemStorage:function(item) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;

            let currentDate=localStorage.getItem('date');
            if(today!=currentDate && currentDate) {
                window.location.reload();
            }
            else {
                let items;
                items=localStorage.getItem('items');
                if(!items) {
                    items=[];
                }
                else {
                    items=JSON.parse(items);
                }
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
        },
        updateItemStorage:function(updatedItem) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;

            let currentDate=localStorage.getItem('date');
            if(today!=currentDate && currentDate) {
                window.location.reload();
            }
            else {
                let items;
                items=localStorage.getItem('items');
                if(!items) {
                    items=[];
                }
                else {
                    items=JSON.parse(items);
                }
                items.forEach((item) => {
                    if(item._id==updatedItem._id) {
                        item.name=updatedItem.name;
                        item.calories=updatedItem.calories;
                    }
                })
                localStorage.setItem('items',JSON.stringify(items));
            }
        },
        deleteItemStorage:function(id) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;

            let currentDate=localStorage.getItem('date');
            if(today!=currentDate && currentDate) {
                window.location.reload();
            }
            else {
                let items;
                items=localStorage.getItem('items');
                if(!items) {
                    items=[];
                }
                else {
                    items=JSON.parse(items);
                }
                items=items.filter(item => item._id!=id);
                localStorage.setItem('items',JSON.stringify(items));
            }
        },
        clearToday:function() {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;

            let currentDate=localStorage.getItem('date');
            if(today!=currentDate && currentDate) {
                window.location.reload();
            }
            else {
                localStorage.setItem('items',JSON.stringify([]));
            }
        }
    }
})();


// Item Controller
const ItemCtrl=(function(){

    // Item Constructor
    const Item = function(id,name,calories) {
        this._id=id;
        this.name=name;
        this.calories=calories;
    }

    // State
    const data={
        items:[],
        currentItem:null,
        totalCalories:0
    }

    return {
        addItem:function(name,calories) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;
            let id=null;

            if(data.items.length==0) {
                id=0;
            }
            else {
                const lastId=data.items[data.items.length-1]._id;
                id=Number(lastId.split('-')[1])+1;
            }
            const itemId=today+'-'+String(id);
            calories=parseInt(calories);
            // Create new Item
            const newItem=new Item(itemId,name,calories);
            data.items.push(newItem);
            data.totalCalories=data.totalCalories+calories;
            return newItem;
        },
        getItemId:function(id) {
            return data.items.find(item => item._id==id);
        },
        getCurrentItem:function() {
            return data.currentItem;
        },
        setCurrentItem:function(item) {
            data.currentItem=item;
        },
        setState:function(items) {
            data.items=items;
            data.totalCalories=0;
            data.items.forEach((item) => data.totalCalories+=item.calories);
            console.log('State set total',data.totalCalories);
        },
        updateItem:function(name,calories) {
            calories=parseInt(calories);
            let found=null;
            data.items.forEach((item => {
                if(item._id==data.currentItem._id) {
                    data.totalCalories=data.totalCalories-item.calories+calories;
                    item.name=name;
                    item.calories=calories;
                    found=item;
                }
            }))

            return found;
        },
        deleteItem:function(id) {
            let found=null;
            let index=null;

            data.items.forEach((item,idx) => {
                if(item._id==id) {
                    found=item;
                    index=idx;
                }
            })

            data.totalCalories=data.totalCalories-found.calories;
            data.items.splice(index,1);
            return found;
        },
        clearAll:function() {
            data.items=[];
            data.totalCalories=0;
        },
        getTotalCalories:function() {
            return data.totalCalories;
        }
    }

})();



// UI Controller
const UICtrl=(function(){

    const UISelectors={
        itemList:'#item-list',
        listItems:`${this.itemList} li`,
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories',
        dateBtn:'#date-btn',
        dateInput:'#date-input',
        formBox:'.card',
        heading:'.brand-logo',
        chartIcon:'.fa-chart-line',
        dropDown:'select',
        modalHeading:'.modal-content h4'
    }


    return {
        populateItems: function(items) {
            let html='';
            items.forEach((item) => {
                html=html+`
                <li class="collection-item" id="item-${item._id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit item fa fa-pencil"></i>
                    </a>
                </li>
                `
            })
            
            // Insert list items

            document.querySelector(UISelectors.itemList).innerHTML=html;
        },
        populateOldItems: function(items) {
            console.log('Populating old items');
            let html='';
            items.forEach((item) => {
                html=html+`
                <li class="collection-item" id="item-${item._id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                </li>
                `
            })

            //console.log(html);
            //console.log(document.querySelector(UISelectors.itemList));
            
            // Insert list items

            document.querySelector(UISelectors.itemList).innerHTML=html;
            document.querySelector(UISelectors.itemList).style.display='block';
        },
        removeForm:function() {
            const form=document.querySelector(UISelectors.formBox);
            const removeBtn=document.querySelector(UISelectors.clearBtn);
            if(form) {
                form.remove();
            }
            if(removeBtn) {
                removeBtn.remove();
            }

        },
        getSelectors: function() {
            return UISelectors;
        },

        getItemInput:function() {
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem:function(item) {
            UICtrl.showList();
            const li=document.createElement('li');
            li.className='collection-item';
            li.id=`item-${item._id}`;
            li.innerHTML=`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        clearInput:function() {
            document.querySelector(UISelectors.itemNameInput).value='';
            document.querySelector(UISelectors.itemCaloriesInput).value='';
        },
        showTotalCalories:function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent=totalCalories;
        },
        hideList:function() {
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        clearEditState:function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display='none';
            document.querySelector(UISelectors.deleteBtn).style.display='none';
            document.querySelector(UISelectors.backBtn).style.display='none';
            document.querySelector(UISelectors.addBtn).style.display='inline';
        },
        showEditState:function() {
            document.querySelector(UISelectors.updateBtn).style.display='inline';
            document.querySelector(UISelectors.deleteBtn).style.display='inline';
            document.querySelector(UISelectors.backBtn).style.display='inline';
            document.querySelector(UISelectors.addBtn).style.display='none';
        },
        showList:function() {
            document.querySelector(UISelectors.itemList).style.display='block';
        },
        addItemToForm:function() {
            document.querySelector(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;
        },
        updateListItem:function(item) {
            const li=document.getElementById(`item-${item._id}`);
            li.innerHTML=`
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit item fa fa-pencil"></i>
                </a>`;
        },
        deleteListItem:function(id) {
            const item=document.getElementById(`item-${id}`);
            if(item) {
                item.remove();
            }
        },
        removeItems:function() {
            document.querySelector(UISelectors.itemList).innerHTML='';
        },
        renderChart:function(items) {
            const dataPoints=[];
            let counter=1;
            console.log('Chart items:');
            for(let key in items) {
                console.log(`${key}: ${items[key]} calories`);
                dataPoints.push({ x:counter++,y: items[key] });
            }

            const chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2",
                // title:{
                //     text: "Simple Line Chart"
                // },
                data: [{        
                    type: "line",
                      indexLabelFontSize: 16,
                    dataPoints
                }]
            });
            chart.render();
        }
    }
})();



// App Controller
const App=(function(StorageCtrl,ItemCtrl,UICtrl){

    const data= {
        monthData: {
            normalArray:[31,28,31,30,31,30,31,31,30,31,30,31],
            leapArray:[31,29,31,30,31,30,31,31,30,31,30,31],
            months:['January','February','March','April','May','June','July','August','September','October','November','December']
        }
    }

    //Load Event Listeners

    const loadEventListeners=function() {
        const UISelectors=UICtrl.getSelectors();

        document.addEventListener('keydown',(e) => {
            if(e.code=='Enter') {
                e.preventDefault();
                return false
            }
        })

        //Add item event

        const addItemSubmit = (e) => {

            e.preventDefault();
            
            // Get form input

            const input=UICtrl.getItemInput();

            if(input.name!='' && input.calories!='') {

                //Add item
                const newItem=ItemCtrl.addItem(input.name,input.calories);
                UICtrl.addListItem(newItem);

                const totalCalories=ItemCtrl.getTotalCalories();
                UICtrl.showTotalCalories(totalCalories);

                
                UICtrl.clearInput();
                StorageCtrl.addItemStorage(newItem);
            }
        }

        const itemEditClick = (e) => {
            e.preventDefault();
            if(e.target.classList.contains('edit','item')) {
                const listId=e.target.parentNode.parentNode.id.slice(5,);
                const itemToEdit=ItemCtrl.getItemId(listId);
                ItemCtrl.setCurrentItem(itemToEdit);
                UICtrl.addItemToForm();
                UICtrl.showEditState();

            }
        }

        const itemUpdateSubmit = (e) => {
            e.preventDefault();
            const input=UICtrl.getItemInput();

            const updatedItem=ItemCtrl.updateItem(input.name,input.calories);
            // const updatedItem=retVal[0];
            // const oldCalories=retVal[1];

            const totalCalories=ItemCtrl.getTotalCalories();
            
            UICtrl.updateListItem(updatedItem);
            UICtrl.showTotalCalories(totalCalories);
            UICtrl.clearEditState();

            StorageCtrl.updateItemStorage(updatedItem);
        }

        const deleteButtonSubmit = (e) => {
            e.preventDefault();

            const currentItem=ItemCtrl.getCurrentItem();

            const item=ItemCtrl.deleteItem(currentItem._id);
            const totalCalories=ItemCtrl.getTotalCalories();
            
            UICtrl.deleteListItem(item._id);
            UICtrl.clearEditState();
            UICtrl.showTotalCalories(totalCalories);
            
            StorageCtrl.deleteItemStorage(item._id);
        }

        const clearAllItems = (e) => {

            ItemCtrl.clearAll();

            UICtrl.removeItems();
            const totalCalories=ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            UICtrl.hideList();

            StorageCtrl.clearToday();
        }

        const fetchOldItems = (e) => {
            e.preventDefault();
            const date=document.querySelector(UISelectors.dateInput).value;
            if(date!='') {
                App.fetchItems(date)
                    .then((items) => {
                        console.log('Items fetched',items);
                        ItemCtrl.setState(items);

                        UICtrl.removeForm();

                        if(items.length==0) {
                            UICtrl.hideList();
                        }
                        else {
                            UICtrl.populateOldItems(items);
                        }
                        const totalCalories=ItemCtrl.getTotalCalories();
                        UICtrl.showTotalCalories(totalCalories);
                    })
                    .catch(err => console.log(err))
            }
        }

        const clickChart = (e) => {
            e.preventDefault();
            console.log('Chart icon clicked');

            let today = new Date();
            let mm;
            let yyyy = today.getFullYear();

            mm=document.querySelector(UISelectors.dropDown).value;
            if(mm=='') {
                mm=String(today.getMonth() + 1).padStart(2, '0');
            }

            today = mm + '-' + yyyy;
            //UICtrl.loadChart();

            document.querySelector(UISelectors.modalHeading).innerHTML=`<i>${data.monthData.months[parseInt(mm)-1]} Calories track</i>`;

            App.fetchMonth(today)
                .then(items => UICtrl.renderChart(items))
                .catch(err => console.log(err));
        }

        document.querySelector(UISelectors.addBtn).addEventListener('click',addItemSubmit);
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        document.querySelector(UISelectors.heading).addEventListener('click',(e) => {
            e.preventDefault();
            window.location.reload();
        })
        document.querySelector(UISelectors.backBtn).addEventListener('click',function(e){
            e.preventDefault();
            UICtrl.clearEditState();
        });
        document.querySelector(UISelectors.chartIcon).addEventListener('click',clickChart);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',deleteButtonSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItems);
        document.querySelector(UISelectors.dateBtn).addEventListener('click',fetchOldItems);
        $(document).ready(function(){
            $('.modal').modal();
        });

        $(document).ready(function(){
            $('select').material_select();
        });
    }

    return {
        init:function() {
            
            UICtrl.clearEditState();

            const { oldItems,oldDate,currentItems }=StorageCtrl.getToday();
            ItemCtrl.setState(currentItems);

            if(currentItems.length==0) {
                UICtrl.hideList();
            }
            else {
                UICtrl.populateItems(currentItems);
            }
            const totalCalories=ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();

            if(oldItems) {
                App.syncDB(oldItems,oldDate);
            }
            console.log('Component Mounted successfully');

        },
        fetchItems:async function(date) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '-' + mm + '-' + yyyy;
            //console.log(date==today);
            if(date==today) {
                window.location.reload();
            }
            try {
                const response=await axios.get(`http://localhost:5000/${date}`);
                return response.data;
            }
            catch(err) {
                throw new Error(err);
            }
        } ,
        fetchMonth:async function(month) {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = dd + '-' + mm + '-' + yyyy;

            try {
                const response=await axios.get(`http://localhost:5000/month/${month}`);
                const calories={};
                const year=parseInt(month.slice(3,));

                let days;
                const num=parseInt(month.slice(0,2));

                if(year%100==0) {
                    if(year%400==0) {
                        days=data.monthData.leapArray[num];
                    }
                    else {
                        days=data.monthData.normalArray[num];
                    }
                }

                else if(year%4==0) {
                    days=data.monthData.leapArray[num];
                }

                else {
                    days=data.monthData.normalArray[num];
                }

                for(let i=1;i<=days;i++) {
                    let newDate=String(i).padStart(2, '0')+'-'+month;
                    calories[newDate]=0;
                    if(newDate==today) {
                        calories[newDate]=ItemCtrl.getTotalCalories();
                    }
                }

                response.data.forEach((item) => {
                    calories[item.date]+=item.calories;
                })

                console.log('The whole calories object is',calories);
                return calories;
            }
            catch(err) {
                throw new Error(err);
            }
        },
        syncDB:async function(items,date) {
            console.log('DB syncing for date',date);
            items.forEach((item) => {
                item.date=date;
                item.month=date.slice(3,);
            })
            const body={items};
            console.log(body);
            try {
                const response=await axios.post('http://localhost:5000/',body);
                console.log('Response: ',response);
            }
            catch(err) {
                console.log('There was an error',err);
            }
        }
    }
    
})(StorageCtrl,ItemCtrl,UICtrl);

App.init();




// const test = async() => {
//     const res=await fetch('https://jsonplaceholder.typicode.com/users');
//     const resJson=await res.json();
//     return resJson;
// }

// const fun = () => {
//     test()
//         .then(res => console.log(res))
//         .catch(err => console.log(err))
// }

// fun();

// function nameItr(names) {
//     var nextIndex=0;
//     return {
//         next:function() {
//             return nextIndex<names.length ? {value:names[nextIndex++],done:false} : {done:true}
//         }
//     }
// }

// const namesArr=['jack','jill','john'];

// const names=nameItr(namesArr);

// console.log(names.next());
// console.log(names.next());
// console.log(names.next());
// console.log(names.next());


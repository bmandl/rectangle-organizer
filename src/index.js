import './style.css';
var group = document.createElement('div');
group.setAttribute("class", "group");
group.setAttribute("draggable", true);
var icon = document.createElement('div');
icon.setAttribute("class", "icon");
icon.setAttribute("draggable", true);
var dragData = {
    element: 0,
    group: 0
}

let onDragStart = function (event) {
    //event.dataTransfer.setData('text/plain', event.target.id);
    dragData.element = event.target.id;
    dragData.group = event.target.parentNode.id;
}

let onDragOver = function (event) {
    event.preventDefault();
}

let deleteNode = function (event) {
    event.target.remove();
}

let onDrop = function (event) {
    event.preventDefault();
    const dragelement = document.getElementById(dragData.element);
    dragelement.onclick = deleteNode;
    let newicon = createPanelElement('icon');
    let newgroup = createPanelElement('group');
    let dropzone = event.target;
    let pickzone = document.getElementById(dragData.group);
    //change icon to group if drop target is icon
    if (dropzone.className.includes('icon')) {
        dropzone.className = dropzone.className.replace('icon', 'group');
        dropzone.id = dropzone.id.replace('icon', 'group');
    }

    //change droped element id based on hirearchy
    dragelement.id = dragelement.className == 'icon' ? hirearchyId('icon', dropzone) : hirearchyId('group', dropzone);

    //drop dragged element on dropzone
    console.log('appended child: ' + dropzone.appendChild(dragelement).id);

    if (pickzone.id == 'panel') {
        if (dragelement.id.includes('icon'))
            console.log('new icon: ' + pickzone.appendChild(newicon).id);
        else
            console.log('new group: ' + pickzone.appendChild(newgroup).id);
    }

    //incrementing empty group on panel id, if duplicate id is in container
    let panelGroup = document.getElementById('panel').getElementsByClassName('group')[0];
    if (dropzone.id == panelGroup.id) {
        panelGroup.id = 'group' + incrementId(panelGroup.id);
    }

    //event.dataTransfer.clearData();

}

//create new element for panel based on currently droped element
function createPanelElement(elementType) {
    let element;
    let id = incrementId(dragData.element);
    if (elementType == 'icon') {
        element = icon.cloneNode();
        element.id = 'icon' + id
    }

    else if (elementType == 'group') {
        element = group.cloneNode();
        element.ondragover = onDragOver;
        element.ondrop = onDrop;
        element.id = 'group' + id;
    }

    element.ondragstart = onDragStart;
    return element;
}

function incrementId(id) {
    return (parseInt(id.match(/\d+/g).join('')) + 1).toString();
}

function hirearchyId(elementType, dropzone) {
    let id = dropzone.id != 'main' ? dropzone.id.match(/\d+/g).join('') : ''; //number suffix of dropzone - etc. 01 (group01)    
    let nodes = Array.from(dropzone.children);
    let sufixes = [];
    //get array of all children suffixes
    nodes.forEach(node => {
        let sufix = node.id.match(/\d/g);
        sufix = sufix.splice(-1);
        sufixes.push(parseInt(sufix));
    });
    //sort sufixes array ascending
    sufixes.sort((a, b) => a - b);
    console.log(sufixes);
    let num = (sufixes[sufixes.length - 1] + 1);
    if (isNaN(num)) num = 0;
    let sufix = id + num.toString();

    return elementType == 'icon' ? 'icon' + sufix : 'group' + sufix;
}

document.getElementById("main").ondrop = onDrop;
document.getElementById("main").ondragover = onDragOver;

//append empty group and icon to panel for start
let newicon = document.getElementById("panel").appendChild(icon.cloneNode());
let emptygroup = document.getElementById("panel").appendChild(group.cloneNode());
newicon.ondragstart = onDragStart;
newicon.id = 'icon0';
emptygroup.ondragstart = onDragStart;
emptygroup.id = 'group0';



 const draggable = document.querySelector(".circle");
let currentAngle = 0;
const finalAngel = 0 
setupDraggable(draggable, onDragStart, onDrag, onDragEnd);   



function onDragStart() {
  // You can add code here if needed
}

function onDrag(angle) {
    const finalAngel = currentAngle + angle;
    console.log(finalAngel);
    draggable.style.transform = `rotate(${finalAngel}deg)`;
  
}


function onDragEnd(angle) {
  const finalAngel = currentAngle + angle;


  draggable.style.transform = `rotate(${finalAngel}deg)`;
}
function setupDraggable(element, onDragStart, onDrag, onDragEnd) {
    let startX, startY, startAngle = 0;
  
    element.addEventListener("mousedown", dragStart);
    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchend", dragEnd);
  
    function dragStart(e) {
      if (e.type === "touchstart") {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
      }
  
      const rect = element.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
  
      startAngle = Math.atan2(startY - center.y, startX - center.x) * 180 / Math.PI;
  
      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", drag);
      document.addEventListener("mouseup", dragEnd);
    }
  
    function drag(e) {
      e.preventDefault();
      let x, y;
  
      if (e.type === "touchmove") {
        x = e.touches[0].clientX - startX;
        y = e.touches[0].clientY - startY;
      } else {
        x = e.clientX - startX;
        y = e.clientY - startY;
      }
  
      const rect = element.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
  
      const angle = Math.atan2(y, x) * 180 / Math.PI;
  
      if (typeof onDrag === "function") {
        onDrag(angle - startAngle);
      }
    }
  
    function dragEnd(e) {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("touchmove", drag);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchend", dragEnd);
      let x, y;
  
      if (e.type === "touchmove") {
        x = e.touches[0].clientX - startX;
        y = e.touches[0].clientY - startY;
      } else {
        x = e.clientX - startX;
        y = e.clientY - startY;
      }
  
      const rect = element.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
  
      const angle = Math.atan2(y, x) * 180 / Math.PI;
      if (typeof onDragEnd === "function") {
        onDragEnd(angle - startAngle);
      }
    }
  }
  
  // Export function as a global variable
  window.setupDraggable = setupDraggable;
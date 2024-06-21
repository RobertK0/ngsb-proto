// document.querySelectorAll(".block").forEach((el) => {
//   el.addEventListener("mousedown", () => {
//     console.log("dragging");
//   });
//   el.addEventListener("mouseup", () => {
//     console.log("dragging stop");
//   });
// });
let lock = false;
let section = null;
function moveDivWithAnimation(
  container,
  elementToMove,
  targetElement,
  classToAdd
) {
  lock = true;
  console.log("running move div", classToAdd);
  console.log(targetElement);
  if (section) {
    targetElement = targetElement.cloneNode(true);
  }
  console.log(targetElement);

  var divHeight = elementToMove.offsetHeight;
  if (classToAdd === "test") {
    container.insertBefore(targetElement, elementToMove);
  } else {
    container.insertBefore(
      targetElement,
      elementToMove.nextElementSibling
    );
  }

  elementToMove.classList.add(classToAdd);
  console.log(elementToMove.style.transform);

  setTimeout(function () {
    elementToMove.classList.remove(classToAdd);
    lock = false;
  }, 150); // This should match the duration of the transition
}
let mirror = null;
let block = null;
document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;

  //TODO remember originating container if needed
  section = e.target.closest("[data-droppable='false']");

  const container = e.target.closest("[data-container]");
  if (container) {
    console.log("dragging start", e);
    block = e.target.closest("[data-draggable='true']");
    if (block) {
      var rect = block.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      mirror = block.cloneNode(true);
      block.style.opacity = 0.2;
      block.setAttribute("data-being-dragged", "");
      mirror.classList.add("block-mirror");
      mirror.style.position = "fixed";
      mirror.style.pointerEvents = "none";
      mirror.style.top = "0";
      mirror.style.left = "0";
      mirror.style.height = block.offsetHeight;
      mirror.style.width = block.offsetWidth;
      mirror.style.transform = `translate3d(${e.clientX - x}px, ${
        e.clientY - y
      }px, 0px)`;
      let prevX = null;
      let prevY = null;

      //ON MOVE ELEMENT LISTENER
      document.onmousemove = (e) => {
        const isContainerDroppable = !!document
          .elementFromPoint(e.clientX, e.clientY)
          .closest('[data-droppable="true"]');

        mirror.style.transform = `translate3d(${e.pageX - x}px, ${
          e.pageY - y
        }px, 0px)`;
        prevX = e.pageX;
        prevY = e.pageY;
        const mirrorRect = mirror.getBoundingClientRect();
        // console.log(
        //   block.nextElementSibling.getBoundingClientRect().bottom
        // );
        // console.log("mirror", mirrorRect.bottom);
        if (lock) {
          return;
        }

        const elementUnderMirrorTop = document.elementFromPoint(
          e.clientX,
          mirrorRect.top
        );
        const isElementUnderTopBlock =
          elementUnderMirrorTop &&
          elementUnderMirrorTop.hasAttribute("data-block") &&
          !elementUnderMirrorTop.hasAttribute("data-being-dragged");

        //

        const elementUnderMirrorBottom = document.elementFromPoint(
          e.clientX,
          mirrorRect.bottom
        );
        const isElementUnderBottomBlock =
          elementUnderMirrorBottom &&
          elementUnderMirrorBottom.hasAttribute("data-block") &&
          !elementUnderMirrorBottom.hasAttribute(
            "data-being-dragged"
          );
        console.log(mirrorRect.top);
        console.log(
          elementUnderMirrorTop.getBoundingClientRect().top +
            elementUnderMirrorTop.offsetHeight / 2
        );
        if (
          isElementUnderTopBlock &&
          isContainerDroppable &&
          mirrorRect.top <
            elementUnderMirrorTop.getBoundingClientRect().top +
              elementUnderMirrorTop.offsetHeight / 2
        ) {
          console.log("under top:", elementUnderMirrorTop);

          //move down
          moveDivWithAnimation(
            elementUnderMirrorTop.parentElement,
            elementUnderMirrorTop,
            block,
            "test"
          );
        } else if (
          isElementUnderBottomBlock &&
          isContainerDroppable &&
          mirrorRect.bottom >
            elementUnderMirrorBottom.getBoundingClientRect()
              .bottom -
              elementUnderMirrorBottom.offsetHeight / 2
        ) {
          console.log("under bot:", elementUnderMirrorBottom);
          //move up
          moveDivWithAnimation(
            elementUnderMirrorBottom.parentElement,
            elementUnderMirrorBottom,
            block,
            "test2"
          );
        }
      };
      container.append(mirror);
    }
  }
});
document.addEventListener("mouseup", (e) => {
  document.onmousemove = null;
  if (mirror) {
    mirror.remove();
  }
  block.style.opacity = "";
  block.removeAttribute("data-being-dragged");
  if (e.target.closest("[data-container]")) {
    console.log("dragging stop", e);
  }
  section = null;
});

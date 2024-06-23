let animationLock = false;
let dragActive = false;
let originElement = null;
let section = null;

let isFloatingMirrorCreated = false;
let isTargetMirrorCreated = false;

let floatingMirror = null;
let targetMirror = null;
let block = null;
let isCursorInsideDroppableContainer = false;
let prevX = null;
let prevY = null;
let x = null;
let y = null;
let elementInsideDropzone = false;

function moveDivWithAnimation(
  container,
  elementToMove,
  targetElement,
  classToAdd
) {
  animationLock = true;
  if (!isTargetMirrorCreated) {
    isTargetMirrorCreated = targetElement.cloneNode(true);
    isTargetMirrorCreated = true;
  }

  var divHeight = elementToMove.offsetHeight;

  console.log(targetMirror);
  console.log(elementToMove);
  if (classToAdd === "test") {
    container.insertBefore(targetMirror, elementToMove);
  } else {
    container.insertBefore(
      targetMirror,
      elementToMove.nextElementSibling
    );
  }

  elementToMove.classList.add(classToAdd);

  setTimeout(function () {
    elementToMove.classList.remove(classToAdd);
    animationLock = false;
  }, 150); // This should match the duration of the transition
}

const createTargetMirror = (e) => {
  targetMirror = floatingMirror.cloneNode(true);
  isCursorInsideDroppableContainer = true;

  targetMirror.style.position = "";
  targetMirror.querySelector(".inner-block").style.backgroundColor =
    "#f6b7b7";
  targetMirror.style.opacity = "0.2";

  targetMirror.style.pointerEvents = "";
  targetMirror.style.top = "";
  targetMirror.style.left = "";
  targetMirror.style.height = "";
  targetMirror.style.width = "";
  targetMirror.style.transform = "";

  // if (lock) {
  //   return;
  // }

  let isContainerDroppable = !!document
    .elementFromPoint(e.clientX, e.clientY)
    .closest('[data-droppable="true"]');

  isContainerDroppable = true;

  if (!isTargetMirrorCreated && isContainerDroppable) {
    e.target.append(targetMirror);
    isTargetMirrorCreated = true;
  }

  const mirrorRect = floatingMirror.getBoundingClientRect();

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
    !elementUnderMirrorBottom.hasAttribute("data-being-dragged");

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
      elementUnderMirrorBottom.getBoundingClientRect().bottom -
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

const removeTargetMirror = () => {
  console.log("running remove", targetMirror);
  isCursorInsideDroppableContainer = false;
  targetMirror.remove();
  targetMirror = null;
  isTargetMirrorCreated = false;
};

const addMirrorToDropzone = (dropzoneParent) => {
  console.log("running addMirrorToDropzone");
  elementInsideDropzone = true;
  dropzoneParent
    .querySelector(".drop-zone")
    .insertBefore(targetMirror, null);
};

const removeMirrorFromDropzone = () => {
  console.log(targetMirror.closest(".constitutional-block"));
  const parentBlock = targetMirror.closest(".constitutional-block");
  parentBlock.parentElement.insertBefore(
    targetMirror,
    parentBlock.nextElementSibling
  );
};

const trackMirrorMovement = (e) => {
  const isContainerDroppable = !!document
    .elementFromPoint(e.clientX, e.clientY)
    .closest('[data-droppable="true"]');
  floatingMirror.style.transform = `translate3d(${e.pageX - x}px, ${
    e.pageY - y
  }px, 0px)`;
  prevX = e.pageX;
  prevY = e.pageY;

  if (!isTargetMirrorCreated) return;
  if (animationLock) return;

  console.log("running animation calculation");

  const floatingMirrorRect = floatingMirror.getBoundingClientRect();
  // console.log(
  //   block.nextElementSibling.getBoundingClientRect().bottom
  // );
  // // console.log("mirror", mirrorRect.bottom);

  //Checks if element under floating mirror top border is a building block
  const elementUnderMirrorTop = document.elementFromPoint(
    e.clientX,
    floatingMirrorRect.top
  );
  const isElementUnderTopBlock =
    elementUnderMirrorTop &&
    elementUnderMirrorTop.hasAttribute("data-block") &&
    !elementUnderMirrorTop.hasAttribute("data-being-dragged");

  //Check if dropdpzone

  if (
    elementUnderMirrorTop.classList.contains(
      "constitutional-block"
    ) ||
    elementUnderMirrorTop.parentElement.classList.contains(
      "drop-zone"
    )
  ) {
    console.log(floatingMirror.dataset.level);
    console.log(elementUnderMirrorTop.dataset.level);
    if (
      +floatingMirror.dataset.level >
      +elementUnderMirrorTop.dataset.level
    ) {
      if (
        floatingMirrorRect.left >
        elementUnderMirrorTop.getBoundingClientRect().left + 32
      ) {
        addMirrorToDropzone(elementUnderMirrorTop);
        return;
      }
    }
  }

  //Checks if element under floating mirror bottom border is a building block
  const elementUnderMirrorBottom = document.elementFromPoint(
    e.clientX,
    floatingMirrorRect.bottom
  );

  const isElementUnderBottomBlock =
    elementUnderMirrorBottom &&
    elementUnderMirrorBottom.hasAttribute("data-block") &&
    !elementUnderMirrorBottom.hasAttribute("data-being-dragged");

  if (
    isElementUnderTopBlock &&
    isContainerDroppable &&
    floatingMirrorRect.top <
      elementUnderMirrorTop.getBoundingClientRect().top +
        elementUnderMirrorTop.offsetHeight / 2
  ) {
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
    floatingMirrorRect.bottom >
      elementUnderMirrorBottom.getBoundingClientRect().bottom -
        elementUnderMirrorBottom.offsetHeight / 2
  ) {
    //move up
    moveDivWithAnimation(
      elementUnderMirrorBottom.parentElement,
      elementUnderMirrorBottom,
      block,
      "test2"
    );
  }
};

document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  if (!e.target.closest("[data-container]")) return;
  if (dragActive) return;

  const container = e.target.closest("[data-container]");
  block = e.target.closest("[data-draggable='true']");
  if (container && block) {
    console.log("dragging start", e);
    console.log("adding enter/leave listeners");
    document
      .querySelectorAll('[data-droppable="true"]')
      .forEach((container) =>
        container.addEventListener("mouseenter", createTargetMirror)
      );

    document
      .querySelectorAll('[data-droppable="true"]')
      .forEach((container) =>
        container.addEventListener("mouseleave", removeTargetMirror)
      );

    //TODO remember originating container if needed
    section = e.target.closest("[data-droppable='false']");
    dragActive = true;

    var rect = block.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    if (!isFloatingMirrorCreated && !floatingMirror) {
      floatingMirror = block.cloneNode(true);
      isFloatingMirrorCreated = true;
    }

    block.style.opacity = 0.2;
    block.setAttribute("data-being-dragged", "");
    floatingMirror.classList.add("block-mirror");
    floatingMirror.style.position = "fixed";
    floatingMirror.style.pointerEvents = "none";
    // floatingMirror.style.border = "2px solid green";
    floatingMirror.style.top = "0";
    floatingMirror.style.left = "0";
    floatingMirror.style.height = block.offsetHeight;
    floatingMirror.style.width = block.offsetWidth;
    floatingMirror.style.transform = `translate3d(${
      e.clientX - x
    }px, ${e.clientY - y}px, 0px)`;
    prevX = null;
    prevY = null;

    document.onmousemove = trackMirrorMovement;

    container.append(floatingMirror);
  }
});

document.addEventListener("mouseup", (e) => {
  if (e.button !== 0) return;
  if (!dragActive) return;

  dragActive = false;
  block.style.opacity = "";

  if (targetMirror) {
    targetMirror.style.opacity = "";
    targetMirror.classList.remove("block-mirror");
    targetMirror.removeAttribute("data-being-dragged");
    targetMirror.setAttribute("data-block", "99");
  }

  if (e.target.closest("[data-container]")) {
    console.log("dragging stop", e);
  }
  console.log("removing enter/leave listeners");

  document
    .querySelectorAll('[data-droppable="true"]')
    .forEach((container) =>
      container.removeEventListener(
        "mouseenter",
        createTargetMirror
      )
    );

  document
    .querySelectorAll('[data-droppable="true"]')
    .forEach((container) =>
      container.removeEventListener(
        "mouseleave",
        removeTargetMirror
      )
    );

  document.onmousemove = null;
  if (floatingMirror) {
    floatingMirror.remove();
    floatingMirror = null;
  }

  targetMirror = null;
  isTargetMirrorCreated = false;
  isFloatingMirrorCreated = false;

  section = null;
});

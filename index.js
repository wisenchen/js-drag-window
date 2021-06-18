(() => {
  const positioningTemplate = `
  <span class="js-drag-window_positioning">
    <i class="left"></i>
    <i class="top"></i>
    <i class="right"></i>
    <i class="bottom"></i>
  </span>`;

  const getHeadTemplate = tempalte => {
    return `<div class="js-drag-window_head">${tempalte}</div>`;
  };

  class JSDragWindow {
    // 默认配置项
    options = {
      isDrag: true,
    };
    $el = null;

    rootDom = null;

    oldX = 0;

    oldY = 0;

    rightPos = 0;

    topPos = 0;

    leftPos = 0;

    bottomPos = 0;

    // 当前操作的dom
    operationDom = null;

    dragWindowDefaultStyle = {
      width: 600,
      height: 300,
      backgroundColor: "#fff",
      borderWidth: 2,
    };
    constructor(options) {
      this.options = Object.assign(this.options, options);
      const { contentTemplate, dragWindowStyle } = this.options;
      if (contentTemplate) {
        const dom = document.createElement("div");
        dom.innerHTML = contentTemplate;
        this.$el = dom;
      }
      this.initDom();
      this.rootDom = document.getElementById("js-drag-window");
      this.initRootDomStyle(dragWindowStyle);
      const operationDoms = Array.from(
        this.rootDom.getElementsByClassName("js-drag-window_operation")
      );
      this.initBindEvent(operationDoms);
    }

    initDom() {
      const temp = document.createElement("div");
      temp.innerHTML = `<div id="js-drag-window">
                          <div class="js-drag-window_operation js-drag-window_angle top-left" data-operationType="top-left"></div>
                          <div class="js-drag-window_operation js-drag-window_angle top-right" data-operationType="top-right"></div>
                          <div class="js-drag-window_operation js-drag-window_angle bottom-right" data-operationType="bottom-right"></div>
                          <div class="js-drag-window_operation js-drag-window_angle bottom-left" data-operationType="bottom-left"></div>
                          <div class="js-drag-window_operation js-drag-window_border top" data-operationType="top"></div>
                          <div class="js-drag-window_operation js-drag-window_border right" data-operationType="right"></div>
                          <div class="js-drag-window_operation js-drag-window_border bottom" data-operationType="bottom"></div>
                          <div class="js-drag-window_operation js-drag-window_border left" data-operationType="left"></div>
                          ${
                            this.options.headTemplate
                              ? getHeadTemplate(this.options.headTemplate)
                              : ""
                          }
                          <div class="js-drag-window_main">${
                            this.$el.outerHTML
                          }</div>
                          ${this.options.isDrag ? positioningTemplate : ""}
                        </div>`;
      document.body.appendChild(temp);
    }

    initRootDomStyle(dragWindowStyle) {
      dragWindowStyle = Object.assign(this.dragWindowDefaultStyle, dragWindowStyle);
      this.rootDom.style.cssText = `
                    height:${dragWindowStyle.height}px; 
                    width:${dragWindowStyle.width}px; 
                    left:${dragWindowStyle.left}px; 
                    top:${dragWindowStyle.top}px;
                    right:${dragWindowStyle.right}px; 
                    bottom:${dragWindowStyle.bottom}px;
                    background-color:${dragWindowStyle.backgroundColor};
                    --borderWidth:${dragWindowStyle.borderWidth};
                    `;
    }

    initBindEvent(operationDoms) {
      operationDoms.forEach(item =>
        item.addEventListener("mousedown", e => {
          this.handleMouseDown(e);
        })
      );
      const positioningDom = this.rootDom.getElementsByClassName(
        "js-drag-window_positioning"
      )[0];
      const headDom = this.rootDom.getElementsByClassName(
        "js-drag-window_head"
      )[0];

      if (positioningDom) {
        this.handleDrag(positioningDom);
      }
      if (headDom) {
        this.handleDrag(headDom);
      }
    }
    handleDrag(el) {
      el.addEventListener("mousedown", e => {
        const oldX = e.x;
        const oldY = e.y;
        const offsetLeft = this.rootDom.offsetLeft;
        const offsetTop = this.rootDom.offsetTop;
        const maxL = window.innerWidth - this.rootDom.clientWidth - 5;
        const maxT = window.innerHeight - this.rootDom.clientHeight- 5;
        const handleDragRoot = e => {
          // 移动是如果有文字会选中文字，这里加个阻止默认行为
          e.preventDefault();
          let left = offsetLeft - (oldX - e.x);
          left = Math.max(left, 5);
          left = Math.min(left, maxL);
          let top = offsetTop - (oldY - e.y);
          top = Math.max(top, 5);
          top = Math.min(top, maxT);
          this.rootDom.style.bottom = "unset";
          this.rootDom.style.right = "unset";
          this.rootDom.style.left = left + "px";
          this.rootDom.style.top = top + "px";
        };
        document.addEventListener("mousemove", handleDragRoot);
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", handleDragRoot);
        });
      });
    }

    handleMouseDown = e => {
      e.stopPropagation();
      this.oldWidth = this.rootDom.clientWidth;
      this.oldHeight = this.rootDom.clientHeight;
      this.operationDom = e.target || e.srcElement;
      this.oldX = e.x;
      this.oldY = e.y;
      this.rightPos =
        window.innerWidth - (this.rootDom.offsetLeft + this.oldWidth);
      this.topPos = this.rootDom.offsetTop;
      this.leftPos = this.rootDom.offsetLeft;
      this.bottomPos =
        window.innerHeight - (this.rootDom.offsetTop + this.oldHeight);

      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", this.handleMouseMove);
      });
    };

    handleMouseMove = e => {
      e.preventDefault();
      switch (this.operationDom.dataset.operationtype) {
        case "top-left":
          this.rootDom.style.width = this.oldWidth - (e.x - this.oldX) + "px";
          this.rootDom.style.height = this.oldHeight - (e.y - this.oldY) + "px";
          this.rootDom.style.left = "unset";
          this.rootDom.style.top = "unset";
          this.rootDom.style.bottom = this.bottomPos + "px";
          this.rootDom.style.right = this.rightPos + "px";
          break;
        case "top-right":
          this.rootDom.style.width = this.oldWidth + (e.x - this.oldX) + "px";
          this.rootDom.style.height = this.oldHeight - (e.y - this.oldY) + "px";
          this.rootDom.style.top = "unset";
          this.rootDom.style.right = "unset";
          this.rootDom.style.left = this.leftPos + "px";
          this.rootDom.style.bottom = this.bottomPos + "px";
          break;
        case "bottom-right":
          this.rootDom.style.width = this.oldWidth + (e.x - this.oldX) + "px";
          this.rootDom.style.height = this.oldHeight + (e.y - this.oldY) + "px";
          this.rootDom.style.right = "unset";
          this.rootDom.style.bottom = "unset";
          this.rootDom.style.left = this.leftPos + "px";
          this.rootDom.style.top = this.topPos + "px";
          break;
        case "bottom-left":
          this.rootDom.style.width = this.oldWidth - (e.x - this.oldX) + "px";
          this.rootDom.style.height = this.oldHeight + (e.y - this.oldY) + "px";
          this.rootDom.style.left = "unset";
          this.rootDom.style.bottom = "unset";
          this.rootDom.style.top = this.topPos + "px";
          this.rootDom.style.right = this.rightPos + "px";
          break;
        case "top":
          this.rootDom.style.height = this.oldHeight - (e.y - this.oldY) + "px";
          this.rootDom.style.top = "unset";
          this.rootDom.style.bottom = this.bottomPos + "px";
          break;
        case "right":
          this.rootDom.style.width = this.oldWidth + (e.x - this.oldX) + "px";
          this.rootDom.style.right = "unset";
          this.rootDom.style.left = this.leftPos + "px";
          break;
        case "bottom":
          this.rootDom.style.height = this.oldHeight + (e.y - this.oldY) + "px";
          this.rootDom.style.bottom = "unset";
          this.rootDom.style.top = this.topPos + "px";
          break;
        case "left":
          this.rootDom.style.width = this.oldWidth - (e.x - this.oldX) + "px";
          this.rootDom.style.left = "unset";
          this.rootDom.style.right = this.rightPos + "px";
          break;
      }
    };

    hide() {
      this.rootDom.style.display = "none";
    }

    show() {
      this.rootDom.style.display = "block";
    }
  }
  window.JSDragWindow = JSDragWindow;
})();

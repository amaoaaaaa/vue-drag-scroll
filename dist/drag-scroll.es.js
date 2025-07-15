const l = /* @__PURE__ */ new WeakMap(), p = {
  mounted(o, n) {
    const e = {
      isDragging: !1,
      startX: 0,
      startY: 0,
      startPageX: 0,
      startPageY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      target: null,
      moved: !1,
      velocityX: 0,
      velocityY: 0,
      lastTime: 0,
      lastX: 0,
      lastY: 0,
      inertiaFrame: null,
      onMouseMove: () => {
      },
      onMouseUp: () => {
      },
      onMouseDown: () => {
      }
    }, u = () => {
      const t = n.value;
      return typeof t == "string" ? o.querySelector(t) : o;
    }, i = () => {
      e.inertiaFrame != null && (cancelAnimationFrame(e.inertiaFrame), e.inertiaFrame = null);
    }, m = () => {
      i();
      const t = 0.95, s = 0.5, r = () => {
        if (e.target) {
          if (e.velocityX *= t, e.velocityY *= t, Math.abs(e.velocityX) < s && Math.abs(e.velocityY) < s) {
            i();
            return;
          }
          e.target.scrollLeft -= e.velocityX, e.target.scrollTop -= e.velocityY, e.inertiaFrame = requestAnimationFrame(r);
        }
      };
      e.inertiaFrame = requestAnimationFrame(r);
    }, d = () => {
      e.isDragging = !1, document.removeEventListener("mousemove", e.onMouseMove), document.removeEventListener("mouseup", e.onMouseUp);
    };
    e.onMouseDown = (t) => {
      e.target = u(), e.target && (i(), e.isDragging = !0, e.moved = !1, e.startX = t.clientX, e.startY = t.clientY, e.startPageX = t.pageX, e.startPageY = t.pageY, e.scrollLeft = e.target.scrollLeft, e.scrollTop = e.target.scrollTop, e.lastTime = performance.now(), e.lastX = t.clientX, e.lastY = t.clientY, document.addEventListener("mousemove", e.onMouseMove), document.addEventListener("mouseup", e.onMouseUp));
    }, e.onMouseMove = (t) => {
      if (!e.isDragging || !e.target) return;
      if (t.pageX === e.startPageX && t.pageY === e.startPageY) {
        t.preventDefault();
        return;
      }
      const s = performance.now(), r = t.clientX - e.startX, a = t.clientY - e.startY;
      (Math.abs(r) > 3 || Math.abs(a) > 3) && (e.moved = !0);
      const g = t.clientX - e.lastX, v = t.clientY - e.lastY, c = s - e.lastTime || 16;
      e.velocityX = g / c * 16, e.velocityY = v / c * 16, e.lastX = t.clientX, e.lastY = t.clientY, e.lastTime = s, e.target.scrollLeft = e.scrollLeft - r, e.target.scrollTop = e.scrollTop - a;
    }, e.onMouseUp = () => {
      if (e.isDragging && e.moved) {
        const t = (a) => {
          a.stopImmediatePropagation(), a.preventDefault(), document.removeEventListener("click", t, !0);
        };
        document.addEventListener("click", t, !0), Math.sqrt(e.velocityX ** 2 + e.velocityY ** 2) > 1.5 && m();
      }
      d();
    }, o.addEventListener("mousedown", e.onMouseDown), l.set(o, e);
  },
  unmounted(o) {
    const n = l.get(o);
    n && (o.removeEventListener("mousedown", n.onMouseDown), document.removeEventListener("mousemove", n.onMouseMove), document.removeEventListener("mouseup", n.onMouseUp), n.inertiaFrame !== null && cancelAnimationFrame(n.inertiaFrame), l.delete(o));
  }
}, f = {
  install(o) {
    o.directive("drag-scroll", p);
  }
};
export {
  f as default,
  p as dragScroll
};

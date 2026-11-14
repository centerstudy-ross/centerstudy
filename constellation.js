/* centerstudy constellation: points breathe outward and gather again on the
   same 20-second cycle as the letters of the mark, and the lines follow them. */
(function () {
  var orbit = document.querySelector('.orbit');
  if (!orbit) return;
  var svg = orbit.querySelector('.orbit-lines');
  var nodes = {}, seed = 11;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  orbit.querySelectorAll('.node').forEach(function (el) {
    nodes[el.dataset.k] = { el: el, x: +el.dataset.x / 100, y: +el.dataset.y / 100,
      d: 12 + rnd() * 16, side: (rnd() - .5) * 14, delay: rnd() * 1.6, ph: rnd() * 6.28 };
  });
  var lines = Array.prototype.slice.call(svg.querySelectorAll('line'));
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ease(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function out(p) { // matches the letters: rest, drift out, hold, return, rest
    if (p < .06) return 0;
    if (p < .40) return ease((p - .06) / .34);
    if (p < .55) return 1;
    if (p < .90) return 1 - ease((p - .55) / .35);
    return 0;
  }
  var start = performance.now();
  function frame(now) {
    var W = orbit.clientWidth, H = orbit.clientHeight, cx = W / 2, cy = H / 2, s = (now - start) / 1000, pos = { 'center-mark': [cx, cy] };
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    for (var k in nodes) {
      var n = nodes[k], bx = n.x * W, by = n.y * H, vx = bx - cx, vy = by - cy, L = Math.hypot(vx, vy) || 1;
      var f = still ? 0 : out((((s - n.delay) % 20) + 20) % 20 / 20);
      var wob = still ? 0 : Math.sin(s * 0.6 + n.ph) * 2.5;
      var dx = (vx / L) * (n.d * f + wob) + (-vy / L) * n.side * f;
      var dy = (vy / L) * (n.d * f + wob) + (vx / L) * n.side * f;
      n.el.style.transform = 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px)';
      pos[k] = [bx + dx, by + dy];
    }
    lines.forEach(function (ln) {
      var a = pos[ln.dataset.a], b = pos[ln.dataset.b];
      if (!a || !b) return;
      ln.setAttribute('x1', a[0]); ln.setAttribute('y1', a[1]); ln.setAttribute('x2', b[0]); ln.setAttribute('y2', b[1]);
    });
    if (!still) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if (still) window.addEventListener('resize', function () { requestAnimationFrame(frame); });
})();

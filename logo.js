(function () {
  var pal = ['#b9a6ff', '#8f9bff', '#c7b4ff', '#a6e4ff', '#e7c6ff', '#7f7cf0', '#d9cfff'];
  var n = 0;
  var stops = [[0, '#e9d8ff'], [.3, '#9fb0ff'], [.55, '#bff0ff'], [.75, '#b48cff'], [1, '#f2d6ff']];
  function hex(c) { return [1, 3, 5].map(function (i) { return parseInt(c.slice(i, i + 2), 16); }); }
  function col(t) {
    for (var i = 1; i < stops.length; i++) if (t <= stops[i][0]) {
      var a = stops[i - 1][0], b = stops[i][0], k = (t - a) / (b - a), A = hex(stops[i - 1][1]), B = hex(stops[i][1]);
      return 'rgb(' + A.map(function (v, j) { return Math.round(v + (B[j] - v) * k); }).join(',') + ')';
    }
    return stops[4][1];
  }
  function letters() {
    var str = 'CENTER · STUDY · CENTER · STUDY · ', N = str.length, s = 31, out = '<g>';
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i = 0; i < N; i++) {
      var deg = -90 + (i + .5) * 360 / N, rad = deg * Math.PI / 180;
      var x = Math.cos(rad) * 136, y = Math.sin(rad) * 136;
      var d = 22 + rnd() * 70, dx = (rnd() - .5) * 30, r = (rnd() - .5) * 70, delay = (rnd() * 1.6).toFixed(2);
      var t = Math.min(1, Math.max(0, (x + y + 192) / 384));
      out += '<g transform="rotate(' + (deg + 90) + ')"><text class="cs-letter" y="-136" text-anchor="middle" fill="' + col(t) + '" style="font-family:\'Share Tech Mono\',monospace;font-size:30px;animation-delay:' + delay + 's;--dx:' + dx.toFixed(1) + 'px;--dy:' + (-d).toFixed(1) + 'px;--r:' + r.toFixed(0) + 'deg">' + str[i] + '</text></g>';
    }
    return out + '</g>';
  }
  function mark(el) {
    var size = el.dataset.size ? +el.dataset.size : Math.min(380, window.innerWidth - 48);
    var disc = el.dataset.disc === '1';
    var uid = 'm' + (n++);
    var s = 7;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    var rays = '';
    for (var i = 0; i < 56; i++) {
      var rot = (i * 360 / 56 + (rnd() - .5) * 4).toFixed(1), len = Math.round(50 + rnd() * 95), w = rnd() > .75 ? 2 : 1, c = pal[Math.floor(rnd() * pal.length)];
      rays += '<div style="position:absolute;left:50%;bottom:50%;width:' + w + 'px;height:' + len + 'px;background:linear-gradient(to top,' + c + ',rgba(23,20,43,0));transform-origin:bottom center;transform:rotate(' + rot + 'deg)"></div>';
    }
    var g = 'g' + uid, h = 'h' + uid, p = 'p' + uid;
    var svg = '<svg width="380" height="380" viewBox="-160 -160 320 320" style="position:absolute;inset:0;overflow:visible;filter:drop-shadow(0 0 7px rgba(160,140,255,.7)) drop-shadow(0 0 26px rgba(120,130,255,.3))">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9d8ff"/><stop offset=".3" stop-color="#9fb0ff"/><stop offset=".55" stop-color="#bff0ff"/><stop offset=".75" stop-color="#b48cff"/><stop offset="1" stop-color="#f2d6ff"/></linearGradient>' +
      '<radialGradient id="' + h + '"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#d8c8ff"/><stop offset="1" stop-color="#7a7fee" stop-opacity="0"/></radialGradient>' +
      '<path id="' + p + '" d="M -136,0 a 136,136 0 1,1 272,0 a 136,136 0 1,1 -272,0"/></defs>' +
      '<circle r="104" fill="none" stroke="url(#' + g + ')" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 13"/>' +
      '<circle r="66" fill="none" stroke="#e6ff2e" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="0 13" style="filter:drop-shadow(0 0 4px rgba(230,255,46,.8))"/>' +
      letters() +
      '<circle r="28" fill="url(#' + h + ')"/></svg>';
    el.style.cssText += ';width:' + size + 'px;height:' + size + 'px;position:relative;flex:none;' + (disc ? 'border-radius:50%;background:#17142b;overflow:hidden;' : '');
    el.innerHTML = '<div style="position:absolute;left:0;top:0;width:380px;height:380px;transform:scale(' + (size / 380) + ');transform-origin:0 0">' +
      '<div class="cs-spin" style="position:absolute;inset:0">' +
      '<div style="position:absolute;inset:0;opacity:.55;filter:drop-shadow(0 0 5px rgba(160,140,255,.6))"><div style="position:absolute;left:50%;top:50%;width:0;height:0"><div style="position:absolute;width:320px;height:320px;left:-160px;top:-160px;transform:scale(1.19)">' + rays + '</div></div></div>' +
      svg + '</div></div>';
  }
  document.querySelectorAll('[data-mark]').forEach(mark);
})();

/* =====================================================================
   NAGORI — interface behaviour
   Motion is authored once (hero) and answered on demand (reveals, form).
   Everything degrades: no JS = full content, no WebGL = flat photograph.
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- header + spine progress ---------------- */
  var head = document.querySelector('[data-head]');
  var spineFill = document.querySelector('.spine__fill');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(y / max, 1) : 0;

    head.classList.toggle('is-stuck', y > 60);
    if (spineFill) spineFill.style.setProperty('--p', p.toFixed(4));
    parallax();
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }

  /* ---------------- parallax ----------------
     Two layers, both tiny: the hero photograph drifts against the page, and three
     section images breathe inside their frames. Rides the `translate` property so it
     never fights the reveal's `scale`. Off below 768px (touch scroll) and off entirely
     under reduced motion. */
  var layers = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var parallaxOn = !reduced && window.innerWidth >= 768;

  function parallax() {
    if (!parallaxOn) return;
    var vh = window.innerHeight;
    for (var i = 0; i < layers.length; i++) {
      var el = layers[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -240 || r.top > vh + 240) continue;
      var amp = parseFloat(el.getAttribute('data-parallax')) || 24;
      var mid = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      el.style.setProperty('--py', (-mid * amp).toFixed(1) + 'px');
    }
  }

  window.addEventListener('resize', function () {
    var was = parallaxOn;
    parallaxOn = !reduced && window.innerWidth >= 768;
    if (was && !parallaxOn) {
      layers.forEach(function (el) { el.style.removeProperty('--py'); });
    }
  });
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);
  onScroll();

  /* ---------------- spine running head + current nav ---------------- */
  var spineLabel = document.querySelector('[data-spine-label]');
  var marked = document.querySelectorAll('[data-section]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  if (marked.length && 'IntersectionObserver' in window) {
    var centre = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;

        var label = e.target.getAttribute('data-section');
        if (spineLabel && label && spineLabel.textContent !== label) {
          spineLabel.parentNode.style.opacity = '0';
          window.setTimeout(function () {
            spineLabel.textContent = label;
            spineLabel.parentNode.style.opacity = '1';
          }, 220);
        }

        var id = e.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', !!id && a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-46% 0px -46% 0px' });

    Array.prototype.forEach.call(marked, function (s) { centre.observe(s); });
  }

  /* ---------------- mobile drawer ---------------- */
  var burger = document.querySelector('[data-burger]');
  var drawer = document.querySelector('[data-drawer]');

  if (burger && drawer) {
    Array.prototype.forEach.call(drawer.querySelectorAll('.drawer__nav a'), function (a, i) {
      a.style.setProperty('--i', i);
    });

    var setDrawer = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.querySelector('.u-sr').textContent = open ? 'Fechar menu' : 'Abrir menu';
      document.body.classList.toggle('is-locked', open);
      if (open) {
        drawer.hidden = false;
        window.requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      } else {
        drawer.classList.remove('is-open');
        window.setTimeout(function () { drawer.hidden = true; }, reduced ? 0 : 500);
      }
    };

    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setDrawer(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && burger.getAttribute('aria-expanded') === 'true') setDrawer(false);
    });
  }

  /* ---------------- scroll reveals ---------------- */
  var revealables = document.querySelectorAll('[data-reveal], [data-reveal-img], [data-stamp]');

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      /* stagger by reading order within this batch, so a section arrives
         as one orchestrated move rather than as N identical entrances */
      var landing = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

      landing.forEach(function (e, i) {
        e.target.style.setProperty('--d', Math.min(i, 5) * 75 + 'ms');
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ---------------- hero haze (WebGL, optional) ---------------- */
  (function haze() {
    var canvas = document.querySelector('[data-haze]');
    if (!canvas) return;

    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false })
          || canvas.getContext('experimental-webgl');
    if (!gl) { canvas.remove(); return; }

    var VERT =
      'attribute vec2 p; varying vec2 v;' +
      'void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }';

    var FRAG =
      'precision mediump float;' +
      'varying vec2 v; uniform float t; uniform vec2 r;' +
      'float h(vec2 x){ return fract(sin(dot(x, vec2(127.1, 311.7))) * 43758.5453); }' +
      'float n(vec2 x){' +
      '  vec2 i = floor(x), f = fract(x);' +
      '  vec2 u = f * f * (3.0 - 2.0 * f);' +
      '  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), u.x),' +
      '             mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), u.x), u.y);' +
      '}' +
      'float fbm(vec2 x){' +
      '  float s = 0.0, a = 0.5;' +
      '  for (int k = 0; k < 5; k++) { s += a * n(x); x *= 2.02; a *= 0.5; }' +
      '  return s;' +
      '}' +
      'void main(){' +
      '  vec2 uv = v * vec2(r.x / max(r.y, 1.0), 1.0);' +
      '  float a = fbm(uv * 2.1 + vec2(t * 0.017, t * 0.011));' +
      '  float b = fbm(uv * 4.3 - vec2(t * 0.013, t * 0.021));' +
      '  float haze = smoothstep(0.30, 0.96, a * 0.66 + b * 0.44);' +
      '  float g = h(gl_FragCoord.xy + t) * 0.020;' +
      '  vec3 col = vec3(0.082, 0.072, 0.060) * haze + g;' +
      '  gl_FragColor = vec4(col, 1.0);' +
      '}';

    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }

    var vs = shader(gl.VERTEX_SHADER, VERT);
    var fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.remove(); return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uT = gl.getUniformLocation(prog, 't');
    var uR = gl.getUniformLocation(prog, 'r');

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(canvas.clientWidth, 1) * dpr;
      var h = Math.max(canvas.clientHeight, 1) * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uR, canvas.width, canvas.height);
    }

    function draw(t) {
      size();
      gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    window.addEventListener('resize', function () { if (reduced) draw(0); });

    if (reduced) { draw(0); return; }

    /* run only while the hero is on screen */
    var visible = true;
    var hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; })
        .observe(hero);
    }

    var start = performance.now();
    (function loop(now) {
      if (visible) draw((now - start) / 1000);
      window.requestAnimationFrame(loop);
    })(start);
  })();

  /* ---------------- reservation form ---------------- */
  var form = document.querySelector('[data-form]');
  var done = document.querySelector('[data-done]');

  if (form && done) {
    var summary = done.querySelector('[data-done-summary]');
    var reset = done.querySelector('[data-reset]');

    var showError = function (name, on) {
      var msg = form.querySelector('[data-err-for="' + name + '"]');
      var field = form.querySelector('#' + name).closest('.field');
      if (msg) msg.hidden = !on;
      if (field) field.classList.toggle('is-invalid', on);
      form.querySelector('#' + name).setAttribute('aria-invalid', String(on));
    };

    var today = function () {
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    };

    form.querySelector('#data').min = today().toISOString().slice(0, 10);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = form.querySelector('#data');
      var hora = form.querySelector('#hora');
      var pessoas = form.querySelector('#pessoas');
      var bad = null;

      var dateOk = !!data.value && new Date(data.value + 'T00:00:00') >= today();
      showError('data', !dateOk);
      if (!dateOk) bad = bad || data;

      showError('hora', !hora.value);
      if (!hora.value) bad = bad || hora;

      showError('pessoas', !pessoas.value);
      if (!pessoas.value) bad = bad || pessoas;

      if (bad) { bad.focus(); return; }

      var pretty = new Date(data.value + 'T00:00:00')
        .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

      summary.textContent = pessoas.value.toLowerCase() + ', ' + pretty + ', às ' + hora.value + '.';
      form.hidden = true;
      done.hidden = false;
      done.classList.add('is-in');
      done.querySelector('h3').setAttribute('tabindex', '-1');
      done.querySelector('h3').focus();
    });

    reset.addEventListener('click', function () {
      form.reset();
      ['data', 'hora', 'pessoas'].forEach(function (n) { showError(n, false); });
      done.hidden = true;
      done.classList.remove('is-in');
      form.hidden = false;
      form.querySelector('#data').focus();
    });
  }
})();

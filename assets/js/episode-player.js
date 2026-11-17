// Tidsstempler på episodesidene: <button class="ep-time" data-t="sekunder"> spoler
// Spotify-spilleren øverst på siden dit, via Spotifys iFrame-API.
// Uten JS, eller om API-et ikke laster, står den vanlige iframe-spilleren urørt.
(function () {
  var frame = document.querySelector('iframe.ep-player[data-uri]');
  var buttons = document.querySelectorAll('.ep-time[data-t]');
  if (!frame || !buttons.length) return;

  var ctl = null, started = false, pending = null;

  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    var slot = document.createElement('div');
    frame.replaceWith(slot);
    IFrameAPI.createController(slot, { uri: frame.dataset.uri, width: '100%', height: 352 }, function (c) {
      ctl = c;
      ctl.addListener('playback_update', function (e) {
        if (e.data.isPaused || e.data.isBuffering) return;
        started = true;
        if (pending !== null) { var t = pending; pending = null; ctl.seek(t); }
      });
    });
  };

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (!ctl) return;
      var t = Number(b.dataset.t);
      if (started) { ctl.seek(t); ctl.resume(); }
      else { pending = t; ctl.play(); }
      var hero = document.querySelector('.ep-hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  var s = document.createElement('script');
  s.src = 'https://open.spotify.com/embed/iframe-api/v1';
  s.async = true;
  document.head.appendChild(s);
})();

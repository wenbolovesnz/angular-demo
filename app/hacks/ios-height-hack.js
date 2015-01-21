(function(){
  var fixViewportHeight = (function(){
    function debounced(){
      document.documentElement.style.height = window.innerHeight + "px";
      if (document.body.scrollTop !== 0) {
          window.scrollTo(0, 0);
      }
    }
    var cancelable = null;

    return function(){
      cancelable && clearTimeout(cancelable);
      cancelable = setTimeout(debounced, 250);
    };
  })();
  // First check to see if the platform is an iPod
  if(/iPad/.test(navigator.platform) && /Safari/i.test(navigator.userAgent)){  
    window.addEventListener("resize", fixViewportHeight, false);
    window.addEventListener("scroll", fixViewportHeight, false);
    window.addEventListener("orientationchange", fixViewportHeight, false);
    fixViewportHeight();
  }
})();

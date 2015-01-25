
/**
 * currently depends on joeles/tpyo.js and joeles/xhr. i'll bower it up later.
 */

document.addEventListener('DOMContentLoaded', function() {

  var gist = (location.search)
           ? location.search.substr(1)
           : location.pathname.substr(1),
      content;

  function error() {

    var text = 'Help me, help you! You need to provide a GitHub gist in the url.\n\n'
             + 'Like this: http://lmctfy.co/5b3f432f16ba17e8d70e\n\n';
    tpyo.type("#tpyo", text);
  }

  if (gist) {

    ajx.get('https://api.github.com/gists/' + gist, {}, {

      success: function(data, status) {

        document.querySelector('#gist a').href = 'https://gist.github.com/' + gist;

        // start with supporting only a single file per gist
        for (file in data.files) {
          content = data.files[file].content;
          break;
        }

        tpyo.type('#tpyo', content);
      },

      error: error
    })

  } else {
    error();
  }

});

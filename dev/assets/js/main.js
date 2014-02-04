/* ==========================================================================
    Main scripts
   ========================================================================== */


/*  Async Loading third-party scripts
   ========================================================================== */

(function(doc, script) {
    var js,
        fjs = doc.getElementsByTagName(script)[0],
        frag = doc.createDocumentFragment(),
        add = function(url, id) {
            if (doc.getElementById(id)) {return;}
            js = doc.createElement(script);
            js.src = url;
            id && (js.id = id);
            frag.appendChild( js );
        };

    // Facebook SDK
    add('//connect.facebook.net/pt_BR/all.js#xfbml=1&status=0', 'facebook-jssdk');

    // Twitter SDK
    add('//platform.twitter.com/widgets.js');

    fjs.parentNode.insertBefore(frag, fjs);
}(document, 'script'));

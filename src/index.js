var Remarkable = require('remarkable');

function encodeHtml(content) {
  return content.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function heading(md) {
  md.renderer.rules.heading_open = function(tokens, idx, options, env) {
    const level = tokens[idx].hLevel;
    return '<h' + level + ' class="font-weight-light mb-3">'
  };
  md.renderer.rules.heading_close = function(tokens, idx, options, env) {
    const level = tokens[idx].hLevel;
    return '</h' + level + '>';
  }
}

function fence(md) {
  md.renderer.rules.fence = function(tokens, idx, options, env) {
    const content = tokens[idx].content;
    return (
      '<pre class="bg-light text-dark p-2 pre-scrollable"><code>' +
        encodeHtml(content) +
      '</code></pre>'
    )
  }
}

function blockquote(md) {
  md.renderer.rules.blockquote_open = function(tokens, idx, options, env) {
    return '<blockquote class="bd-callout">';
  }
  md.renderer.rules.blockquote_close = function(tokens, idx, options, env) {
    return '</blockquote>';
  }
}

function table(md) {
  md.renderer.rules.th_open = function(tokens, idx, options, env) {
    return '<th class="border p-2">'
  };
  md.renderer.rules.th_close = function(tokens, idx, options, env) {
    return '</th>';
  }
  md.renderer.rules.td_open = function(tokens, idx, options, env) {
    return '<td class="border p-2">'
  };
  md.renderer.rules.td_close = function(tokens, idx, options, env) {
    return '</td>';
  }
}

var defaultOptions = {
  html: true
}

module.exports = function(options) {
  var md = new Remarkable('full', Object.assign({}, defaultOptions, options));
  md.use(heading);
  md.use(fence);
  md.use(blockquote);
  md.use(table);

  md.fetch = function(uri) {
    return fetch(uri)
      .then(response => response.text())
      .then(text => md.beforeRender? md.beforeRender(text) : text)
      .then(text => md.render(text));
  }

  return md;
}

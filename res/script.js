let Engine = {
  init() {
    let 
      content = document.body.querySelector('.j-content'),
      apps    = document.body.querySelectorAll('.app');

    [...apps].forEach(el=>{
      let app, data;
      data = el.dataset;
      
      if (!data.img && data.url) {
        if (!~data.url.indexOf('http'))
          data.img = data.url+'/icon.png';
      }

      app = newEl('a', {
        href: data.url || '#',
        tabindex: '0',
        class: 'b-app',
        $children: [
          'img', {
            class: 'e-app-pic',
            src: data.img || 'res/default.png',
            alt: ''
          },
          'div', {
            class: 'e-app-content',
            $children: [
              'div', {
                class: 'e-app-title',
                $content: data.title
              },
              'div', {
                class: 'e-app-description',
                $content: data.description ? data.description.replace(/\\n/g, '<br>') : ''
              }
            ]
          }
        ]
      });

      if (data.separator) {
        app = newEl('div', {
          class: 'e-app-divider'
        })
      }

      el.remove();
      content.appendChild(app);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => Engine.init());

/* --------------------------- */

function newEl(tag, attrs) {
  /* newEl v1.1 */
  var node = document.createElement(tag);
  var rootEl = arguments[2] || node;
  if (!attrs) return node;

  Object.getOwnPropertyNames(attrs).forEach(function(param,i) {
    var value = Object.getOwnPropertyDescriptor(attrs, param) ?
    Object.getOwnPropertyDescriptor(attrs, param).value :
    false;
    if (param[0] == '$') {
      switch (param.slice(1)) {
        case 'content':
        node.innerHTML = value;
        break;

        case 'children':
        for (i=0; i<value.length; i=i+2) {
          var el = newEl(value[i], value[i+1], rootEl);
          if (value[i+1].$id) {
            rootEl[value[i+1].$id] = el;
          }
          node.appendChild(el);
        }
        break;

        default:
        break;
      }
    } else if (param[0] == '_') {
      node[param.slice(1)] = value;
    } else {
      node.setAttribute(param.replace(/([A-Z])/g,'-$1').toLowerCase(), value);
    }
  });

  return node;
}
'use strict';Object.defineProperty(exports,'__esModule',{value:true});var tinymce=require('tinymce/tinymce');require('tinymce/themes/mobile'),require('tinymce/themes/silver'),require('tinymce/plugins/advlist'),require('tinymce/plugins/autolink'),require('tinymce/plugins/autoresize'),require('tinymce/plugins/autosave'),require('tinymce/plugins/bbcode'),require('tinymce/plugins/charmap'),require('tinymce/plugins/code'),require('tinymce/plugins/codesample'),require('tinymce/plugins/directionality'),require('tinymce/plugins/emoticons'),require('tinymce/plugins/emoticons/js/emojis'),require('tinymce/plugins/fullpage'),require('tinymce/plugins/fullscreen'),require('tinymce/plugins/help'),require('tinymce/plugins/hr'),require('tinymce/plugins/image'),require('tinymce/plugins/imagetools'),require('tinymce/plugins/importcss'),require('tinymce/plugins/insertdatetime'),require('tinymce/plugins/legacyoutput'),require('tinymce/plugins/link'),require('tinymce/plugins/lists'),require('tinymce/plugins/media'),require('tinymce/plugins/nonbreaking'),require('tinymce/plugins/noneditable'),require('tinymce/plugins/pagebreak'),require('tinymce/plugins/paste'),require('tinymce/plugins/preview'),require('tinymce/plugins/print'),require('tinymce/plugins/quickbars'),require('tinymce/plugins/save'),require('tinymce/plugins/searchreplace'),require('tinymce/plugins/spellchecker'),require('tinymce/plugins/tabfocus'),require('tinymce/plugins/table'),require('tinymce/plugins/template'),require('tinymce/plugins/textpattern'),require('tinymce/plugins/toc'),require('tinymce/plugins/visualblocks'),require('tinymce/plugins/visualchars'),require('tinymce/plugins/wordcount'),require('tinymce/skins/content/default/content.min.css'),require('tinymce/skins/ui/oxide/skin.min.css'),require('tinymce/icons/default');var vue=require('vue');function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}// Import TinyMCE
var script = {
  name: 'Vue2TinymceEditor',
  props: {
    id: {
      default: 'vue2-tinymce-editor-' + new Date().getTime(),
      type: String
    },
    modelValue: {
      default: ''
    },
    options: {
      default: function _default() {
        return {};
      },
      type: Object
    },
    height: {
      default: 300,
      type: Number
    },
    width: {
      default: 0,
      type: Number
    }
  },
  data: function data() {
    return {
      inputId: "editor-" + new Date().getTime(),
      content: '',
      editor: null,
      checkerTimeout: null,
      isTyping: false,
      plugins: 'advlist autolink charmap code codesample directionality emoticons ' + 'fullscreen help hr image imagetools insertdatetime link lists ' + 'media nonbreaking pagebreak paste preview print save searchreplace ' + 'table template textpattern toc visualblocks visualchars wordcount',
      toolbar: 'fontselect fontsizeselect formatselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link table removeformat code'
    };
  },
  mounted: function mounted() {
    this.content = this.modelValue;
    this.init();
  },
  beforeDestroy: function beforeDestroy() {
    var _this$editor, _this$editor$destroy;
    (_this$editor = this.editor) === null || _this$editor === void 0 || (_this$editor$destroy = _this$editor.destroy) === null || _this$editor$destroy === void 0 || _this$editor$destroy.call(_this$editor);
  },
  watch: {
    modelValue: function modelValue(newValue) {
      if (!this.isTyping) {
        if (this.editor !== null) this.editor.setContent(newValue);else this.content = newValue;
      }
    }
  },
  methods: {
    init: function init() {
      var options = {
        selector: '#' + this.inputId,
        skin: false,
        toolbar: this.toolbar,
        plugins: this.plugins,
        init_instance_callback: this.initEditor
      };
      // copy all options keys
      for (var key in this.options) {
        if (key === 'selector' || key === 'init_instance_callback') {
          continue;
        }
        options[key] = this.options[key];
      }
      tinymce.init(options);
    },
    initEditor: function initEditor(editor) {
      var _this = this;
      this.editor = editor;
      editor.on('KeyUp', function () {
        _this.submitContent();
      });
      editor.on('Change', function (e) {
        if (_this.editor.getContent() !== _this.modelValue) {
          _this.submitContent();
        }
        _this.$emit('editorChange', e);
      });
      editor.on('init', function () {
        editor.setContent(_this.content);
        _this.$emit('update:modelValue', _this.content);
      });
      this.$emit('editorInit', editor);
    },
    submitContent: function submitContent() {
      var _this2 = this;
      this.isTyping = true;
      if (this.checkerTimeout !== null) clearTimeout(this.checkerTimeout);
      this.checkerTimeout = setTimeout(function () {
        _this2.isTyping = false;
      }, 700);
      this.$emit('update:modelValue', this.editor.getContent());
    }
  }
};var _hoisted_1 = ["id"];
var _hoisted_2 = ["id"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    id: $props.id
  }, [vue.withDirectives(vue.createElementVNode("textarea", {
    id: $data.inputId,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
      return $data.content = $event;
    }),
    style: vue.normalizeStyle({
      'height': $props.height + 'px',
      'width': $props.width <= 0 ? 'auto' : $props.width + 'px'
    })
  }, null, 12, _hoisted_2), [[vue.vModelText, $data.content]])], 8, _hoisted_1);
}script.render = render;/* eslint-disable import/prefer-default-export */var components=/*#__PURE__*/Object.freeze({__proto__:null,Vue2TinymceEditor:script});// install function executed by Vue.use()
var install = function installVue2TinymceEditor(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      componentName = _ref2[0],
      component = _ref2[1];
    Vue.component(componentName, component);
  });
};

// Create module definition for Vue.use()
var plugin = {
  install: install
};

// To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
{
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
}exports.Vue2TinymceEditor=script;exports.default=plugin;
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/mobile';
import 'tinymce/themes/silver';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/fullpage';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/print';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/icons/default';
import { openBlock, createElementBlock, withDirectives, createElementVNode, normalizeStyle, vModelText } from 'vue';

// Import TinyMCE
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
      default: function () {
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
  data() {
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
  mounted() {
    this.content = this.modelValue;
    this.init();
  },
  beforeDestroy() {
    this.editor?.destroy?.();
  },
  watch: {
    modelValue: function (newValue) {
      if (!this.isTyping) {
        if (this.editor !== null) this.editor.setContent(newValue);else this.content = newValue;
      }
    }
  },
  methods: {
    init() {
      let options = {
        selector: '#' + this.inputId,
        skin: false,
        toolbar: this.toolbar,
        plugins: this.plugins,
        init_instance_callback: this.initEditor
      };
      // copy all options keys
      for (let key in this.options) {
        if (key === 'selector' || key === 'init_instance_callback') {
          continue;
        }
        options[key] = this.options[key];
      }
      tinymce.init(options);
    },
    initEditor(editor) {
      this.editor = editor;
      editor.on('KeyUp', () => {
        this.submitContent();
      });
      editor.on('Change', e => {
        if (this.editor.getContent() !== this.modelValue) {
          this.submitContent();
        }
        this.$emit('editorChange', e);
      });
      editor.on('init', () => {
        editor.setContent(this.content);
        this.$emit('update:modelValue', this.content);
      });
      this.$emit('editorInit', editor);
    },
    submitContent() {
      this.isTyping = true;
      if (this.checkerTimeout !== null) clearTimeout(this.checkerTimeout);
      this.checkerTimeout = setTimeout(() => {
        this.isTyping = false;
      }, 700);
      this.$emit('update:modelValue', this.editor.getContent());
    }
  }
};

const _hoisted_1 = ["id"];
const _hoisted_2 = ["id"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    id: $props.id
  }, [withDirectives(createElementVNode("textarea", {
    id: $data.inputId,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $data.content = $event),
    style: normalizeStyle({
      'height': $props.height + 'px',
      'width': $props.width <= 0 ? 'auto' : $props.width + 'px'
    })
  }, null, 12, _hoisted_2), [[vModelText, $data.content]])], 8, _hoisted_1);
}

script.render = render;

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Vue2TinymceEditor: script
});

// Import vue components

// install function executed by Vue.use()
const install = function installVue2TinymceEditor(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

// Create module definition for Vue.use()
const plugin = {
  install
};

export { script as Vue2TinymceEditor, plugin as default };

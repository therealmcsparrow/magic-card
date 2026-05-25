import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// Static CodeMirror imports - bundled into main file
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { yaml as yamlLang } from '@codemirror/lang-yaml';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { searchKeymap } from '@codemirror/search';
import { autocompletion } from '@codemirror/autocomplete';

// CodeMirror integration - uses light DOM to avoid measurement issues
@customElement('mc-yaml-codemirror')
export class YamlCodeMirror extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: Boolean }) readonly = false;

  @query('.cm-host') private _host?: HTMLDivElement;

  private _view?: EditorView;
  private _initialized = false;

  // Use light DOM for CodeMirror
  createRenderRoot() {
    return this;
  }

  protected render(): TemplateResult {
    return html`<div class="cm-host" style="border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;overflow:hidden;min-height:200px"></div>`;
  }

  protected firstUpdated(): void {
    if (this._initialized) return;
    this._initialized = true;

    try {
      if (!this._host) return;

      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString();
          this.dispatchEvent(
            new CustomEvent('value-changed', {
              bubbles: true,
              composed: true,
              detail: { value: newValue },
            }),
          );
        }
      });

      this._view = new EditorView({
        state: EditorState.create({
          doc: this.value,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            history(),
            yamlLang(),
            oneDark,
            autocompletion(),
            keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
            updateListener,
            EditorView.lineWrapping,
            ...(this.readonly ? [EditorState.readOnly.of(true)] : []),
          ],
        }),
        parent: this._host,
      });
    } catch (err) {
      console.warn('CodeMirror failed to initialize', err);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._view) {
      this._view.destroy();
    }
    this._view = undefined;
    this._initialized = false;
  }
}

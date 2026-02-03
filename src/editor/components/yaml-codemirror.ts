import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

// CodeMirror integration - uses light DOM to avoid measurement issues
@customElement('mc-yaml-codemirror')
export class YamlCodeMirror extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: Boolean }) readonly = false;

  @query('.cm-host') private _host?: HTMLDivElement;

  private _view?: unknown; // EditorView
  private _initialized = false;

  // Use light DOM for CodeMirror
  createRenderRoot() {
    return this;
  }

  protected render(): TemplateResult {
    return html`<div class="cm-host" style="border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;overflow:hidden;min-height:200px"></div>`;
  }

  protected async firstUpdated(): Promise<void> {
    if (this._initialized) return;
    this._initialized = true;

    try {
      const [
        { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter },
        { EditorState },
        { yaml: yamlLang },
        { defaultKeymap, history, historyKeymap },
        { oneDark },
        { searchKeymap },
        { autocompletion },
      ] = await Promise.all([
        import('@codemirror/view'),
        import('@codemirror/state'),
        import('@codemirror/lang-yaml'),
        import('@codemirror/commands'),
        import('@codemirror/theme-one-dark'),
        import('@codemirror/search'),
        import('@codemirror/autocomplete'),
      ]);

      if (!this._host) return;

      const updateListener = EditorView.updateListener.of((update: { docChanged: boolean; state: { doc: { toString: () => string } } }) => {
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
      console.warn('CodeMirror failed to load, falling back to textarea', err);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._view && typeof (this._view as { destroy: () => void }).destroy === 'function') {
      (this._view as { destroy: () => void }).destroy();
    }
    this._view = undefined;
    this._initialized = false;
  }
}

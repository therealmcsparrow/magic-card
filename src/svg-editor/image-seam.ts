import type { CSSResult, TemplateResult } from 'lit';
import type { ImageEditorExt, ImageEditorHost } from '../contracts/image-editor';
import type { MenuEntry } from '../contracts/path-canvas';
import type { SvgEditorSource } from '../contracts/svg-editor';
import type { McSvgEditor, Out } from './mc-svg-editor';
import type { Doc, Shape } from './model';

/*
 * What <mc-svg-editor> and the image-editor chunk know about each other (types only, no code). The shell holds an
 * ImageUi when it was opened on an image source and calls it at the places the icon editor does something else; the
 * ImageShell is the part of the shell the chunk may use. Nothing here is a public contract: both folders move together.
 */

export type ImageShell = Omit<McSvgEditor, 'hass' | 'host'> & Omit<ImageEditorHost, 'canWrite'>;

export interface ImageUi extends ImageEditorExt {
  /** Extra styles the shell adopts after its own. */
  readonly styles: readonly CSSResult[];
  /** View-only: no library write is possible, the user is not an administrator, or the image has parts this editor cannot keep yet. */
  readonly readOnly: boolean;
  readonly grid: { chips: readonly number[]; min: number; max: number };
  /** A window of the image editor is open: the layer's own keys wait. */
  readonly modal: boolean;
  /** Names of the editor and its canvas for screen readers. */
  readonly title: string;
  readonly canvasLabel: string;
  /** Why open() gave no document, in words. */
  readonly problem?: string;
  /** Escape: close the open window, true when there was one. */
  close(): boolean;
  /** The first document is showing. */
  ready(): void;
  download(): void;
  /** The document to begin with, or undefined when the source could not be opened (the shell shows the start dialog's error state). */
  open(src: SvgEditorSource): Promise<Doc | undefined>;
  buildOut(doc: Doc, decimals: number): Out;
  /** CSS of one layer's fill, stroke, opacity and dashes on the canvas. */
  style(s: Shape): string;
  /** The Fill or Stroke control of a layer (the kind of paint and what it needs). */
  paint(s: Shape, k: 'fill' | 'stroke'): TemplateResult;
  /** Opacity and the outline's dashes. */
  more(s: Shape): TemplateResult;
  /** Gradient handles over the selected layer. */
  handles(): TemplateResult | undefined;
  /** A layer the canvas draws itself (text), else undefined and the layer is a path. */
  node(s: Shape): TemplateResult | undefined;
  /** The Text section of a text layer's inspector, else undefined. */
  text(s: Shape): TemplateResult | undefined;
  /** Adds a text layer; the button for the layer list and the T key. */
  addText(): void;
  addTextButton(): TemplateResult;
  /** The canvas's gradient definitions. */
  defs(doc: Doc): TemplateResult[];
  /** The drawing as text for the changed-since-saved check, paints included. */
  stamp(doc: Doc): string;
  blockReason(out: Out): string | undefined;
  /** Called after every refresh with the committed document, for the size announcements. */
  changed(out: Out): void;
  topBar(): TemplateResult;
  dialogs(): TemplateResult | undefined;
  viewer(): TemplateResult;
  /** Control+S, Done. */
  save(): void;
  pick(id: string): void;
  menuItems(): MenuEntry[];
}

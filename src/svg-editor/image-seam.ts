import type { CSSResult, TemplateResult } from 'lit';
import type { ImageEditorExt, ImageEditorHost } from '../contracts/image-editor';
import type { MenuEntry } from '../contracts/path-canvas';
import type { Pt } from '../contracts/path-model';
import type { KitButtonOptions } from '../contracts/ui-kit';
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
  /** The library id once the image is stored, else undefined (the Saved chip). */
  readonly id?: string;
  /** Label of the name field. */
  readonly nameLabel: string;
  /** First line of the Shortcuts popover. */
  readonly keys: string;
  /** Why Save cannot act yet, else undefined. */
  readonly saveWhy?: string;
  /** The source gave no canvas size: the start window opens first and the editor waits for its first drawing. */
  readonly asks: boolean;
  /** Words for a pasted text over IMAGE_SVG_MAX_FILE_BYTES. */
  readonly tooBig: string;
  /** Escape: close the open window, true when there was one. */
  close(): boolean;
  /** The first document is showing. */
  ready(): void;
  download(): void;
  /** The document to begin with, or undefined when the source could not be opened (the shell shows the start dialog's error state). */
  open(src: SvgEditorSource): Promise<Doc | undefined>;
  /** A fresh Blank canvas form (the start window opened). */
  reset(): void;
  /** The Blank canvas panel's fields: Shape, Width, Height, Keep ratio. */
  form(): TemplateResult;
  /** The numbers in the form are not a size yet. */
  readonly formBad: boolean;
  /** Create: the document of the form's size, or undefined while the numbers are wrong. */
  create(): Doc | undefined;
  /** Start window, Open file: the document of the file, or the reason it was refused. The document shows after ready(). */
  openFile(file: File): Promise<{ doc: Doc } | string>;
  /** Start window, Paste SVG: the document of the text, or the reason it was refused. */
  openText(text: string, name?: string): Promise<{ doc: Doc } | string>;
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
  /** The Text tool: a click or tap puts the on-canvas field at the point, Enter on the canvas in the middle. */
  place(p?: Pt): void;
  /** The Text tool's button for the tool rail. */
  railTool(): KitButtonOptions;
  /** What the Text tool does, for the help list. */
  readonly hint: string;
  /** The reference picture behind the canvas (first child of the stage), else undefined. */
  underlay(): TemplateResult | undefined;
  /** The picture is showing: the board lets it through. */
  readonly hasRef: boolean;
  /** The canvas's gradient definitions. */
  defs(doc: Doc): TemplateResult[];
  /** Why a layer's lock cannot be changed, else undefined. */
  lockNote(s: Shape): string | undefined;
  /** The drawing as text for the changed-since-saved check, paints included. */
  stamp(doc: Doc): string;
  blockReason(out: Out): string | undefined;
  /** Called after every refresh with the committed document, for the size announcements. */
  changed(out: Out): void;
  /** A shape the user just drew, with the image editor's defaults (outline, opacity over a reference picture). */
  fresh(s: Shape): { shape: Shape; note?: string };
  /** Inline style for the canvas's Main and Accent colours when the editor shows them differently, else undefined. */
  artColours(): string | undefined;
  /** The toolbar's "As on a card" toggle. */
  previewButton(): TemplateResult;
  /** One slot of the shell's top bar that only the image profile has (or draws its own way). */
  slot(slot: 'canvas' | 'reference' | 'transfer' | 'more', size: 'sm' | 'md', tight: boolean): TemplateResult;
  /** What follows the bar: the size meter, the file input of Import, the reference picture's pill and panel, the conflict notice. */
  barTail(): TemplateResult;
  dialogs(): TemplateResult | undefined;
  viewer(): TemplateResult;
  /** Control+S, Done. */
  save(): void;
  pick(id: string): void;
  menuItems(): MenuEntry[];
}

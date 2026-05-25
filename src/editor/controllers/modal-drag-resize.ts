import { ReactiveController, ReactiveControllerHost } from 'lit';

interface ModalDragResizeConfig {
  minWidth?: number;
  minHeight?: number;
}

export class ModalDragResizeController implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _minWidth: number;
  private _minHeight: number;

  private _modal: HTMLElement | null = null;
  private _positioned = false;
  private _maximized = false;
  private _dragged = false;

  // Stored rect before maximize
  private _preMaxRect: { left: number; top: number; width: number; height: number } | null = null;

  // Drag state
  private _dragStartX = 0;
  private _dragStartY = 0;
  private _dragStartLeft = 0;
  private _dragStartTop = 0;
  private _isDragging = false;

  // Resize state
  private _resizeStartX = 0;
  private _resizeStartY = 0;
  private _resizeStartW = 0;
  private _resizeStartH = 0;
  private _isResizing = false;

  // Bound handlers for cleanup
  private _onPointerMoveBound = this._onPointerMove.bind(this);
  private _onPointerUpBound = this._onPointerUp.bind(this);
  private _onTouchMoveBound = this._onTouchMove.bind(this);
  private _onTouchEndBound = this._onTouchEnd.bind(this);

  constructor(host: ReactiveControllerHost, config: ModalDragResizeConfig = {}) {
    this._host = host;
    this._minWidth = config.minWidth ?? 320;
    this._minHeight = config.minHeight ?? 240;
    host.addController(this);
  }

  hostDisconnected(): void {
    this._removeGlobalListeners();
  }

  get isMaximized(): boolean {
    return this._maximized;
  }

  /** Returns true if a drag occurred (consumes the flag). Use to guard overlay clicks. */
  consumeDragFlag(): boolean {
    if (this._dragged) {
      this._dragged = false;
      return true;
    }
    return false;
  }

  /** Call when modal closes to reset all state and inline styles. */
  reset(): void {
    this._removeGlobalListeners();
    if (this._modal) {
      this._modal.classList.remove('mc-modal--positioned', 'mc-modal--maximized');
      this._modal.style.removeProperty('left');
      this._modal.style.removeProperty('top');
      this._modal.style.removeProperty('width');
      this._modal.style.removeProperty('height');
      this._modal.style.removeProperty('position');
      this._modal.style.removeProperty('margin');
      this._modal.style.removeProperty('max-width');
      this._modal.style.removeProperty('max-height');
    }
    this._modal = null;
    this._positioned = false;
    this._maximized = false;
    this._dragged = false;
    this._preMaxRect = null;
    this._isDragging = false;
    this._isResizing = false;
  }

  /** Bind to the modal container element. Call in firstUpdated or after render. */
  bindModal(modal: HTMLElement): void {
    this._modal = modal;
  }

  // ── Drag ─────────────────────────────────────────────────────────

  handleHeaderPointerDown(e: PointerEvent): void {
    if (this._shouldIgnoreTarget(e.target as HTMLElement)) return;
    e.preventDefault();
    this._ensureModal(e);
    if (!this._modal) return;

    this._ensurePositioned();

    this._isDragging = true;
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
    this._dragStartLeft = parseInt(this._modal.style.left) || 0;
    this._dragStartTop = parseInt(this._modal.style.top) || 0;

    document.addEventListener('pointermove', this._onPointerMoveBound);
    document.addEventListener('pointerup', this._onPointerUpBound);
  }

  handleHeaderTouchStart(e: TouchEvent): void {
    if (this._shouldIgnoreTarget(e.target as HTMLElement)) return;
    if (e.touches.length !== 1) return;
    this._ensureModalFromTouch(e);
    if (!this._modal) return;

    this._ensurePositioned();

    const touch = e.touches[0];
    this._isDragging = true;
    this._dragStartX = touch.clientX;
    this._dragStartY = touch.clientY;
    this._dragStartLeft = parseInt(this._modal.style.left) || 0;
    this._dragStartTop = parseInt(this._modal.style.top) || 0;

    document.addEventListener('touchmove', this._onTouchMoveBound, { passive: false });
    document.addEventListener('touchend', this._onTouchEndBound);
  }

  // ── Resize ───────────────────────────────────────────────────────

  handleResizePointerDown(e: PointerEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this._ensureModal(e);
    if (!this._modal) return;

    this._ensurePositioned();

    this._isResizing = true;
    this._resizeStartX = e.clientX;
    this._resizeStartY = e.clientY;
    this._resizeStartW = this._modal.offsetWidth;
    this._resizeStartH = this._modal.offsetHeight;

    document.addEventListener('pointermove', this._onPointerMoveBound);
    document.addEventListener('pointerup', this._onPointerUpBound);
  }

  handleResizeTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return;
    e.stopPropagation();
    this._ensureModalFromTouch(e);
    if (!this._modal) return;

    this._ensurePositioned();

    const touch = e.touches[0];
    this._isResizing = true;
    this._resizeStartX = touch.clientX;
    this._resizeStartY = touch.clientY;
    this._resizeStartW = this._modal.offsetWidth;
    this._resizeStartH = this._modal.offsetHeight;

    document.addEventListener('touchmove', this._onTouchMoveBound, { passive: false });
    document.addEventListener('touchend', this._onTouchEndBound);
  }

  // ── Maximize ─────────────────────────────────────────────────────

  toggleMaximize(): void {
    if (!this._modal) return;

    if (this._maximized) {
      // Restore
      this._modal.classList.remove('mc-modal--maximized');
      if (this._preMaxRect) {
        this._modal.style.left = this._preMaxRect.left + 'px';
        this._modal.style.top = this._preMaxRect.top + 'px';
        this._modal.style.width = this._preMaxRect.width + 'px';
        this._modal.style.height = this._preMaxRect.height + 'px';
      }
      this._maximized = false;
    } else {
      // Maximize - store current rect first
      this._ensurePositioned();
      this._preMaxRect = {
        left: parseInt(this._modal.style.left) || 0,
        top: parseInt(this._modal.style.top) || 0,
        width: this._modal.offsetWidth,
        height: this._modal.offsetHeight,
      };
      const margin = 16;
      this._modal.style.left = margin + 'px';
      this._modal.style.top = margin + 'px';
      this._modal.style.width = (window.innerWidth - margin * 2) + 'px';
      this._modal.style.height = (window.innerHeight - margin * 2) + 'px';
      this._modal.classList.add('mc-modal--maximized');
      this._maximized = true;
    }
    this._host.requestUpdate();
  }

  // ── Private helpers ──────────────────────────────────────────────

  private _shouldIgnoreTarget(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea'
      || tag === 'ha-icon' || el.closest('button') !== null;
  }

  private _ensureModal(e: PointerEvent): void {
    if (!this._modal) {
      const header = (e.currentTarget as HTMLElement);
      this._modal = header.closest('.mc-modal, .mc-picker-modal') as HTMLElement;
    }
  }

  private _ensureModalFromTouch(e: TouchEvent): void {
    if (!this._modal) {
      const header = (e.currentTarget as HTMLElement);
      this._modal = header.closest('.mc-modal, .mc-picker-modal') as HTMLElement;
    }
  }

  /** Convert from flex-centered to position:fixed with explicit coords. */
  private _ensurePositioned(): void {
    if (this._positioned || !this._modal) return;
    const rect = this._modal.getBoundingClientRect();
    this._modal.style.position = 'fixed';
    this._modal.style.left = rect.left + 'px';
    this._modal.style.top = rect.top + 'px';
    this._modal.style.width = rect.width + 'px';
    this._modal.style.height = rect.height + 'px';
    this._modal.style.margin = '0';
    this._modal.style.maxWidth = 'none';
    this._modal.style.maxHeight = 'none';
    this._modal.classList.add('mc-modal--positioned');
    this._positioned = true;
  }

  private _onPointerMove(e: PointerEvent): void {
    this._handleMove(e.clientX, e.clientY);
  }

  private _onPointerUp(): void {
    this._handleEnd();
    document.removeEventListener('pointermove', this._onPointerMoveBound);
    document.removeEventListener('pointerup', this._onPointerUpBound);
  }

  private _onTouchMove(e: TouchEvent): void {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    this._handleMove(touch.clientX, touch.clientY);
  }

  private _onTouchEnd(): void {
    this._handleEnd();
    document.removeEventListener('touchmove', this._onTouchMoveBound);
    document.removeEventListener('touchend', this._onTouchEndBound);
  }

  private _handleMove(clientX: number, clientY: number): void {
    if (!this._modal) return;

    if (this._isDragging) {
      const dx = clientX - this._dragStartX;
      const dy = clientY - this._dragStartY;
      this._modal.style.left = (this._dragStartLeft + dx) + 'px';
      this._modal.style.top = (this._dragStartTop + dy) + 'px';
      this._dragged = true;
    }

    if (this._isResizing) {
      const dx = clientX - this._resizeStartX;
      const dy = clientY - this._resizeStartY;
      const newW = Math.max(this._minWidth, this._resizeStartW + dx);
      const newH = Math.max(this._minHeight, this._resizeStartH + dy);
      this._modal.style.width = newW + 'px';
      this._modal.style.height = newH + 'px';
      this._dragged = true;
    }
  }

  private _handleEnd(): void {
    this._isDragging = false;
    this._isResizing = false;
  }

  private _removeGlobalListeners(): void {
    document.removeEventListener('pointermove', this._onPointerMoveBound);
    document.removeEventListener('pointerup', this._onPointerUpBound);
    document.removeEventListener('touchmove', this._onTouchMoveBound);
    document.removeEventListener('touchend', this._onTouchEndBound);
  }
}

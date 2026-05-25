import { ActionsConfig } from '../types';

export type GestureType = 'tap' | 'hold' | 'double_tap';

interface GestureState {
  startX: number;
  startY: number;
  startTime: number;
  holdTimer: ReturnType<typeof setTimeout> | null;
  tapCount: number;
  tapTimer: ReturnType<typeof setTimeout> | null;
}

const HOLD_DURATION = 500;
const DOUBLE_TAP_WINDOW = 300;
const MOVE_THRESHOLD = 10;

export class GestureService {
  private state: GestureState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    holdTimer: null,
    tapCount: 0,
    tapTimer: null,
  };

  private onGesture: (type: GestureType) => void;
  private actions: ActionsConfig;

  constructor(actions: ActionsConfig, onGesture: (type: GestureType) => void) {
    this.actions = actions;
    this.onGesture = onGesture;
  }

  attach(element: HTMLElement): () => void {
    const onPointerDown = (e: PointerEvent) => this.handlePointerDown(e);
    const onPointerUp = (e: PointerEvent) => this.handlePointerUp(e);
    const onPointerCancel = () => this.cancel();
    const onContextMenu = (e: Event) => {
      if (this.actions.hold_action) {
        e.preventDefault();
      }
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerCancel);
    element.addEventListener('contextmenu', onContextMenu);

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerCancel);
      element.removeEventListener('contextmenu', onContextMenu);
      this.cancel();
    };
  }

  private handlePointerDown(e: PointerEvent): void {
    this.state.startX = e.clientX;
    this.state.startY = e.clientY;
    this.state.startTime = Date.now();

    if (this.actions.hold_action && this.actions.hold_action.action !== 'none') {
      this.state.holdTimer = setTimeout(() => {
        this.onGesture('hold');
        this.state.holdTimer = null;
      }, HOLD_DURATION);
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    const dx = e.clientX - this.state.startX;
    const dy = e.clientY - this.state.startY;
    const moved = Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD;
    const elapsed = Date.now() - this.state.startTime;

    if (this.state.holdTimer) {
      clearTimeout(this.state.holdTimer);
      this.state.holdTimer = null;
    }

    if (moved || elapsed >= HOLD_DURATION) return;

    // Handle tap / double tap
    this.state.tapCount++;

    if (this.state.tapCount === 1) {
      if (
        this.actions.double_tap_action &&
        this.actions.double_tap_action.action !== 'none'
      ) {
        this.state.tapTimer = setTimeout(() => {
          this.onGesture('tap');
          this.state.tapCount = 0;
        }, DOUBLE_TAP_WINDOW);
      } else {
        this.onGesture('tap');
        this.state.tapCount = 0;
      }
    } else if (this.state.tapCount === 2) {
      if (this.state.tapTimer) {
        clearTimeout(this.state.tapTimer);
        this.state.tapTimer = null;
      }
      this.onGesture('double_tap');
      this.state.tapCount = 0;
    }
  }

  private cancel(): void {
    if (this.state.holdTimer) {
      clearTimeout(this.state.holdTimer);
      this.state.holdTimer = null;
    }
    if (this.state.tapTimer) {
      clearTimeout(this.state.tapTimer);
      this.state.tapTimer = null;
    }
    this.state.tapCount = 0;
  }
}

import {
  SharedResizeObserverInterface,
  SharedResizeObserverResizeHandlerInterface,
} from '@internetarchive/shared-resize-observer';

export class MockResizeObserver implements SharedResizeObserverInterface {
  private resizeHandlers: Map<
    Element,
    Set<SharedResizeObserverResizeHandlerInterface>
  > = new Map();

  private targetSizes: Map<Element, DOMRectReadOnly>;

  private observationComplete: () => void;

  constructor(options: {
    targetSizes: Map<Element, DOMRectReadOnly>;
    observationComplete: () => void;
  }) {
    this.targetSizes = options.targetSizes;
    this.observationComplete = options.observationComplete;
  }

  addObserver(options: {
    handler: SharedResizeObserverResizeHandlerInterface;
    target: Element;
    options?: ResizeObserverOptions | undefined;
  }): void {
    const handlers = this.resizeHandlers.get(options.target) ?? new Set();
    handlers.add(options.handler);
    this.resizeHandlers.set(options.target, handlers);
    const size = this.targetSizes.get(options.target);
    if (!size) return;
    options.handler.handleResize({
      target: options.target,
      borderBoxSize: [{ blockSize: 0, inlineSize: 0 }],
      contentBoxSize: [{ blockSize: 0, inlineSize: 0 }],
      contentRect: size,
    });
    this.observationComplete();
  }

  removeObserver(options: {
    handler: SharedResizeObserverResizeHandlerInterface;
    target: Element;
  }): void {
    const handlers = this.resizeHandlers.get(options.target);
    if (!handlers) return;
    handlers.delete(options.handler);
    if (handlers.size === 0) {
      this.resizeHandlers.delete(options.target);
    }
  }
}

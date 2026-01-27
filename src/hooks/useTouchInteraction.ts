import { useState, useEffect, useCallback, useRef, type RefObject } from 'react';

// Detect if device supports touch
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    checkTouch();

    // Re-check on resize (some devices report differently)
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  return isTouchDevice;
}

// Touch feedback state for elements
export function useTouchFeedback<T extends HTMLElement>(ref: RefObject<T>) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = () => setIsPressed(true);
    const handleTouchEnd = () => setIsPressed(false);
    const handleTouchCancel = () => setIsPressed(false);

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [ref]);

  return isPressed;
}

// Swipe gesture detection
export interface SwipeState {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwiping?: (state: SwipeState) => void;
  onSwipeEnd?: (state: SwipeState) => void;
}

const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe
const VELOCITY_THRESHOLD = 0.3; // Minimum velocity to trigger swipe

export function useSwipeGesture<T extends HTMLElement>(
  ref: RefObject<T>,
  handlers: SwipeHandlers = {},
  options: { preventScroll?: boolean } = {}
) {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const [swiping, setSwiping] = useState<SwipeState>({
    direction: null,
    distance: 0,
    velocity: 0,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startTime.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const elapsed = Date.now() - startTime.current;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine direction based on larger delta
    let direction: SwipeState['direction'] = null;
    let distance = 0;

    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left';
      distance = absX;

      // Prevent horizontal scroll if we're detecting horizontal swipes
      if (options.preventScroll && absX > 10) {
        e.preventDefault();
      }
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
      distance = absY;
    }

    const velocity = distance / (elapsed || 1);

    const state: SwipeState = { direction, distance, velocity };
    setSwiping(state);
    handlers.onSwiping?.(state);
  }, [handlers, options.preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!startTime.current) return;

    const elapsed = Date.now() - startTime.current;
    const velocity = swiping.distance / (elapsed || 1);

    const finalState: SwipeState = {
      ...swiping,
      velocity,
    };

    // Trigger swipe callbacks if threshold met
    if (swiping.distance >= SWIPE_THRESHOLD || velocity >= VELOCITY_THRESHOLD) {
      switch (swiping.direction) {
        case 'left':
          handlers.onSwipeLeft?.();
          break;
        case 'right':
          handlers.onSwipeRight?.();
          break;
        case 'up':
          handlers.onSwipeUp?.();
          break;
        case 'down':
          handlers.onSwipeDown?.();
          break;
      }
    }

    handlers.onSwipeEnd?.(finalState);

    // Reset
    startX.current = 0;
    startY.current = 0;
    startTime.current = 0;
    setSwiping({ direction: null, distance: 0, velocity: 0 });
  }, [swiping, handlers]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !options.preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchMove, handleTouchEnd, options.preventScroll]);

  return swiping;
}

// Drag gesture for carousel-style interactions
export interface DragState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  deltaX: number;
  velocity: number;
}

export function useDragGesture<T extends HTMLElement>(
  ref: RefObject<T>,
  options: {
    onDragStart?: (state: DragState) => void;
    onDrag?: (state: DragState) => void;
    onDragEnd?: (state: DragState) => void;
    axis?: 'x' | 'y' | 'both';
  } = {}
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    deltaX: 0,
    velocity: 0,
  });

  const lastX = useRef(0);
  const lastTime = useRef(0);

  const handleStart = useCallback((clientX: number) => {
    const state: DragState = {
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      deltaX: 0,
      velocity: 0,
    };
    lastX.current = clientX;
    lastTime.current = Date.now();
    setDragState(state);
    options.onDragStart?.(state);
  }, [options]);

  const handleMove = useCallback((clientX: number) => {
    if (!dragState.isDragging) return;

    const now = Date.now();
    const elapsed = now - lastTime.current;
    const velocity = elapsed > 0 ? (clientX - lastX.current) / elapsed : 0;

    const state: DragState = {
      isDragging: true,
      startX: dragState.startX,
      currentX: clientX,
      deltaX: clientX - dragState.startX,
      velocity,
    };

    lastX.current = clientX;
    lastTime.current = now;
    setDragState(state);
    options.onDrag?.(state);
  }, [dragState.isDragging, dragState.startX, options]);

  const handleEnd = useCallback(() => {
    if (!dragState.isDragging) return;

    options.onDragEnd?.(dragState);
    setDragState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      deltaX: 0,
      velocity: 0,
    });
  }, [dragState, options]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Touch events
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (dragState.isDragging && options.axis !== 'y') {
        e.preventDefault();
      }
      handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    // Mouse events (for desktop testing)
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
    const onMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    };
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => handleEnd();

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    element.addEventListener('mousedown', onMouseDown);

    // Mouse move/up on document for better UX
    if (dragState.isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      element.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref, handleStart, handleMove, handleEnd, dragState.isDragging, options.axis]);

  return dragState;
}

// Pinch-to-zoom gesture (for future use)
export function usePinchGesture<T extends HTMLElement>(
  ref: RefObject<T>,
  options: {
    onPinchStart?: (scale: number) => void;
    onPinch?: (scale: number) => void;
    onPinchEnd?: (scale: number) => void;
  } = {}
) {
  const [scale, setScale] = useState(1);
  const initialDistance = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const getDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance.current = getDistance(e.touches);
        options.onPinchStart?.(1);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance.current > 0) {
        const currentDistance = getDistance(e.touches);
        const newScale = currentDistance / initialDistance.current;
        setScale(newScale);
        options.onPinch?.(newScale);
      }
    };

    const onTouchEnd = () => {
      if (initialDistance.current > 0) {
        options.onPinchEnd?.(scale);
        initialDistance.current = 0;
        setScale(1);
      }
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [ref, scale, options]);

  return scale;
}

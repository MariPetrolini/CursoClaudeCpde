import '@testing-library/jest-dom'

// @base-ui/react uses PointerEvent internally; jsdom doesn't implement it fully.
class PointerEventPolyfill extends MouseEvent implements PointerEvent {
  pointerId = 0
  width = 1
  height = 1
  pressure = 0
  tangentialPressure = 0
  tiltX = 0
  tiltY = 0
  twist = 0
  pointerType = 'mouse'
  isPrimary = true
  altitudeAngle = 0
  azimuthAngle = 0
  getCoalescedEvents(): PointerEvent[] { return [] }
  getPredictedEvents(): PointerEvent[] { return [] }
}
global.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
window.scrollTo = vi.fn()

// jsdom has no IntersectionObserver; framer-motion's whileInView needs one.
class IntersectionObserverStub {
  observe(){}
  unobserve(){}
  disconnect(){}
  takeRecords(){return []}
}
vi.stubGlobal('IntersectionObserver',IntersectionObserverStub)

afterEach(cleanup)
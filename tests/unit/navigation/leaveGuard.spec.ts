import { beforeEach, describe, expect, it } from 'vitest'
import { isGuarded, useLeaveGuardStoreBase } from '@store/navigation/guard/store'

const store = () => useLeaveGuardStoreBase.getState()

describe('leave guard', () => {
  beforeEach(() => {
    store().setGuard('game', false)
  })

  it('lets a navigation through at once while nothing is guarded', async () => {
    await expect(store().ask()).resolves.toBe(true)
    expect(store().question).toBeNull()
  })

  it('holds a navigation until the player answers', async () => {
    store().setGuard('game', true)
    const stay = store().ask()
    expect(store().question).not.toBeNull()
    store().answer(false)
    await expect(stay).resolves.toBe(false)
    expect(store().leaving).toBe(false)

    const leave = store().ask()
    store().answer(true)
    await expect(leave).resolves.toBe(true)
    // Agreed once: the page load that follows does not ask again.
    expect(store().leaving).toBe(true)
    await expect(store().ask()).resolves.toBe(true)
  })

  it('starts afresh once the puzzle is no longer in progress, so the next one asks again', async () => {
    store().setGuard('game', true)
    const leave = store().ask()
    store().answer(true)
    await leave
    store().setGuard('game', false)
    expect(store().leaving).toBe(false)
    expect(isGuarded(store().guards)).toBe(false)

    store().setGuard('game', true)
    void store().ask()
    expect(store().question).not.toBeNull()
  })

  it('drops an open question when the puzzle ends under it', async () => {
    store().setGuard('game', true)
    const pending = store().ask()
    store().setGuard('game', false)
    await expect(pending).resolves.toBe(false)
    expect(store().question).toBeNull()
  })

  it('answers a superseded question with "stay"', async () => {
    store().setGuard('game', true)
    const first = store().ask()
    const second = store().ask()
    await expect(first).resolves.toBe(false)
    store().answer(true)
    await expect(second).resolves.toBe(true)
  })
})

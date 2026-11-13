import { describe, expect, it } from 'vitest'
import { clientAddress, reporterKeyFor } from '../../server/src/lib/request.js'

const at = (ip: string | undefined) => ({ ip })

describe('clientAddress', () => {
  it('keeps an IPv4 address as it is', () => {
    expect(clientAddress(at('203.0.113.7'))).toBe('203.0.113.7')
  })

  it('unwraps an IPv4-mapped IPv6 address', () => {
    expect(clientAddress(at('::ffff:203.0.113.7'))).toBe('203.0.113.7')
  })

  it('collapses an IPv6 address to its /64', () => {
    expect(clientAddress(at('2001:db8:85a3:42:1:2:3:4'))).toBe('2001:db8:85a3:42::/64')
    expect(clientAddress(at('2001:0db8:0000:0042:abcd::1'))).toBe('2001:db8:0:42::/64')
    expect(clientAddress(at('2001:db8::1'))).toBe('2001:db8:0:0::/64')
    expect(clientAddress(at('fe80::1%eth0'))).toBe('fe80:0:0:0::/64')
  })

  it('gives every address in one /64 the same key, and another /64 a different one', () => {
    const a = reporterKeyFor(at('2001:db8:1:2::aaaa'))
    expect(reporterKeyFor(at('2001:db8:1:2:ffff:ffff:ffff:ffff'))).toBe(a)
    expect(reporterKeyFor(at('2001:db8:1:3::aaaa'))).not.toBe(a)
  })

  it('survives a missing address', () => {
    expect(clientAddress(at(undefined))).toBe('')
  })
})

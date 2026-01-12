import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchGeocoding } from './openweather_api'

vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-api-key')

describe('fetchGeocoding', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return coordinates for a valid city name', async () => {
        const mockGeocodingResponse = [
            {
                name: 'London',
                lat: 51.5085,
                lon: -0.1257,
                country: 'GB',
            },
        ]

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockGeocodingResponse,
        })

        const result = await fetchGeocoding('London')

        expect(result).toEqual({
            lat: 51.5085,
            lon: -0.1257,
        })

        expect(globalThis.fetch).toHaveBeenCalledWith(
            'https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=test-api-key'
        )
    })

    it('should encode city name with special characters in URL', async () => {
        const mockGeocodingResponse = [
            {
                name: 'São Paulo',
                lat: -23.5505,
                lon: -46.6333,
                country: 'BR',
            },
        ]

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockGeocodingResponse,
        })

        await fetchGeocoding('São Paulo')

        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('q=S%C3%A3o%20Paulo')
        )
    })

    it('should throw error when API response is not 200', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
        })

        await expect(fetchGeocoding('London')).rejects.toThrow(
            'Failed to fetch geocoding data'
        )
    })

    it('should throw error when location is not found', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        })

        await expect(fetchGeocoding('NonexistentCity')).rejects.toThrow(
            'Location not found'
        )
    })

    it('should throw error when geocoding results is null', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => null,
        })

        await expect(fetchGeocoding('London')).rejects.toThrow(
            'Location not found'
        )
    })

    it('should throw error when fetch fails with network error', async () => {
        globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

        await expect(fetchGeocoding('London')).rejects.toThrow('Network error')
    })

    it('should use the first result from multiple matches', async () => {
        const mockGeocodingResponse = [
            {
                name: 'London',
                lat: 51.5085,
                lon: -0.1257,
                country: 'GB',
            },
            {
                name: 'London',
                lat: 42.9834,
                lon: -81.233,
                country: 'CA',
            },
        ]

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockGeocodingResponse,
        })

        const result = await fetchGeocoding('London')

        expect(result).toEqual({
            lat: 51.5085,
            lon: -0.1257,
        })
    })
})

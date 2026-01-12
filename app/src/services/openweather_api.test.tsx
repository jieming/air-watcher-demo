import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchGeocoding, fetchAirPolutionData } from './openweather_api'

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

describe('fetchAirPolutionData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return air pollution data for valid coordinates', async () => {
        const mockAirPollutionResponse = {
            coord: [51.5085, -0.1257],
            list: [
                {
                    dt: 1606147200,
                    main: {
                        aqi: 4,
                    },
                    components: {
                        co: 203.609,
                        no: 0.0,
                        no2: 0.396,
                        o3: 75.102,
                        so2: 0.648,
                        pm2_5: 23.253,
                        pm10: 92.214,
                        nh3: 0.117,
                    },
                },
            ],
        }

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockAirPollutionResponse,
        })

        const result = await fetchAirPolutionData(51.5085, -0.1257)

        expect(result).toEqual({
            aqi: 4,
            components: {
                co: 203.609,
                no: 0.0,
                no2: 0.396,
                o3: 75.102,
                so2: 0.648,
                pm2_5: 23.253,
                pm10: 92.214,
                nh3: 0.117,
            },
        })

        expect(globalThis.fetch).toHaveBeenCalledWith(
            'https://api.openweathermap.org/data/2.5/air_pollution?lat=51.5085&lon=-0.1257&appid=test-api-key'
        )
    })

    it('should throw error when API response is not 200', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
        })

        await expect(fetchAirPolutionData(51.5085, -0.1257)).rejects.toThrow(
            'Failed to fetch air pollution data'
        )
    })

    it('should throw error when air pollution data list is empty', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                coord: [51.5085, -0.1257],
                list: [],
            }),
        })

        await expect(fetchAirPolutionData(51.5085, -0.1257)).rejects.toThrow(
            'Air pollution data not found'
        )
    })

    it('should throw error when air pollution data list is null', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                coord: [51.5085, -0.1257],
                list: null,
            }),
        })

        await expect(fetchAirPolutionData(51.5085, -0.1257)).rejects.toThrow(
            'Air pollution data not found'
        )
    })

    it('should use the first result from the list', async () => {
        const mockAirPollutionResponse = {
            coord: [51.5085, -0.1257],
            list: [
                {
                    dt: 1606147200,
                    main: {
                        aqi: 1,
                    },
                    components: {
                        co: 201.94,
                        no: 0.018,
                        no2: 0.771,
                        o3: 68.664,
                        so2: 0.64,
                        pm2_5: 0.5,
                        pm10: 0.54,
                        nh3: 0.123,
                    },
                },
                {
                    dt: 1606147300,
                    main: {
                        aqi: 2,
                    },
                    components: {
                        co: 210.0,
                        no: 0.02,
                        no2: 0.8,
                        o3: 70.0,
                        so2: 0.7,
                        pm2_5: 1.0,
                        pm10: 1.0,
                        nh3: 0.15,
                    },
                },
            ],
        }

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockAirPollutionResponse,
        })

        const result = await fetchAirPolutionData(51.5085, -0.1257)

        expect(result.aqi).toBe(1)
        expect(result.components.co).toBe(201.94)
    })
})

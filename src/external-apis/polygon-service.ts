import got from 'got';
import { subWeeks, subMonths, subYears, format } from 'date-fns/fp';
import { polygonApiToken } from '@/config';
import type { Ticker, BarData, AggregatedBarData } from '@/types';

const BASE_URL = 'https://api.polygon.io';

function makeRequest<T>(path: string, searchParams = {}) {
    return got
        .get(`${BASE_URL}/${path}`, {
            searchParams: {
                apiKey: polygonApiToken,
                ...searchParams,
            },
        })
        .json<T>();
}

export async function getTickers() {
    const { results } = await makeRequest<{ results: Ticker[] }>(
        'v3/reference/tickers',
        {
            active: true,
            market: 'stocks',
            sort: 'name',
            order: 'ticker',
            limit: 20,
        }
    );

    return results;
}

const durations = { week: subWeeks(1), month: subMonths(1), year: subYears(1) };
const formatDate = format('yyyy-MM-dd');

export async function getBars({
    ticker,
    duration,
}: {
    ticker: string;
    duration: keyof typeof durations;
}): Promise<AggregatedBarData> {
    const today = new Date();
    const dateFrom = formatDate(durations[duration](today));
    const dateTo = formatDate(today);

    const { results } = await makeRequest<{ results: BarData[] }>(
        `v2/aggs/ticker/${ticker}/range/1/day/${dateFrom}/${dateTo}`
    );

    const minPrice = Math.min.apply(
        null,
        results.map((bar) => bar.l)
    );
    const maxPrice = Math.max.apply(
        null,
        results.map((bar) => bar.h)
    );
    const priceRange = maxPrice - minPrice;
    const endTimestamp = Math.max.apply(
        null,
        results.map((bar) => bar.t)
    );
    const startTimestamp = Math.min.apply(
        null,
        results.map((bar) => bar.t)
    );
    const timestampRange = endTimestamp - startTimestamp;

    return {
        minPrice,
        maxPrice,
        priceRange,
        endTimestamp,
        startTimestamp,
        timestampRange,
        bars: results,
    };
}

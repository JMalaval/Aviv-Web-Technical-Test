import { cleanTables, postgres } from "@/libs/postgres";
import { getRepository as listingRepository } from "@/repositories/listings";
import { getRepository as pricesRepository } from "@/repositories/prices";
import { ListingWrite } from "@/types.generated";
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";

describe("repository listings", () => {
    const listingWrite: ListingWrite = {
        name: 'Lore Colpaert',
        postal_address: {
            postal_code: '21810',
            street_address: 'Jonathanboulevard 631',
            city: '',
            country: ''
        },
        building_type: 'HOUSE',
        description: '',
        latest_price_eur: 70000,
        surface_area_m2: 100,
        rooms_count: 2,
        bedrooms_count: 2
    }

    beforeAll(async () => {
        await postgres.connect()
        await cleanTables(postgres);
    })

    afterAll(async () => {
        await postgres.end()
    })

    afterEach(async () => {
        await cleanTables(postgres);
    })

    it('succeed if price is inserted in table public.price', async () => {
        /** arrange */
        const createdListing = await listingRepository(postgres).insertListing(listingWrite);

        /** act */
        await pricesRepository(postgres).insertPrice({ listing_id: createdListing.id, listing_lastest_price_eur: 700000 });

        /** assert */
        const queryString = `SELECT * FROM price WHERE listing_id = $1`;
        const queryValues = [createdListing.id];
        const { rows } = await postgres.query(queryString, queryValues);
        expect(rows).toMatchObject([
            { price_eur: 70000 },
            { price_eur: 700000 },
        ]);
    })


    it('succeed if all prices are return for a given listing id', async () => {
        /** arrange */
        const createdListing = await listingRepository(postgres).insertListing(listingWrite);

        /** act */
        await pricesRepository(postgres).insertPrice({ listing_id: createdListing.id, listing_lastest_price_eur: 700000 });
        await pricesRepository(postgres).insertPrice({ listing_id: createdListing.id, listing_lastest_price_eur: 800000 });
        await pricesRepository(postgres).insertPrice({ listing_id: createdListing.id, listing_lastest_price_eur: 900000 });

        /** assert */
        const prices = await pricesRepository(postgres).getAllPricesByListingId(createdListing.id);
        expect(prices).toMatchObject([
            { price_eur: 70000 },
            { price_eur: 700000 },
            { price_eur: 800000 },
            { price_eur: 900000 },
        ]);
    })
});

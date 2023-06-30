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


    it('succeed if price is added to price table when listing.price is created', async () => {
        /** arrange */
        const createdListing = await listingRepository(postgres).insertListing(listingWrite);

        /** act */
        const prices = await pricesRepository(postgres).getAllPricesByListingId(createdListing.id);

        /** assert */
        expect(createdListing.latest_price_eur).toEqual(70000);
        expect(prices).toMatchObject([
            { price_eur: 70000 },
        ]);
    })

    it('succeed if price is added to price table when listing.price is updated', async () => {
        /** arrange */
        const createdListing = await listingRepository(postgres).insertListing(listingWrite);

        /** act */
        const updatedListing = await listingRepository(postgres).updateListing(createdListing.id, { ...listingWrite, latest_price_eur: 80000 })
        const prices = await pricesRepository(postgres).getAllPricesByListingId(createdListing.id);

        /** assert */
        expect(updatedListing.latest_price_eur).toEqual(80000);
        expect(prices).toMatchObject([
            { price_eur: 70000 },
            { price_eur: 80000 },
        ]);
    })
});

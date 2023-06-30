import { EntityNotFound } from "@/libs/errors";
import { extractVariables } from "@/libs/postgres";
import { Listing, Price } from "@/types.generated";
import PostgresClient from "serverless-postgres";

type PriceTableRow = {
    id?: number;
    listing_id: number;
    price_eur: number;
    created_date: Date;
};

function priceToTableRow({ listing_id, listing_lastest_price_eur, createdDate }: { listing_id: Listing['id'], listing_lastest_price_eur: Listing['latest_price_eur'], createdDate: Date }): PriceTableRow {
    return {
        price_eur: listing_lastest_price_eur,
        listing_id,
        created_date: createdDate,
    };
}

function tableRowToPrice(row: PriceTableRow): Price {
    return {
        price_eur: row.price_eur,
        created_date: row.created_date.toISOString(),
    };
}
export function getRepository(postgres: PostgresClient) {
    return {
        async getAllPricesByListingId(listingId: Listing['id']): Promise<Price[]> {
            const queryString = `SELECT * FROM price WHERE listing_id = $1`;
            const queryValues = [listingId];

            /**
             * This error => https://github.com/Aviv-public/Aviv-Web-Technical-Test/tree/main/typescript-serverless#known-issues
             * Because of this error I forced typing of the query for tableRowToPrice
             */
            const { rows }: { rows: PriceTableRow[] } = await postgres.query(queryString, queryValues);

            if (!rows.length) {
                throw new EntityNotFound(
                    `Could not find prices with listingId: ${listingId}`
                );
            }

            /** Sort by created_date inscreasing */
            return rows.sort((a, b) => a.created_date.getTime() > b.created_date.getTime() ? 1 : -1).map((row) => tableRowToPrice(row));
        },

        async insertPrice({ listing_id, listing_lastest_price_eur }: { listing_id: Listing['id'], listing_lastest_price_eur: Listing['latest_price_eur'] }) {
            const tableRow = priceToTableRow({ listing_id, listing_lastest_price_eur, createdDate: new Date() });

            const {
                columns,
                variables,
                values: queryValues,
            } = extractVariables(tableRow);

            const queryString = `
                INSERT INTO price (${columns.join(",")})
                VALUES(${variables})
                RETURNING *
            `;

            await postgres.query(queryString, queryValues);
        },
    };
}

import { EntityNotFound, NotFound } from "@/libs/errors";
import { functionHandler } from "@/libs/function";
import { getRepository } from "@/repositories/prices";
import { Price } from "@/types.generated";

export const getListingPrices = functionHandler<Price[]>(async (event, context) => {
  try {
    const price = await getRepository(context.postgres).getAllPricesByListingId(parseInt(event.pathParameters.id))

    return { statusCode: 200, response: price };
  } catch (e) {
    if (e instanceof EntityNotFound) {
      throw new NotFound(e.message);
    }

    throw e;
  }
});

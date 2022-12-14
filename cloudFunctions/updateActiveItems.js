Moralis.Cloud.afterSave("ItemListed", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx");

  if (confirmed) {
    logger.info("Found Item!");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);

    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("seller", request.object.get("seller"));
    const alreadyListedItem = await query.first();
    if (alreadyListedItem) {
      logger.info(`Deleting already listed ${request.object.get("objectId")}`);
      await alreadyListedItem.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          "tokenId"
        )} at address ${request.object.get(
          "address"
        )} since it's already been listed`
      );
    }

    const activeItem = new ActiveItem();
    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("seller", request.object.get("seller"));

    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )}, TokenId: ${request.object.get("tokenId")}`
    );
    logger.info("Saving...");
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave("ItemCanceld", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    logger.info(`Marketplace | Query: ${query}`);
    const canceledItem = await query.first();
    logger.info(`Markeplace | CanceledItem: ${canceledItem}`);
    if (canceledItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was canaceled`
      );
      await canceledItem.destroy();
    } else {
      logger.info(
        `No item found with address ${request.object.get(
          "address"
        )} and tokenId ${request.object.get("tokenId")}`
      );
    }
  }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    const boughtItem = await query.first();
    logger.info(`Markeplace | boughtItem: ${boughtItem}`);
    if (boughtItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was bought`
      );
      await boughtItem.destroy();
    } else {
      logger.info(
        `No item found with address ${request.object.get(
          "address"
        )} and tokenId ${request.object.get("tokenId")}`
      );
    }
  }
});

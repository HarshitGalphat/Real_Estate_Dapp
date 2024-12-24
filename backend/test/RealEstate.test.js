const RealEstate = artifacts.require("RealEstate");

contract("RealEstate", (accounts) => {
  it("should list a property", async () => {
    const instance = await RealEstate.deployed();
    await instance.listProperty(accounts[0], web3.utils.toWei("1", "ether"), "My Property", "Category", "image_url", "123 Main St", "Description");
    const properties = await instance.getAllProperty();
    assert.equal(properties.length, 1, "Property was not listed correctly");
  });
});
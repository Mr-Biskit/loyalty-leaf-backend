const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Loyalty Leaf Unit Tests", function () {
          let loyaltyLeaf, deployer, vrfCoordinatorV2Mock, moddedRng

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "loyaltyLeaf"])
              loyaltyLeaf = await ethers.getContract("LoyaltyLeaf")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })

          describe("getLeafFromModdedRng", () => {
              it("should return Gold if moddedRng < 10", async function () {
                  const expectedValue = await loyaltyLeaf.getLeafFromModdedRng(3)
                  assert.equal(0, expectedValue)
              })
              it("should return Silver if moddedRng is between 10 - 30", async function () {
                  const expectedValue = await loyaltyLeaf.getLeafFromModdedRng(26)
                  assert.equal(1, expectedValue)
              })
              it("should return Bronze if moddedRng is between 30 - 60", async function () {
                  const expectedValue = await loyaltyLeaf.getLeafFromModdedRng(30)
                  assert.equal(2, expectedValue)
              })
              it("should return None if moddedRng is between 60 - 100", async function () {
                  const expectedValue = await loyaltyLeaf.getLeafFromModdedRng(61)
                  assert.equal(3, expectedValue)
              })
              it("should revert if moddedRng > 99", async function () {
                  if (loyaltyLeaf.getLeafFromModdedRng(moddedRng) > 99) {
                      await expect(loyaltyLeaf.getLeafFromModdedRng(100)).to.be.revertedWith(
                          "RangeOutOfBounds"
                      )
                  }
              })
          })
      })

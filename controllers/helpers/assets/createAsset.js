const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");

exports.createAsset = async (data, patientID, currentUser) => {
  /***
   *  submitTransaction to the createAssets in chain code
   *  args : patient ID and information  in string
   *  ! need to use JSON.stringify
   *
   */

  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(currentUser);
    if (!identity) {
      console.log(
        "An identity for the user" +
          currentUser +
          " does not exist in the wallet"
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: currentUser,
      discovery: {
        enabled: true,
        asLocalhost: true,
      },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("fabcar");

    const test = {
      value: data.value,

      FirstName: data.FirstName,
      LastName: data.LastName,
      birthday: data.birthday,
      contact: data.contact,
      address: data.address,
      bloodGroup: data.bloodGroup,
      Allergies: data.Allergies,
      Diagnosis: data.Diagnosis,
      treatment: data.treatment,
      lastVisits: data.lastVisits,
      doctorsWithpermission: data.doctorsWithpermission,
    };

    await contract.submitTransaction(
      "createAssets",
      patientID,
      `${JSON.stringify(test)}`
    );

    console.log("Transaction has been submitted");

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    throw err;
  }
};

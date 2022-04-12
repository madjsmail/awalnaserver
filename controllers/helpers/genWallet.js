const FabricCAServices = require('fabric-ca-client');

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

exports.genWallet = async (ORG, ID) => {
    /**
         * gen wallet
         */

    try {
        if (ORG == 1) {
            orgConnection = 'connection-org1.json';
            orgDomine = 'org1.example.com';
            orgCa = 'ca.org1.example.com';
            orgDepartment = 'org1.department1';
            OrgMSP = 'Org1MSP';
        }

        if (ORG == 2) {
            orgConnection = 'connection-org2.json';
            orgDomine = 'org2.example.com';
            orgCa = 'ca.org2.example.com';
            orgDepartment = 'org2.department2';
            OrgMSP = 'Org2MSP';
        }
        console.log("regster user");
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', orgDomine, orgConnection);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[orgCa].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(ID);
        if (userIdentity) {
            console.log(`An identity for the user ${ID} already exists in the wallet`);
            res.json({
                msg: `An identity for the user ${ID} already exists in the wallet`
            }).status(300);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            res.json({
                msg: 'An identity for the admin user "admin" does not exist in the wallet'
            });
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.

        const secret = await ca.register({
            affiliation: orgDepartment,
            enrollmentID: ID.toString(),
            role: 'client'
        }, adminUser);



        const enrollment = await ca.enroll({
            enrollmentID: ID,
            enrollmentSecret: secret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: OrgMSP,
            type: 'X.509',
        };
        await wallet.put(ID, x509Identity);
        console.log(`Successfully registered and enrolled admin user ${ID} and imported it into the wallet`);



    } catch (error) {

        // throw error;
        res.jason({
            err: error
        });
        return false;
    }



};
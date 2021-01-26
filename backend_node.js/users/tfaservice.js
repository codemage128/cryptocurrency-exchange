const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('_helpers/db');

module.exports = {
    setup,
    get_tfa,
    _delete,
    verify,
}
let tfa = {};
function setup(req, res) {
    // console.log(`DEBUG: Received TFA setup request`);
    // console.log("here param", req.params.uname)
    const secret = speakeasy.generateSecret({
        length: 10,
        name: req.params.uname,
        issuer: 'NarenAuth v0.0'
    });
    var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: req.params.uname,
        issuer: 'NarenAuth v0.0',
        encoding: 'base32'
    });
    // console.log('url',url)
    QRCode.toDataURL(url, async (err, dataURL) => {
  
        // commons.userObject.tfa = {
        //     secret: '',
        //     tempSecret: secret.base32,
        //     dataURL,
        //     tfaURL: url
        // };
        // console.log(dataURL);
  
        const tfa = await db.User.update({
            secret: '',
            tempSecret: secret.base32,
            dataURL,
            tfaURL: url
        },{ where: { username: req.params.uname } });

        // commons.userObject.tfa = {
        //     secret: '',
        //     tempSecret: secret.base32,
        //     dataURL,
        //     tfaURL: url
        // };
        return res.json({
            message: 'TFA Auth needs to be verified',
            tempSecret: secret.base32,
            dataURL,
            tfaURL: secret.otpauth_url
        });
    });
};

async function get_tfa(req, res) {
    // console.log(`DEBUG: Received FETCH TFA request`);
    // console.log("here username", req.params.uname);
    const user_info = await db.User.findOne({ where: { username: req.params.uname } });
    tfa = {...user_info.secret, ...user_info.tempSecret, ...user_info.tfaURL, ...user_info.dataURL};
    // console.log(tfa);
    res.json(tfa == {} ? tfa : null);
};

function _delete(req, res) {
    // console.log(`DEBUG: Received DELETE TFA request`);

    delete tfa;
    res.send({
        "status": 200,
        "message": "success"
    });
};

function verify(req, res) {
    // console.log(`DEBUG: Received TFA Verify request`);

    let isVerified = speakeasy.totp.verify({
        secret: tfa.tempSecret,
        encoding: 'base32',
        token: req.body.token
    });

    if (isVerified) {
        // console.log(`DEBUG: TFA is verified to be enabled`);

        tfa.secret = tfa.tempSecret;
        return res.send({
            "status": 200,
            "message": "Two-factor Auth is enabled successfully"
        });
    }

    // console.log(`ERROR: TFA is verified to be wrong`);

    return res.send({
        "status": 403,
        "message": "Invalid Auth Code, verification failed. Please verify the system Date and Time"
    });
};

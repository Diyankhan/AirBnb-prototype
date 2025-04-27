const Listing = require('../models/listing.js');
const initData = require('../init/data.js');

let initdb = async () => {
    initData.data = initData.data.map((obj) => ({...obj, owner : '6804fb701aef7593c1fa2da9'}));
    console.log(initData.data);
    
    await Listing.insertMany(initData.data).then((res) => {
        console.log("Insertion successfull");
    }).catch((err) => {
        console.log(err);
    });
}

initdb();
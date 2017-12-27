const {OperationHelper} = require('apac');
const dotenv = require('dotenv');

dotenv.load();

console.log(process.env.AMZ_AWSID);

const opHelper = new OperationHelper({
    awsId:     process.env.AMZ_AWSID,
    awsSecret: process.env.AMZ_API,
    assocId:   process.env.AMZ_ASSOCID,
    locale: 'CA'
});

module.exports = () => {
  return {
    searchByProduct: function(name){
      return new Promise((resolve, reject) => {
        // if(category === 'book'){
        //   let searchCategory = 'book';
        // }else{
        //   let searchCategory = 'All';
        // };
        opHelper.execute('ItemSearch', {
          'SearchIndex': 'All',
          'Keywords': name,
          'ResponseGroup': 'ItemAttributes,Offers'
        }).then((response) => {
            // console.log("Results object: ", response.result);
            // console.log("Raw response body: ", response.responseBody);
            resolve(response.result.ItemSearchResponse.Items.Item[0]);
        }).catch((err) => {
            reject(err);
        });
      })
    }
  }
}

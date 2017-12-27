const {OperationHelper} = require('apac');
const dotenv = require('dotenv');

dotenv.load();

const opHelper = new OperationHelper({
    awsId:     process.env.AMZ_AWSID,
    awsSecret: process.env.AMZ_API,
    assocId:   process.env.AMZ_ASSOCID,
    locale: 'CA'
});

var searchByProduct = function(name, category){
  if(category === 'book'){
    let searchCategory = 'book';
  }else{
    let searchCategory = 'All';
  };
  opHelper.execute('ItemSearch', {
    'SearchIndex': category,
    'Keywords': name,
    'ResponseGroup': 'ItemAttributes,Offers'
  }).then((response) => {
      console.log("Results object: ", response.result);
      console.log("Raw response body: ", response.responseBody);
      console.log(response.result.ItemSearchResponse.Items.Item);
  }).catch((err) => {
      console.error("Something went wrong! ", err);
  });
}

console.log(searchByProduct("Lord of the Rings", "book"));
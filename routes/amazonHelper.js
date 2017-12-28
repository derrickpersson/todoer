const {
  OperationHelper
} = require('apac');
const dotenv = require('dotenv');

dotenv.load();

const opHelper = new OperationHelper({
  awsId: process.env.AMZ_AWSID,
  awsSecret: process.env.AMZ_API,
  assocId: process.env.AMZ_ASSOCID,
  locale: 'CA'
});

module.exports = () => {
  return {
    searchByProduct: function(name) {
      return new Promise((resolve, reject) => {
        opHelper.execute('ItemSearch', {
          'SearchIndex': 'All',
          'Keywords': name,
          'ResponseGroup': 'ItemAttributes,Offers'
        }).then((response) => {
          resolve(response.result.ItemSearchResponse.Items.Item[0]);
        }).catch((err) => {
          reject(err);
        });
      })
    }
  }
}

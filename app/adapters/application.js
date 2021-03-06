import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  host: 'https://api.github.com',
  queryUrl: 'https://api.github.com/search',
  buildURL(modelName, id, snapshot, requestType) {
    if(requestType === 'query') {
      this.host = this.queryUrl
    }
    return this._super(...arguments);
  }
});

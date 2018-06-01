/* eslint-env node */
'use strict';

const path = require('path');
const wikidataGsocOrg = require('./wikidataGsocOrg');

module.exports = {
  name: 'gsoc-org',
  preBuild: function () {
    const fetch = this.project.require('node-fetch');
    const fs = this.project.require('fs-extra');
    if(this.app.env == 'production') {
      const orgPath = path.join(this.app.project.root, 'app',
        'data', 'organizations.js');

      return wikidataGsocOrg(fetch).then((data) =>{
        const orgDefinition = "export default " + JSON.stringify(data);
        fs.writeFile(orgPath, orgDefinition);
      });

    } else {
      return true;
    }
  },
  isDevelopingAddon() {
    return true;
  }
};

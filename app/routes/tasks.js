import {computed} from '@ember/object';
import Route from '@ember/routing/route';
import {inject} from '@ember/service';

export default Route.extend({
  // services
  github: inject(),
  organizations: inject(),
  store: inject(),

  queryParams: {
    org: {
      refreshModel: true,
    },
  },

  beforeModel(transition) {
    this.set('currentOrg', transition.queryParams['org']);
  },

  setupController(controller) {
    controller.set('currentOrg', this.get('currentOrg'));
  }
});

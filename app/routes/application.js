import {inject} from '@ember/service';
import Route from '@ember/routing/route';
import organizationList from '../organizations';

export default Route.extend({
  // services
  userSettings: inject(),
  actions: {
    searchIssues(query) {
      this.transitionTo('issues', { queryParams: { q: query} });
    }
  },
  model(params) {
    return params;
  },
  queryParams: {
    q: {
      refreshModel: true
    }
  },
  setupController(controller, model) {
    controller.set('organizations', organizationList);
    controller.set('searchParams', model.q);
    // show modal when user has no github token
    if(!this.userSettings.get('githubTokenModalSeen'))
      controller.set('showModal', !this.userSettings.tokens.get('github_com'));
    this._super(controller, model);
  }

});

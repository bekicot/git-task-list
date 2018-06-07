import EmberObject, { computed } from '@ember/object';
import Service from '@ember/service';
import organizations from '../data/organizations';

export default Service.extend({
  init(...args) {
    this._super(...args);
    this.organizations = EmberObject.create(organizations);
  },

  list: computed('organizations', function getOrganizationList() {
    return this.organizations;
  }),

  fetch(slug) {
    return this.organizations.get(slug);
  },

  fetchGitlabProjects(slug) {
    const { trackers } = this.fetch(slug);
    if (!trackers) {
      return [];
    }
    return trackers.reduce((previous, tracker) => {
      if (tracker.type === 'gitlab') {
        return [...previous, tracker.identifier];
      }
      return previous;
    }, []);
  },

});

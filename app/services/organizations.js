import Object, {computed} from '@ember/object';
import Service from '@ember/service';
import organizations from '../data/organizations';

export default Service.extend({
  init() {
    this._super(...arguments);
    this.organizations = Object.create(organizations);
  },

  list: computed('organizations', function() {
    return this.organizations;
  }),

  fetch(slug) {
    return this.organizations.get(slug);
  },
});

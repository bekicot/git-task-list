import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  gitlab: inject(),
  store: inject(),
  organizations: inject(),

  model(params, transition) {
    const { org } = transition.queryParams;
    const store = this.get('store');
    const projects = this.get('organizations').fetchGitlabProjects(org);
    if (projects.length > 0) {
      return this.get('gitlab').tasks({ projects }).then((data) => {
        data.forEach((task) => {
          store.pushPayload('gitlab-task', task);
        });
        return store.peekAll('gitlab-task');
      });
    }
    return [];
  },
});

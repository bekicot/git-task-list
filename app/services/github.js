import Service, {inject} from '@ember/service';
import {GraphQLClient} from 'graphql-request';
import {tasksQuery, queryBuilder} from '../graphql/github';

export default Service.extend({
  userSettings: inject(),
  githubUrl: 'https://api.github.com/graphql',

  init() {
    this._super(...arguments);
    this.client = new GraphQLClient(this.get('githubUrl'), {
      headers: {
        Authorization: 'bearer ' + this.userSettings.tokens.get('github_com'),
      },
    });
  },

  tasks(context) {
    const transform = (response) => {
      return response.search.nodes.map((node) => {
        node.type = 'github-task';
        return node;
      });
    };
    const request = this.client.request(
      tasksQuery, { 'searchQuery' : queryBuilder(context) }
    );
    request.catch((e) => {
      e.payload = Object.assign((e.payload || {}), {service: 'github'});
      throw e;
    });
    return request.then(transform);
  },
});

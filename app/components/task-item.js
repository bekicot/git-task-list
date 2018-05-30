import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
  },
  didInsertElement() {
    this.$().linkify({
      validate: {
        url: function (value) {
          return /^(http|ftp)s?:\/\//.test(value);
        },
      },
      formatHref: function (href, type) {
        if (type === 'mention') {
          href = 'https://github.com/' +
            href.substring(1);
        }
        return href;
      },
    });
  },
});

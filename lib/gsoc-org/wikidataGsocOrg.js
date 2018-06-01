const ENDPOINT = "https://query.wikidata.org/sparql?format=json&query=";
const QUERY = `
SELECT DISTINCT ?orgLabel ?githubUsername
WHERE {
  ?org wdt:P1344 wd:Q54276825.
  ?org wdt:P2037 ?githubUsername
  SERVICE wikibase:label { bd:serviceParam wikibase:language "id,en". }
} ORDER BY ?orgLabel
`

module.exports = function(fetch) {
  const toJson = (res) => {
    return res.json();
  };
  const format = (json) => {
    const mapToCompatibleOrg = (item) => {
      return {
        name: item['orgLabel']['value'],
        trackers: [
          {
            type: 'github',
            identifier: item['githubUsername']['value']
          }
        ]
      }
    }
    const toObject = (object, item) => {
      return Object.assign(object, { [item['name']]: item});
    }
    return json['results']['bindings']
      .map(mapToCompatibleOrg)
      .reduce(toObject, {});
  };
  return fetch(ENDPOINT + encodeURIComponent(QUERY)).then(toJson).then(format);
}
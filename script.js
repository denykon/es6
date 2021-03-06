const KEY = '4f434f30b5914ed3848816519ea7f33a';
const URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const SITE_URL = 'http://www.nytimes.com/';

let results;
let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', () => {
  var req = createRequest();
  fetch(req)
    .then(handleErrors)
    .then(res => res.json())
    .then(json => {
      results = json.response.docs;
      insertInnerText('footer', json.copyright);
      clearResults();
      results.forEach(createArticle);
    })
    .catch(err => console.error(err));
});

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function createRequest() {
  return `${URL}?api-key=${KEY}&${getSearchData()}`;
}

function getSearchData() {
  let data = {};
  let highlightingBox = document.querySelector('input[type="checkbox"]:checked');
  data.q = getElementValue('search');
  data.fq = getElementValue('filter');
  // data.begin_date = getElementValue('begin_date');
  // data.end_date = getElementValue('end_date');
  data.sort = getElementValue('sort');
  data.hl = (highlightingBox) ? true : '';
  data.page = getElementValue('page');
  return Object.keys(data).filter((k) => (data[k] !== '')).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  ).join('&');
}

function createArticle(data) {
  let li = document.createElement('li');
  let headline = document.createElement('h3');
  let img = document.createElement('img');
  let pubDate = document.createElement('div');
  let sectionName = document.createElement('div');
  let vebUrl = document.createElement('a');

  headline.innerHTML = data.headline.main;
  if (data.multimedia && data.multimedia[1]) {
    img.setAttribute('src', `${SITE_URL}${(data.multimedia)[1].url}`);
  }
  pubDate.innerHTML = new Date(data.pub_date).toLocaleString('en-US', {hour12: false});
  sectionName.innerHTML = data.section_name;
  vebUrl.setAttribute('href', data.web_url);
  vebUrl.innerHTML = `Read The Article: ${data.web_url}`;

  li.appendChild(headline);
  li.appendChild(img);
  li.appendChild(pubDate);
  li.appendChild(sectionName);
  li.appendChild(vebUrl);

  document.getElementById('resultList').appendChild(li);
}

function insertInnerText(id, text) {
  let element = document.getElementById(id);
  element.innerHTML = text;
}

function getElementValue(name) {
  let val = document.getElementsByName(name)[0].value;
  return (val) ? val : '';
}

function clearResults() {
  let mainNode = document.getElementById('resultList');
  while (mainNode.firstChild) {
    mainNode.removeChild(mainNode.firstChild);
  }
}
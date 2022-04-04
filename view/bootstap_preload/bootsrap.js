const link = document.createElement('link');
const attrs = {
	href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
	rel: 'stylesheet',
	integrity: '1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3',
	crossorigin: 'anonymous',
};

Object.keys(attrs).forEach((attr) => link.setAttribute(attr, attrs[attr]));
document.getElementsByTagName('head')[0].insertAdjacentElement('afterbegin', link);

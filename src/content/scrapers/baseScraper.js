export default class BaseScraper {
  constructor() {
    this.data = [];
  }

  scrape() {
    throw new Error('scrape() must be implemented by subclass');
  }

  extractText(element) {
    return element?.textContent?.trim() || '';
  }

  extractAttribute(element, attribute) {
    return element?.getAttribute(attribute) || '';
  }
}
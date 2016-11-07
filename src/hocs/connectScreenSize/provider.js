import medias, { greaterThanMedias } from './medias';

class Provider {
  constructor() {
    this.listeners = []
    this.setup();
  }

  getScreenSize() {
    return this.screenSize;
  }

  bootstrap() {
    this.mediaQueryLists = {};

    Object.keys(medias).forEach((query) => {
      this.mediaQueryLists[medias[query]] = matchMedia(query);
    });

    Object.keys(greaterThanMedias).forEach((query) => {
      this.mediaQueryLists[medias[query]].addListener(() => this.update());
    });

    this.update();
  }

  setup({ mobile, tablet } = {}) {
    const isMobile = mobile;
    const isTablet = !isMobile && tablet;
    const isDesktop = !isMobile && !isTablet;
    this.screenSize = {
      'mobile':   isMobile,
      '> mobile': isTablet || isDesktop,
      'small':    isTablet,
      '> small':  isDesktop,
      'medium':   isDesktop,
      '> medium': isDesktop,
      'large':    false,
      '> large':  false
    }
  }

  update() {
    Object.keys(this.screenSize).forEach((key) => {
      this.screenSize[key] = this.mediaQueryLists[key].matches;
    });
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
  }
}

const provider = new Provider();

if (typeof window !== 'undefined') {
  provider.bootstrap();
}

export default provider;

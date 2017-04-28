import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { url } from '../../helpers/constants';

@Injectable()
export class MetaService {
  constructor(private meta: Meta) {}

  public addTags(
    item: boolean = false,
    id?: string,
    name?: string,
    description?: string,
    price?: string
  ) {
    this.removeTags();

    if (item) {
      this.meta.addTags([
        { itemprop: 'name', content: name },
        { itemprop: 'description', content: description },
        { itemprop: 'image', content: `${url}/assets/products/${id}` },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: name },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: `${url}/assets/products/${id}` },

        { name: 'og:title', content: name },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: `${url}/products/product/${id}` },
        { name: 'og:image', content: `${url}/assets/products/${id}` },
        { name: 'og:image:secure_url', content: `${url}/assets/products/${id}` },
        { name: 'og:image:width', content: '300' },
        { name: 'og:image:height', content: '300' },
        { name: 'og:description', content: description },
        { name: 'og:site_name', content: 'Inkie\'s webshop' },
        { name: 'og:price:amount', content: price },
        { name: 'og:price:currency', content: 'EUR' },
      ]);
    } else {
      this.meta.addTags([
        { itemprop: 'name', content: 'Inkie\'s webshop' },
        // TODO:Edit
        { itemprop: 'description', content: 'TODO' },
        { itemprop: 'image', content: `${url}/assets/products/${id}` },

        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Inkie\'s webshop' },
        // TODO:Edit
        { name: 'twitter:description', content: 'TODO' },
        { name: 'twitter:image', content: `${url}/assets/products/${id}` },

        { name: 'og:title', content: 'Inkie\'s webshop' },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: url },
        { name: 'og:image', content: `${url}/assets/icons/android-chrome-512x512.png` },
        { name: 'og:image:secure_url', content: `${url}/assets/icons/android-chrome-512x512.png` },
        { name: 'og:image:width', content: '512' },
        { name: 'og:image:height', content: '512' },
        // TODO:Edit
        { name: 'og:description', content: 'TODO' },
        { name: 'og:site_name', content: 'Inkie\'s webshop' }
      ]);
    }
  }

  public removeTags() {
    this.meta.removeTag('itemprop=\'name\'');
    this.meta.removeTag('itemprop=\'description\'');
    this.meta.removeTag('itemprop=\'image\'');

    this.meta.removeTag('name=\'twitter:card\'');
    this.meta.removeTag('name=\'twitter:title\'');
    this.meta.removeTag('name=\'twitter:description\'');
    this.meta.removeTag('name=\'twitter:image\'');

    this.meta.removeTag('name=\'og:title\'');
    this.meta.removeTag('name=\'og:type\'');
    this.meta.removeTag('name=\'og:url\'');
    this.meta.removeTag('name=\'og:image\'');
    this.meta.removeTag('name=\'og:image:secure_url\'');
    this.meta.removeTag('name=\'og:image:width\'');
    this.meta.removeTag('name=\'og:image:height\'');
    this.meta.removeTag('name=\'og:description\'');
    this.meta.removeTag('name=\'og:site_name\'');
    this.meta.removeTag('name=\'og:price:amount\'');
    this.meta.removeTag('name=\'og:price:currency\'');
  }
}

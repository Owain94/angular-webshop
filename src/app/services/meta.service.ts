import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';

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
      this.meta.addTag(<MetaDefinition> { itemprop: 'name', content: name });
      this.meta.addTag(<MetaDefinition> { itemprop: 'description', content: description });
      this.meta.addTag(<MetaDefinition> { itemprop: 'image', content: `${url}/assets/products/${id}` });

      this.meta.addTag(<MetaDefinition> { name: 'twitter:card', content: 'summary' });
      this.meta.addTag(<MetaDefinition> { name: 'twitter:title', content: name });
      this.meta.addTag(<MetaDefinition> { name: 'twitter:description', content: description });
      this.meta.addTag(<MetaDefinition> { name: 'twitter:image', content: `${url}/assets/products/${id}` });

      this.meta.addTag(<MetaDefinition> { name: 'og:title', content: name });
      this.meta.addTag(<MetaDefinition> { name: 'og:type', content: 'website' });
      this.meta.addTag(<MetaDefinition> { name: 'og:url', content: `${url}/products/product/${id}` });
      this.meta.addTag(<MetaDefinition> { name: 'og:image', content: `${url}/assets/products/${id}` });
      this.meta.addTag(<MetaDefinition> { name: 'og:image:secure_url', content: `${url}/assets/products/${id}` });
      this.meta.addTag(<MetaDefinition> { name: 'og:image:width', content: '300' });
      this.meta.addTag(<MetaDefinition> { name: 'og:image:height', content: '300' });
      this.meta.addTag(<MetaDefinition> { name: 'og:description', content: description });
      this.meta.addTag(<MetaDefinition> { name: 'og:site_name', content: 'Inkie\'s webshop' });
      this.meta.addTag(<MetaDefinition> { name: 'og:price:amount', content: price });
      this.meta.addTag(<MetaDefinition> { name: 'og:price:currency', content: 'EUR' });
    } else {
      this.meta.addTag(<MetaDefinition> { itemprop: 'name', content: 'Inkie\'s webshop' });
      // TODO:Edit
      this.meta.addTag(<MetaDefinition> { itemprop: 'description', content: 'TODO' });
      this.meta.addTag(<MetaDefinition> { itemprop: 'image', content: `${url}/assets/products/${id}` });

      this.meta.addTag(<MetaDefinition> { name: 'twitter:card', content: 'summary' });
      this.meta.addTag(<MetaDefinition> { name: 'twitter:title', content: 'Inkie\'s webshop' });
      // TODO:Edit
      this.meta.addTag(<MetaDefinition> { name: 'twitter:description', content: 'TODO' });
      this.meta.addTag(<MetaDefinition> { name: 'twitter:image', content: `${url}/assets/products/${id}` });

      this.meta.addTag(<MetaDefinition> { name: 'og:title', content: 'Inkie\'s webshop' });
      this.meta.addTag(<MetaDefinition> { name: 'og:type', content: 'website' });
      this.meta.addTag(<MetaDefinition> { name: 'og:url', content: url });
      this.meta.addTag(<MetaDefinition> { name: 'og:image', content: `${url}/assets/icons/android-chrome-512x512.png` });
      this.meta.addTag(<MetaDefinition> { name: 'og:image:secure_url', content: `${url}/assets/icons/android-chrome-512x512.png` });
      this.meta.addTag(<MetaDefinition> { name: 'og:image:width', content: '512' });
      this.meta.addTag(<MetaDefinition> { name: 'og:image:height', content: '512' });
      // TODO:Edit
      this.meta.addTag(<MetaDefinition> { name: 'og:description', content: 'TODO' });
      this.meta.addTag(<MetaDefinition> { name: 'og:site_name', content: 'Inkie\'s webshop' });
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

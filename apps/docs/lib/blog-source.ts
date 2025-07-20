import { blogs } from '@/.source';
import { loader } from 'fumadocs-core/source';

// Blog source configuration
export const blogSource = loader({
  baseUrl: '/blog',
  source: blogs.toFumadocsSource(),
}); 
'use client';

import { api } from '@/lib/api';
import { commaListToArray, formChecked, formNumber, formValue } from '@/lib/admin';
import { todayIso } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import type { Article, ArticlePayload, ArticleSummary } from '@/types';
import { AppImage } from '@/components/shared/AppImage';
import { CheckboxField, SelectField, TextAreaField, TextField } from '../fields';
import { CrudTab, type CrudConfig } from '../CrudTab';

const DEFAULT_CATEGORIES = ['History', 'Archaeology', 'Culture', 'Culinary', 'Travel Guide'];
const FIELDS = ['title', 'category', 'author', 'excerpt', 'content', 'image', 'tags', 'readMinutes', 'publishedAt'] as const;

type Row = ArticleSummary & Partial<Pick<Article, 'content'>>;
interface Context { categories: string[] }

export function ArticlesTab() {
  const { formatDate } = useI18n();

  const config: CrudConfig<Row, Context, ArticlePayload> = {
    singular: 'article',
    fieldNames: FIELDS,
    load: async () => (await api.articles.list({ limit: 100 })).items,
    loadContext: async () => {
      const { categories } = await api.articles.categories();
      return { categories: [...new Set([...DEFAULT_CATEGORIES, ...categories.map((category) => category.name)])] };
    },
    // The list only has summaries; the form needs the full text.
    loadDetail: (item) => api.articles.get(item.slug),
    columns: () => [
      {
        label: 'Article',
        render: (row) => (
          <div className="cell-media">
            <AppImage src={row.image} width={64} height={44} />
            <div><strong>{row.title}</strong><span className="cell-sub">{row.author}</span></div>
          </div>
        ),
      },
      { label: 'Category', render: (row) => <span className="tag tag--primary">{row.category}</span> },
      { label: 'Published', render: (row) => formatDate(row.publishedAt) },
      { label: 'Featured', render: (row) => (row.isFeatured ? <span className="status status--success">Featured</span> : '—') },
    ],
    renderFields: (item, { categories }, errors) => (
      <>
        <TextField name="title" label="Title" defaultValue={item?.title} required error={errors.title} />
        <div className="form__row">
          <SelectField
            name="category"
            label="Category"
            defaultValue={item?.category ?? categories[0]}
            required
            options={categories.map((value) => ({ value, label: value }))}
            error={errors.category}
          />
          <TextField name="author" label="Author" defaultValue={item?.author ?? 'Lawas Journeys Editorial'} error={errors.author} />
        </div>
        <TextAreaField name="excerpt" label="Excerpt" defaultValue={item?.excerpt} rows={2} hint="One or two sentences shown on cards." error={errors.excerpt} />
        <TextAreaField name="content" label="Article text" defaultValue={item?.content} rows={10} required hint="Leave a blank line between paragraphs." error={errors.content} />
        <TextField name="image" label="Image path" defaultValue={item?.image} placeholder="assets/images/articles/my-article.jpg" error={errors.image} />
        <TextField name="tags" label="Tags" defaultValue={item?.tags?.join(', ')} placeholder="Borobudur, UNESCO, Heritage" hint="Separate with commas (maximum 8)." error={errors.tags} />
        <div className="form__row form__row--3">
          <TextField name="readMinutes" label="Reading time (minutes)" type="number" min={1} defaultValue={item?.readMinutes ?? ''} error={errors.readMinutes} />
          <TextField name="publishedAt" label="Publish date" type="date" defaultValue={item?.publishedAt?.slice(0, 10) ?? todayIso()} error={errors.publishedAt} />
          <CheckboxField name="isFeatured" label="Featured story" defaultChecked={item?.isFeatured} />
        </div>
      </>
    ),
    toPayload: (data) => ({
      title: formValue(data, 'title'),
      category: formValue(data, 'category'),
      author: formValue(data, 'author'),
      excerpt: formValue(data, 'excerpt'),
      content: formValue(data, 'content'),
      image: formValue(data, 'image'),
      tags: commaListToArray(formValue(data, 'tags')),
      readMinutes: formNumber(data, 'readMinutes'),
      publishedAt: formValue(data, 'publishedAt'),
      isFeatured: formChecked(data, 'isFeatured'),
    }),
    api: api.articles,
    itemLabel: (item) => item.title,
  };

  return <CrudTab config={config} />;
}

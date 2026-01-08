import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Content Manager',
      favicon: 'https://emojicdn.elk.sh/📚',
    },
  },
  collections: [
    // Users Collection
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
        },
      ],
    },

    // Media Collection for uploads
    {
      slug: 'media',
      admin: {
        group: 'Content',
      },
      upload: {
        staticDir: path.resolve(dirname, '../media'),
        mimeTypes: ['image/*', 'video/*'],
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
        },
      ],
    },

    // Applications Collection
    {
      slug: 'applications',
      admin: {
        useAsTitle: 'name',
        group: 'Content',
        defaultColumns: ['name', 'category', 'status', 'createdAt'],
      },
      access: {
        read: () => true, // Public read access
      },
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Basic Info',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'App Name',
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'App Slug (folder name)',
                  admin: {
                    description: 'Used in URL: sloppy.live/[slug]',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (emoji)',
                  defaultValue: '📱',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Short Description',
                  maxLength: 200,
                },
                {
                  name: 'category',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Game', value: 'game' },
                    { label: 'Tool', value: 'tool' },
                    { label: 'Art', value: 'art' },
                    { label: 'Other', value: 'other' },
                  ],
                  defaultValue: 'other',
                },
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  options: [
                    { label: '✅ Active', value: 'active' },
                    { label: '🚧 In Development', value: 'development' },
                    { label: '⚠️ Deprecated', value: 'deprecated' },
                    { label: '🔧 Maintenance', value: 'maintenance' },
                  ],
                  defaultValue: 'active',
                },
                {
                  name: 'liveUrl',
                  type: 'text',
                  label: 'Live URL',
                  admin: {
                    description: 'Full URL to the live application',
                  },
                },
              ],
            },
            {
              label: 'Documentation',
              fields: [
                {
                  name: 'documentation',
                  type: 'richText',
                  editor: lexicalEditor({}),
                  label: 'Full Documentation',
                },
                {
                  name: 'installInstructions',
                  type: 'richText',
                  editor: lexicalEditor({}),
                  label: 'Installation Instructions',
                },
                {
                  name: 'usageGuide',
                  type: 'richText',
                  editor: lexicalEditor({}),
                  label: 'Usage Guide',
                },
              ],
            },
            {
              label: 'Features & Tech',
              fields: [
                {
                  name: 'features',
                  type: 'array',
                  label: 'Key Features',
                  fields: [
                    {
                      name: 'feature',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                  ],
                },
                {
                  name: 'technologies',
                  type: 'array',
                  label: 'Technologies Used',
                  fields: [
                    {
                      name: 'tech',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'version',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'apiEndpoints',
                  type: 'array',
                  label: 'API Endpoints',
                  fields: [
                    {
                      name: 'endpoint',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'method',
                      type: 'select',
                      options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Media',
              fields: [
                {
                  name: 'featuredImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Featured Image',
                },
                {
                  name: 'screenshots',
                  type: 'array',
                  label: 'Screenshots',
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'videoDemo',
                  type: 'text',
                  label: 'Video Demo URL',
                },
              ],
            },
            {
              label: 'Meta',
              fields: [
                {
                  name: 'githubRepo',
                  type: 'text',
                  label: 'GitHub Repository',
                },
                {
                  name: 'contributors',
                  type: 'array',
                  label: 'Contributors',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                    },
                    {
                      name: 'role',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'tags',
                  type: 'array',
                  label: 'Tags',
                  fields: [
                    {
                      name: 'tag',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Pages Collection
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        group: 'Content',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'published',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/content-manager',
  }),
  cors: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3001', 'http://localhost:3000'],
  csrf: process.env.CSRF_ORIGINS ? process.env.CSRF_ORIGINS.split(',') : ['http://localhost:3001', 'http://localhost:3000'],
})

import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'yq7gabb5' ,
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'skT18MONloKK4CyC1aNCJRVkigWHpkjMJgTMs8kwn5ZG4NqRJ0vHnmezueaj34oNKmt0wUZSvRvuql9DC2fKrplvxJ6pxIfEGVCaHZSfmh5wxc62nAgkCcHV6597VrY3AVRRzJQe6zdumG2JKxLLMllCeSLnHtjx7PLFhnZmZcwNgNXIiw5Z',
  useCdn: false,
})

import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: '6pcp9wya',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'skW2wdRFWv3RZahVgE8ZofpxeH6AZIEQI5QHHRDQ5oauzkcCrFbjnTbj10Y1J3lQy3Hbci9Ij0Rakg9KXFDEgqNDqnfHD2NUMGCx8b3yKLBZj24BSfMKsnFngIYcShsSPJ5pYErfa6dwdyCiLgrxTbuLE5yEIUrhaUD29FR7nFHTaxuQhpSC',
  useCdn: false,
})

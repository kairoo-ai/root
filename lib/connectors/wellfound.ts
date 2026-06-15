import type { Connector, ConnectorResult } from './types'

const WELLFOUND_URL_PATTERN = /^https?:\/\/(?:www\.)?(?:wellfound\.com|angel\.co)\//i

export const connector: Connector = {
  id: 'wellfound',
  name: 'Wellfound',
  description: 'Save your Wellfound (formerly AngelList) profile URL for startup job matching.',
  website: 'https://wellfound.com',
  category: 'professional',
  inputType: 'url',
  inputLabel: 'Wellfound / AngelList profile URL',
  inputPlaceholder: 'https://wellfound.com/u/yourname',
  isAutoFetch: false,

  async run(input: string): Promise<ConnectorResult> {
    const url = input.trim()

    if (!url) {
      return {
        success: false,
        source: 'wellfound',
        extracted: {},
        summary: '',
        error: 'Please provide your Wellfound or AngelList profile URL.',
      }
    }

    if (!WELLFOUND_URL_PATTERN.test(url)) {
      return {
        success: false,
        source: 'wellfound',
        extracted: {},
        summary: '',
        error:
          'The URL does not appear to be a valid Wellfound or AngelList profile link. It should start with https://wellfound.com/ or https://angel.co/.',
      }
    }

    return {
      success: true,
      source: 'wellfound',
      extracted: {
        portfolioUrl: url,
      },
      summary: 'Wellfound profile URL saved.',
    }
  },
}

export default connector

// Have to use `var` here to avoid "Temporal Dead Zone" issues
var mockWebAppPath = ''

import fs from 'fs'

import '../../../../lib/mockTelemetry'

import { addConfigToApp } from '../auth'

jest.mock('../../../../lib', () => {
  const path = require('path')
  const __dirname = path.resolve()

  return {
    getPaths: () => ({
      api: { functions: '', src: '', lib: '' },
      web: {
        src: path.join(__dirname, '../create-redwood-app/template/web/src'),
        app: path.join(
          __dirname,
          mockWebAppPath || '../create-redwood-app/template/web/src/App.tsx'
        ),
      },
    }),
  }
})

jest.mock('../../../../lib/project', () => ({
  isTypeScriptProject: () => false,
}))

// This function checks output matches
const writeFileSyncSpy = jest.fn((_, content) => {
  // Line breaks cause an issue on windows snapshots
  expect(content).toMatchSnapshot()
})

beforeEach(() => {
  mockWebAppPath = ''
  jest.restoreAllMocks()
  jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFileSyncSpy)
})

describe('Should add config lines to App.{js,tsx}', () => {
  it('Matches Auth0 Snapshot', async () => {
    const auth0Data = await import(`../providers/auth0`)
    await addConfigToApp(auth0Data.config, false)
  })

  it('Matches Firebase Snapshot', async () => {
    const firebaseData = await import(`../providers/firebase`)
    await addConfigToApp(firebaseData.config, false)
  })

  it('Matches netlify Snapshot', async () => {
    const netlifyData = await import(`../providers/netlify`)
    await addConfigToApp(netlifyData.config, false)
  })

  it('Matches goTrue Snapshot', async () => {
    const goTrueData = await import(`../providers/goTrue`)
    await addConfigToApp(goTrueData.config, false)
  })

  it('Matches azureActiveDirectory Snapshot', async () => {
    const azureActiveDirectoryData = await import(
      `../providers/azureActiveDirectory`
    )
    await addConfigToApp(azureActiveDirectoryData.config, false)
  })

  it('Matches ethereum Snapshot', async () => {
    const ethereumData = await import(`../providers/ethereum`)
    await addConfigToApp(ethereumData.config, false)
  })

  it('Matches magicLink Snapshot', async () => {
    const magicLinkData = await import(`../providers/magicLink`)
    await addConfigToApp(magicLinkData.config, false)
  })

  it('Matches supabase Snapshot', async () => {
    const supabaseData = await import(`../providers/supabase`)
    await addConfigToApp(supabaseData.config, false)
  })

  it('Matches nhost Snapshot', async () => {
    const nhostData = await import(`../providers/nhost`)
    await addConfigToApp(nhostData.config, false)
  })
})

describe('Should add config lines when RedwoodApolloProvider has props', () => {
  it('Matches Auth0 Snapshot', async () => {
    mockWebAppPath =
      'src/commands/setup/auth/__tests__/fixtures/AppWithCustomRedwoodApolloProvider.js'

    const auth0Data = await import(`../providers/auth0`)
    await addConfigToApp(auth0Data.config, false)
  })
})

describe('Should add auth config when using explicit return', () => {
  it('Matches Auth0 Snapshot', async () => {
    mockWebAppPath =
      'src/commands/setup/auth/__tests__/fixtures/AppWithExplicitReturn.js'

    const auth0Data = await import(`../providers/auth0`)
    await addConfigToApp(auth0Data.config, false)
  })
})

describe('Should add auth config when app is missing RedwoodApolloProvider', () => {
  it('Matches Auth0 Snapshot', async () => {
    mockWebAppPath =
      'src/commands/setup/auth/__tests__/fixtures/AppWithoutRedwoodApolloProvider.js'

    const auth0Data = await import(`../providers/auth0`)
    await addConfigToApp(auth0Data.config, false)
  })
})

export const urls = {
  /** Posts tab in general channel of Switchboard team */
  help:
    'https://teams.microsoft.com/l/channel/19%3a847ddf12dcee4e27adb9c0ff6ab68aa5%40thread.skype/General?groupId=da3b2d71-1ea2-48e2-af0e-cc54e80c1a85&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47',
  /** Wiki tab in General channel of Switchboard team */
  documentation:
    'https://teams.microsoft.com/l/channel/19%3A847ddf12dcee4e27adb9c0ff6ab68aa5%40thread.skype/tab%3A%3A3fef7993-6e02-4497-b98b-f66046a2526d?groupId=da3b2d71-1ea2-48e2-af0e-cc54e80c1a85&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47',
  release: 'https://github.com/chuanqisun/switchboard/releases',
  getEnvironmentsEndpoint: 'https://microsoft.sharepoint.com/teams/Live.Drive.Repeat2/Shared%20Documents/General/Environments/environments-v2.txt',
  editEnvironmentsEndpoint:
    'https://microsoft.sharepoint.com/teams/Live.Drive.Repeat2/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x0120000E164B167C03A34684DF87C19D94BF49&id=%2Fteams%2FLive%2EDrive%2ERepeat2%2FShared%20Documents%2FGeneral%2FEnvironments%2Fenvironments%2Dv2%2Etxt&parent=%2Fteams%2FLive%2EDrive%2ERepeat2%2FShared%20Documents%2FGeneral%2FEnvironments&p=5',
  getMetadataEndpoint: 'https://microsoft.sharepoint.com/teams/Live.Drive.Repeat2/Shared%20Documents/General/Metadata/metadata.txt',
  latestRelease: 'https://github.com/chuanqisun/switchboard/releases/latest',
  assetsRoot: 'https://switchboard-assets.netlify.com',
};

/**
 * https://github.com/puppeteer/puppeteer/releases
 * TODO: based on the installed version of puppeteer, get matching version of chromium
 */
export const chromium = {
  revision: '722234',
  publicVersion: '80.0.3987.0',
};

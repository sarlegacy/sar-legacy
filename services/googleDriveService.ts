// Fix: Add type definitions for gapi and google since they are loaded from a script tag.
declare namespace google {
    namespace accounts {
        namespace oauth2 {
            function initTokenClient(config: TokenClientConfig): TokenClient;
            function revoke(token: string, callback: () => void): void;

            interface TokenClient {
                requestAccessToken: (overrideConfig: { prompt: string }) => void;
            }

            interface TokenClientConfig {
                client_id: string;
                scope: string;
                callback: (tokenResponse: TokenResponse) => void;
            }

            interface TokenResponse {
                access_token: string;
                error?: string;
            }
        }
    }
}
declare namespace gapi {
    function load(api: string, callback: () => void): void;
    namespace client {
        function init(args: { apiKey?: string; discoveryDocs: string[] }): Promise<void>;
        function getToken(): { access_token: string } | null;
        function setToken(token: { access_token: string } | null): void;
        function request(args: any): Promise<any>;
        namespace drive {
            namespace files {
                function list(args: any): Promise<{ result: { files?: { id: string; name: string }[] } }>;
                function create(args: any): Promise<{ result: { id?: string } }>;
                function get(args: any): Promise<{ body: string }>;
            }
        }
    }
}

import { AppData } from '../types.ts';

// Fix: The GOOGLE_CLIENT_ID environment variable is not set in this environment.
// A placeholder is provided to prevent initialization errors.
// For a functional Google Drive integration, a developer would need to replace this
// with an actual Client ID, ideally through a build process that handles environment variables.
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    console.warn("Warning: The GOOGLE_CLIENT_ID environment variable is not set. Using a placeholder for initialization. Google Drive integration will not be functional until a valid ID is provided.");
}

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const APP_DATA_FILE_NAME = 'sar-legacy-ai-data.json';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;
let updateAuthStatusCallback: ((isSignedIn: boolean) => void) | null = null;

// Use promises to ensure we only initialize once and can await it.
let gapiInitPromise: Promise<void> | null = null;
let gisInitPromise: Promise<void> | null = null;

/**
 *  Initializes the GAPI client by waiting for the gapi object to be available.
 */
function gapiInit(): Promise<void> {
    if (gapiInitPromise) return gapiInitPromise;

    gapiInitPromise = new Promise((resolve, reject) => {
        const checkGapi = () => {
            // Fix: Use gapi directly to leverage declared namespace
            if (gapi && gapi.load) {
                clearInterval(interval);
                clearTimeout(timeout);
                gapi.load('client', () => {
                    gapi.client.init({
                        discoveryDocs: DISCOVERY_DOCS,
                    })
                    .then(() => {
                        gapiInited = true;
                        resolve();
                    })
                    .catch(reject);
                });
            }
        };

        const interval = setInterval(checkGapi, 100);
        const timeout = setTimeout(() => {
            clearInterval(interval);
            reject(new Error("GAPI script did not load in time."));
        }, 5000); // 5-second timeout
    });
    return gapiInitPromise;
}

/**
 *  Initializes the GIS client by waiting for the google object to be available.
 */
function gisInit(): Promise<void> {
    if (gisInitPromise) return gisInitPromise;
    
    gisInitPromise = new Promise((resolve, reject) => {
        const checkGis = () => {
            // Fix: Use google directly to leverage declared namespace
            if (google && google.accounts) {
                clearInterval(interval);
                clearTimeout(timeout);
                try {
                    tokenClient = google.accounts.oauth2.initTokenClient({
                        client_id: CLIENT_ID,
                        scope: SCOPES,
                        callback: (tokenResponse) => {
                            if (tokenResponse.error) {
                                console.error("Token Error:", tokenResponse.error);
                                if (updateAuthStatusCallback) {
                                    updateAuthStatusCallback(false);
                                }
                                return;
                            }
                            // FIX: The GAPI client must be given the access token to authorize API calls.
                            gapi.client.setToken({ access_token: tokenResponse.access_token });
                            if (updateAuthStatusCallback) {
                                updateAuthStatusCallback(true);
                            }
                        },
                    });
                    gisInited = true;
                    resolve();
                } catch(e) {
                    reject(e);
                }
            }
        };

        const interval = setInterval(checkGis, 100);
        const timeout = setTimeout(() => {
            clearInterval(interval);
            reject(new Error("Google Identity Services script did not load in time."));
        }, 5000); // 5-second timeout
    });
    return gisInitPromise;
}

/**
 * Initializes both GAPI and GIS clients.
 */
export async function initClient(updateCallback: (isSignedIn: boolean) => void) {
    updateAuthStatusCallback = updateCallback;
    // The Promise.all will now wait for the resilient init functions
    await Promise.all([gapiInit(), gisInit()]);
    // The initial sign-in state will be determined by whether gapi.client has an access token.
    // However, the gapi.client doesn't expose this directly upon load. We'll rely on the user
    // clicking the connect button to initiate the auth flow. For now, assume signed out.
    updateCallback(false);
}

/**
 *  Sign in the user.
 */
export function signIn() {
    if (!tokenClient) {
        throw new Error("Google Identity Services client not initialized.");
    }

    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Sign out the user.
 */
export function signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken(null);
            if (updateAuthStatusCallback) {
                updateAuthStatusCallback(false);
            }
        });
    }
}

/**
 * Searches for the app data file in the user's Drive.
 * 'appDataFolder' is a special folder that is hidden from the user.
 */
async function findAppFile(): Promise<string | null> {
    try {
        const response = await gapi.client.drive.files.list({
            spaces: 'appDataFolder',
            fields: 'files(id, name)',
            pageSize: 10,
        });
        const file = response.result.files?.find(f => f.name === APP_DATA_FILE_NAME);
        return file?.id || null;
    } catch (err) {
        console.error("Error finding app file:", err);
        return null;
    }
}

/**
 * Creates the app data file.
 */
async function createAppFile(): Promise<string | null> {
    try {
        const response = await gapi.client.drive.files.create({
            resource: {
                name: APP_DATA_FILE_NAME,
                parents: ['appDataFolder'],
            },
            fields: 'id',
        });
        return response.result.id || null;
    } catch (err) {
        console.error("Error creating app file:", err);
        return null;
    }
}

/**
 * Gets the content of the app data file.
 */
export async function getAppData(): Promise<AppData | null> {
    const fileId = await findAppFile();
    if (!fileId) {
        return null; // No file found, probably first time user
    }
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media',
        });
        return JSON.parse(response.body);
    } catch (err) {
        console.error("Error getting app data:", err);
        return null;
    }
}

/**
 * Saves the app data to the file in Google Drive.
 */
export async function saveAppData(data: AppData): Promise<void> {
    let fileId = await findAppFile();
    if (!fileId) {
        fileId = await createAppFile();
    }
    if (!fileId) {
        throw new Error("Could not create or find the app data file.");
    }

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';
    const metadata = {
        'mimeType': contentType,
    };

    const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        JSON.stringify(data) +
        close_delim;

    try {
        await gapi.client.request({
            'path': '/upload/drive/v3/files/' + fileId,
            'method': 'PATCH',
            'params': { 'uploadType': 'multipart' },
            'headers': {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"',
            },
            'body': multipartRequestBody,
        });
    } catch (err) {
        console.error("Error saving app data:", err);
    }
}
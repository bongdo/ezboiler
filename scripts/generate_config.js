import { readFile, writeFile } from 'fs/promises';

async function generate() {
    try {
        const env = await readFile('../frontend/.env.local', 'utf-8');
        const lines = env.split('\n');
        const config = {};
        
        lines.forEach(line => {
             const [key, val] = line.split('=');
             if (!key || !val) return;
             if (key.includes('API_KEY')) config.apiKey = val.trim();
             if (key.includes('AUTH_DOMAIN')) config.authDomain = val.trim();
             if (key.includes('PROJECT_ID')) config.projectId = val.trim();
             if (key.includes('STORAGE_BUCKET')) config.storageBucket = val.trim();
             if (key.includes('MESSAGING_SENDER_ID')) config.messagingSenderId = val.trim();
             if (key.includes('APP_ID')) config.appId = val.trim();
        });

        const fileContent = `const firebaseConfig = {
    apiKey: "${config.apiKey}",
    authDomain: "${config.authDomain}",
    projectId: "${config.projectId}",
    storageBucket: "${config.storageBucket}",
    messagingSenderId: "${config.messagingSenderId}",
    appId: "${config.appId}"
};

export default firebaseConfig;`;

        await writeFile('../static_site/config.js', fileContent);
        console.log('Generated static_site/config.js');
        console.log('API Key present:', !!config.apiKey);

    } catch (e) {
        console.error('Failed to read .env.local', e);
    }
}

generate();

import fetch from 'node-fetch';

const BASE_URL = 'https://api.iriusrisk.com/api/v1';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
};

async function createComponent() {
    const body = JSON.stringify({
        ref: 'aws-s3-bucket',
        name: 'AWS S3 Bucket',
        desc: 'An AWS S3 Bucket component',
        visible: true,
        category: {
            name: 'Cloud Storage'
        }
    });

    const response = await fetch(`${BASE_URL}/security-content/components`, {
        method: 'POST',
        headers,
        body
    });
    return response.json();
}

async function createLibrary() {
    const body = JSON.stringify({
        ref: 'custom-lib',
        name: 'Custom Library',
        desc: 'A library for custom risk patterns'
    });

    const response = await fetch(`${BASE_URL}/libraries`, {
        method: 'POST',
        headers,
        body
    });
    return response.json();
}

async function createRiskPattern(libraryId: string) {
    const body = JSON.stringify({
        ref: 's3-risk-pattern',
        name: 'S3 Data Risk',
        desc: 'Risks associated with S3 Buckets'
    });

    const response = await fetch(`${BASE_URL}/libraries/${libraryId}/riskpatterns`, {
        method: 'POST',
        headers,
        body
    });
    return response.json();
}

async function addThreatToRiskPattern(libraryId: string, riskPatternId: string) {
    const body = JSON.stringify({
        ref: 'threat-1',
        name: 'Threat 1',
        desc: 'Description of Threat 1'
    });

    const response = await fetch(`${BASE_URL}/libraries/${libraryId}/riskpatterns/${riskPatternId}/usecases`, {
        method: 'POST',
        headers,
        body
    });
    return response.json();
}

async function updateComponent(componentId: string, libraryRef: string, riskPatternRef: string) {
    const body = JSON.stringify({
        riskPatterns: [
            {
                libraryRef,
                ref: riskPatternRef
            }
        ]
    });

    const response = await fetch(`${BASE_URL}/security-content/components/${componentId}`, {
        method: 'PUT',
        headers,
        body
    });
    return response.json();
}

async function main() {
    try {
        const component = await createComponent();
        const library = await createLibrary();
        const riskPattern = await createRiskPattern(library.ref);
        const threat = await addThreatToRiskPattern(library.ref, riskPattern.ref);
        const updatedComponent = await updateComponent(component.ref, library.ref, riskPattern.ref);

        console.log('Component created:', component);
        console.log('Library created:', library);
        console.log('Risk Pattern created:', riskPattern);
        console.log('Threat added:', threat);
        console.log('Component updated:', updatedComponent);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

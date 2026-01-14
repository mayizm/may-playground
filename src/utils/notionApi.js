// Notion API utility functions

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3000';

export async function syncNotionProjects() {
  try {
    const response = await fetch(`${API_BASE}/api/notion-sync`);

    if (!response.ok) {
      throw new Error(`Failed to sync: ${response.statusText}`);
    }

    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error syncing Notion projects:', error);
    // Return empty array if Notion is not configured yet
    return [];
  }
}

export async function exportToNotion(testPlan) {
  try {
    const response = await fetch(`${API_BASE}/api/notion-export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ testPlan })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to export to Notion');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    throw error;
  }
}

export async function generateTestUpdates(requirementChange, existingTestPlan, screenshot) {
  try {
    // Convert screenshot to base64 if provided
    let screenshotData = null;
    if (screenshot) {
      screenshotData = await fileToBase64(screenshot);
    }

    const response = await fetch(`${API_BASE}/api/generate-test-updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requirementChange,
        existingTestPlan,
        screenshot: screenshotData
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate test updates');
    }

    const data = await response.json();
    return data.testCases;
  } catch (error) {
    console.error('Error generating test updates:', error);
    throw error;
  }
}

// Helper function to convert file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Remove data URL prefix
      resolve({
        base64Data: base64String,
        mimeType: file.type
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

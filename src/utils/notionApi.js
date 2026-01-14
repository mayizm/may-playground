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

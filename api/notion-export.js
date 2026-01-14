import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testPlan } = req.body;

    if (!testPlan) {
      return res.status(400).json({ error: 'Test plan data is required' });
    }

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_DATABASE_ID || '2599a3c647cf43b1926517099437fae5';

    // Create a new page in the database
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      icon: {
        type: 'emoji',
        emoji: '🧪'
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: testPlan.title || '[Test Plan] Untitled'
              }
            }
          ]
        },
        Status: {
          select: {
            name: testPlan.status || 'In progress'
          }
        },
        Team: testPlan.team ? {
          select: {
            name: testPlan.team
          }
        } : undefined
      },
      children: buildNotionBlocks(testPlan)
    });

    res.status(200).json({
      success: true,
      notionUrl: response.url,
      pageId: response.id
    });
  } catch (error) {
    console.error('Notion export error:', error);
    res.status(500).json({
      error: 'Failed to export to Notion',
      message: error.message,
      details: error.body || error
    });
  }
}

function buildNotionBlocks(testPlan) {
  const blocks = [];

  // Add objectives section
  if (testPlan.objectives) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: '🎯 Objectives & Scope' } }]
      }
    });

    if (testPlan.objectives.inScope?.length) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'In-scope' } }]
        }
      });

      testPlan.objectives.inScope.forEach(item => {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: item } }]
          }
        });
      });
    }

    if (testPlan.objectives.outOfScope?.length) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'Out of scope' } }]
        }
      });

      testPlan.objectives.outOfScope.forEach(item => {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: item } }]
          }
        });
      });
    }
  }

  // Add documents section
  if (testPlan.documents) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: '📚 Documents' } }]
      }
    });

    const docs = [];
    if (testPlan.documents.prd) {
      docs.push(`PRD: ${testPlan.documents.prd.name}`);
    }
    if (testPlan.documents.techSpec) {
      docs.push(`Tech Spec: ${testPlan.documents.techSpec.name}`);
    }
    if (testPlan.documents.splitFlag) {
      docs.push(`Feature Flag: ${testPlan.documents.splitFlag}`);
    }

    docs.forEach(doc => {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ text: { content: doc } }]
        }
      });
    });
  }

  // Add test cases summary
  if (testPlan.sections) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: '🧪 Test Cases' } }]
      }
    });

    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: `This test plan contains ${testPlan.sections.length} test sections. View the detailed test plan in the QA Test Hub.` } }]
      }
    });
  }

  return blocks;
}
